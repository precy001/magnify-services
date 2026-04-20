<?php
// Handles submissions from the public contact form.
require __DIR__ . '/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// Accept JSON or form-encoded bodies.
$input = $_POST;
if (empty($input)) {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
}

$name    = trim($input['name']    ?? '');
$email   = trim($input['email']   ?? '');
$phone   = trim($input['phone']   ?? '');
$subject = trim($input['subject'] ?? '');
$message = trim($input['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Name, email, and message are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid email address']);
    exit;
}

$stmt = $pdo->prepare(
    'INSERT INTO contact_submissions (name, email, phone, subject, message)
     VALUES (:name, :email, :phone, :subject, :message)'
);
$stmt->execute([
    ':name'    => $name,
    ':email'   => $email,
    ':phone'   => $phone ?: null,
    ':subject' => $subject ?: null,
    ':message' => $message,
]);

echo json_encode(['ok' => true, 'message' => 'Thanks! We will get back to you soon.']);
