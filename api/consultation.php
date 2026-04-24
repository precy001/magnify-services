<?php
// Handles submissions from the public "Book a Visit" (consultation) form.
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
$date    = trim($input['date']    ?? '');
$time    = trim($input['time']    ?? '');
$service = trim($input['service'] ?? '');
$message = trim($input['message'] ?? '');

// Required fields
if ($name === '' || $email === '' || $phone === '' || $date === '' || $time === '') {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'error' => 'Name, email, phone, preferred date, and preferred time are required',
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid email address']);
    exit;
}

// Date must be YYYY-MM-DD and not in the past.
$d = DateTime::createFromFormat('Y-m-d', $date);
if (!$d || $d->format('Y-m-d') !== $date) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid date']);
    exit;
}
$today = new DateTime('today');
if ($d < $today) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Date cannot be in the past']);
    exit;
}

// Time slot must be one of the allowed options.
if (!in_array($time, ['morning', 'afternoon', 'evening'], true)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid time slot']);
    exit;
}

$stmt = $pdo->prepare(
    'INSERT INTO consultation_requests
        (name, email, phone, preferred_date, preferred_time, service, message)
     VALUES
        (:name, :email, :phone, :date, :time, :service, :message)'
);
$stmt->execute([
    ':name'    => $name,
    ':email'   => $email,
    ':phone'   => $phone,
    ':date'    => $date,
    ':time'    => $time,
    ':service' => $service ?: null,
    ':message' => $message ?: null,
]);

echo json_encode([
    'ok' => true,
    'message' => "Thanks! We'll be in touch within 24 hours to confirm your appointment.",
]);
