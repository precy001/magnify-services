<?php
// Database connection — edit these values to match your setup.
// XAMPP defaults: user "root" with an empty password.
$DB_HOST = 'localhost';
$DB_NAME = 'magnify2_contact';
$DB_USER = 'magnify2_contact';
$DB_PASS = 'Ultimate))@@#';

try {
    $pdo = new PDO(
        "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'error' => 'Database connection failed']);
    exit;
}
