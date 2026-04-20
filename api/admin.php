<?php
// Admin API — all endpoints:
//   POST   ?action=login     { username, password }   -> logs in, starts session
//   POST   ?action=logout                              -> destroys session
//   GET    ?action=me                                  -> returns current user or 401
//   GET    ?action=list                                -> returns all submissions
//   POST   ?action=delete    { id }                    -> deletes one submission
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

    case 'list': {
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

    case 'delete': {
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

    default:
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Unknown action']);
}
