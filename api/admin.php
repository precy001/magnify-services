<?php
// Admin API — all endpoints:
//   POST   ?action=login              { username, password }   -> logs in, starts session
//   POST   ?action=logout                                       -> destroys session
//   GET    ?action=me                                           -> returns current user or 401
//
//   GET    ?action=list_contacts                                -> all contact-form submissions
//   POST   ?action=delete_contact     { id }                    -> delete one contact message
//
//   GET    ?action=list_consultations                           -> all book-a-visit requests
//   POST   ?action=delete_consultation           { id }         -> delete one request
//   POST   ?action=update_consultation_status    { id, status } -> pending|confirmed|completed|cancelled
//
// `list` and `delete` are kept as aliases for list_contacts / delete_contact.
require __DIR__ . '/db.php';

session_start();
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

function input(): array {
    $data = $_POST;
    if (empty($data)) {
        $data = json_decode(file_get_contents('php://input'), true) ?: [];
    }
    return $data;
}

function require_login(): void {
    if (empty($_SESSION['admin_id'])) {
        http_response_code(401);
        echo json_encode(['ok' => false, 'error' => 'Not logged in']);
        exit;
    }
}

switch ($action) {

    case 'login': {
        global $pdo;
        $in = input();
        $username = trim($in['username'] ?? '');
        $password = $in['password'] ?? '';

        $stmt = $pdo->prepare('SELECT id, username, password_hash FROM admin_users WHERE username = ?');
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            http_response_code(401);
            echo json_encode(['ok' => false, 'error' => 'Invalid username or password']);
            exit;
        }

        session_regenerate_id(true);
        $_SESSION['admin_id']       = $user['id'];
        $_SESSION['admin_username'] = $user['username'];

        echo json_encode(['ok' => true, 'username' => $user['username']]);
        break;
    }

    case 'logout': {
        $_SESSION = [];
        session_destroy();
        echo json_encode(['ok' => true]);
        break;
    }

    case 'me': {
        if (empty($_SESSION['admin_id'])) {
            http_response_code(401);
            echo json_encode(['ok' => false]);
            exit;
        }
        echo json_encode(['ok' => true, 'username' => $_SESSION['admin_username']]);
        break;
    }

    case 'list':          // alias
    case 'list_contacts': {
        global $pdo;
        require_login();
        $rows = $pdo->query(
            'SELECT id, name, email, phone, subject, message, created_at
             FROM contact_submissions
             ORDER BY created_at DESC, id DESC'
        )->fetchAll();
        echo json_encode(['ok' => true, 'submissions' => $rows]);
        break;
    }

    case 'delete':          // alias
    case 'delete_contact': {
        global $pdo;
        require_login();
        $id = (int) (input()['id'] ?? 0);
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Invalid id']);
            exit;
        }
        $pdo->prepare('DELETE FROM contact_submissions WHERE id = ?')->execute([$id]);
        echo json_encode(['ok' => true]);
        break;
    }

    case 'list_consultations': {
        global $pdo;
        require_login();
        $rows = $pdo->query(
            'SELECT id, name, email, phone, preferred_date, preferred_time,
                    service, message, status, created_at
             FROM consultation_requests
             ORDER BY created_at DESC, id DESC'
        )->fetchAll();
        echo json_encode(['ok' => true, 'consultations' => $rows]);
        break;
    }

    case 'delete_consultation': {
        global $pdo;
        require_login();
        $id = (int) (input()['id'] ?? 0);
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Invalid id']);
            exit;
        }
        $pdo->prepare('DELETE FROM consultation_requests WHERE id = ?')->execute([$id]);
        echo json_encode(['ok' => true]);
        break;
    }

    case 'update_consultation_status': {
        global $pdo;
        require_login();
        $in = input();
        $id = (int) ($in['id'] ?? 0);
        $status = trim((string) ($in['status'] ?? ''));
        $allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
        if ($id <= 0 || !in_array($status, $allowed, true)) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Invalid id or status']);
            exit;
        }
        $pdo->prepare('UPDATE consultation_requests SET status = ? WHERE id = ?')
            ->execute([$status, $id]);
        echo json_encode(['ok' => true]);
        break;
    }

    default:
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Unknown action']);
}
