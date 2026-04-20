<?php
/**
 * Handles state-changing admin actions. All requests are POST + CSRF-checked.
 *
 * Supported actions (via $_POST['action']):
 *   mark_read, mark_unread, delete          — with `id`
 *   bulk_mark_read, bulk_delete             — with `ids[]`
 *
 * Redirects back to the `return_to` value (a relative admin URL) or dashboard.php.
 */
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/../api/db.php';

admin_require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: dashboard.php');
    exit;
}

if (!admin_csrf_check($_POST['csrf'] ?? null)) {
    http_response_code(400);
    echo 'Invalid request (CSRF). <a href="dashboard.php">Back</a>';
    exit;
}

$action = $_POST['action'] ?? '';
$pdo = db();

$returnTo = $_POST['return_to'] ?? 'dashboard.php';
// Only allow relative redirects inside admin/.
if (preg_match('~^(https?:|//|/)~i', $returnTo)) {
    $returnTo = 'dashboard.php';
}

function go(string $base, array $params): void
{
    $sep = (strpos($base, '?') === false) ? '?' : '&';
    header('Location: ' . $base . $sep . http_build_query($params));
    exit;
}

switch ($action) {
    case 'mark_read':
    case 'mark_unread': {
        $id = (int) ($_POST['id'] ?? 0);
        if ($id <= 0) { go($returnTo, []); }
        $val = $action === 'mark_read' ? 1 : 0;
        $pdo->prepare('UPDATE contact_submissions SET is_read = ? WHERE id = ?')
            ->execute([$val, $id]);
        go($returnTo, ['msg' => $action === 'mark_read' ? 'marked_read' : 'marked_unread']);
    }

    case 'delete': {
        $id = (int) ($_POST['id'] ?? 0);
        if ($id <= 0) { go($returnTo, []); }
        $pdo->prepare('DELETE FROM contact_submissions WHERE id = ?')->execute([$id]);
        // After deleting we can't stay on view.php — force back to dashboard.
        header('Location: dashboard.php?msg=deleted');
        exit;
    }

    case 'bulk_mark_read': {
        $ids = array_values(array_filter(array_map('intval', (array) ($_POST['ids'] ?? []))));
        if (!$ids) { go($returnTo, []); }
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $pdo->prepare("UPDATE contact_submissions SET is_read = 1 WHERE id IN ($placeholders)");
        $stmt->execute($ids);
        go($returnTo, ['msg' => 'bulk_read']);
    }

    case 'bulk_delete': {
        $ids = array_values(array_filter(array_map('intval', (array) ($_POST['ids'] ?? []))));
        if (!$ids) { go($returnTo, []); }
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $pdo->prepare("DELETE FROM contact_submissions WHERE id IN ($placeholders)");
        $stmt->execute($ids);
        go($returnTo, ['msg' => 'bulk_deleted']);
    }

    default:
        header('Location: dashboard.php');
        exit;
}
