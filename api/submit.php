<?php
/**
 * POST /api/submit.php
 *
 * Accepts a JSON body OR standard form-encoded fields:
 *   { name, email, phone?, subject?, message }
 *
 * Validates, rate-limits per IP, stores the submission, optionally emails
 * the configured notification address, and responds with JSON.
 */

require_once __DIR__ . '/db.php';

// mbstring isn't installed on every shared host — fall back gracefully.
if (!function_exists('mb_strlen')) {
    function mb_strlen(string $s): int { return strlen($s); }
}
if (!function_exists('mb_substr')) {
    function mb_substr(string $s, int $start, ?int $length = null): string {
        return $length === null ? substr($s, $start) : substr($s, $start, $length);
    }
}

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// ---------- CORS ----------
$origin = ALLOWED_ORIGIN;
if ($origin === '*') {
    header('Access-Control-Allow-Origin: *');
} else {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// ---------- Read input (JSON or form) ----------
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$input = [];
if (stripos($contentType, 'application/json') !== false) {
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $input = $decoded;
    }
} else {
    $input = $_POST;
}

$name    = trim((string) ($input['name']    ?? ''));
$email   = trim((string) ($input['email']   ?? ''));
$phone   = trim((string) ($input['phone']   ?? ''));
$subject = trim((string) ($input['subject'] ?? ''));
$message = trim((string) ($input['message'] ?? ''));

// Honeypot — bots typically fill every field. Humans shouldn't see or fill this.
$honeypot = trim((string) ($input['website'] ?? ''));
if ($honeypot !== '') {
    // Pretend success so bots don't retry.
    echo json_encode(['ok' => true, 'message' => 'Thank you.']);
    exit;
}

// ---------- Validation ----------
$errors = [];
if ($name === '' || mb_strlen($name) > 150) {
    $errors['name'] = 'Please provide a valid name (max 150 chars).';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 255) {
    $errors['email'] = 'Please provide a valid email address.';
}
if ($phone !== '' && mb_strlen($phone) > 50) {
    $errors['phone'] = 'Phone number is too long.';
}
if ($subject !== '' && mb_strlen($subject) > 100) {
    $errors['subject'] = 'Subject is too long.';
}
if ($message === '' || mb_strlen($message) > 5000) {
    $errors['message'] = 'Please provide a message (max 5000 chars).';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Validation failed', 'fields' => $errors]);
    exit;
}

// ---------- Rate limiting ----------
$ip = $_SERVER['REMOTE_ADDR'] ?? '';
$userAgent = substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 500);

try {
    $pdo = db();

    if (RATE_LIMIT_PER_HOUR > 0 && $ip !== '') {
        // Prune old entries.
        if (DB_DRIVER === 'sqlite') {
            $pdo->exec("DELETE FROM rate_limit WHERE submitted_at < datetime('now', '-1 hour')");
        } else {
            $pdo->exec("DELETE FROM rate_limit WHERE submitted_at < (NOW() - INTERVAL 1 HOUR)");
        }

        $stmt = $pdo->prepare('SELECT COUNT(*) FROM rate_limit WHERE ip_address = ?');
        $stmt->execute([$ip]);
        $count = (int) $stmt->fetchColumn();

        if ($count >= RATE_LIMIT_PER_HOUR) {
            http_response_code(429);
            echo json_encode([
                'ok' => false,
                'error' => 'Too many submissions. Please try again later.',
            ]);
            exit;
        }

        $pdo->prepare('INSERT INTO rate_limit (ip_address) VALUES (?)')->execute([$ip]);
    }

    // ---------- Insert ----------
    $stmt = $pdo->prepare('
        INSERT INTO contact_submissions
            (name, email, phone, subject, message, ip_address, user_agent)
        VALUES
            (:name, :email, :phone, :subject, :message, :ip, :ua)
    ');
    $stmt->execute([
        ':name'    => $name,
        ':email'   => $email,
        ':phone'   => $phone !== '' ? $phone : null,
        ':subject' => $subject !== '' ? $subject : null,
        ':message' => $message,
        ':ip'      => $ip !== '' ? $ip : null,
        ':ua'      => $userAgent !== '' ? $userAgent : null,
    ]);

    $id = (int) $pdo->lastInsertId();
} catch (Throwable $e) {
    error_log('[contact] DB error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => DEBUG_MODE ? $e->getMessage() : 'Server error. Please try again.',
    ]);
    exit;
}

// ---------- Optional notification email ----------
if (NOTIFY_EMAIL !== '') {
    $body  = "New contact form submission (#$id)\n\n";
    $body .= "Name:    $name\n";
    $body .= "Email:   $email\n";
    if ($phone !== '')   { $body .= "Phone:   $phone\n"; }
    if ($subject !== '') { $body .= "Subject: $subject\n"; }
    $body .= "\nMessage:\n$message\n";

    $headers  = "From: " . NOTIFY_FROM . "\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";

    // mail() may be disabled in dev; failures are non-fatal.
    @mail(
        NOTIFY_EMAIL,
        '[Magnify Services] New contact form submission',
        $body,
        $headers
    );
}

echo json_encode([
    'ok' => true,
    'id' => $id,
    'message' => 'Thank you — we will get back to you within 24 hours.',
]);
