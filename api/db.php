<?php
/**
 * Database layer.
 *
 * Provides a single PDO connection (SQLite or MySQL) and initializes the
 * schema on first use. Callers should use db() to get the PDO instance.
 */

require_once __DIR__ . '/config.php';

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    if (DB_DRIVER === 'sqlite') {
        $dir = dirname(DB_SQLITE_PATH);
        if (!is_dir($dir)) {
            @mkdir($dir, 0775, true);
        }
        $pdo = new PDO('sqlite:' . DB_SQLITE_PATH);
        $pdo->exec('PRAGMA journal_mode = WAL;');
        $pdo->exec('PRAGMA foreign_keys = ON;');
    } elseif (DB_DRIVER === 'mysql') {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            DB_HOST,
            DB_PORT,
            DB_NAME
        );
        $pdo = new PDO($dsn, DB_USER, DB_PASS);
    } else {
        throw new RuntimeException('Unsupported DB_DRIVER: ' . DB_DRIVER);
    }

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    init_schema($pdo);

    return $pdo;
}

function init_schema(PDO $pdo): void
{
    if (DB_DRIVER === 'sqlite') {
        $pdo->exec('
            CREATE TABLE IF NOT EXISTS contact_submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                subject TEXT,
                message TEXT NOT NULL,
                ip_address TEXT,
                user_agent TEXT,
                is_read INTEGER NOT NULL DEFAULT 0,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        ');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_submissions(created_at);');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_contact_is_read ON contact_submissions(is_read);');

        $pdo->exec('
            CREATE TABLE IF NOT EXISTS rate_limit (
                ip_address TEXT NOT NULL,
                submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        ');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_rate_ip ON rate_limit(ip_address);');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_rate_time ON rate_limit(submitted_at);');
    } else { // mysql
        $pdo->exec('
            CREATE TABLE IF NOT EXISTS contact_submissions (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NULL,
                subject VARCHAR(100) NULL,
                message TEXT NOT NULL,
                ip_address VARCHAR(45) NULL,
                user_agent VARCHAR(500) NULL,
                is_read TINYINT(1) NOT NULL DEFAULT 0,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_contact_created_at (created_at),
                INDEX idx_contact_is_read (is_read)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');

        $pdo->exec('
            CREATE TABLE IF NOT EXISTS rate_limit (
                ip_address VARCHAR(45) NOT NULL,
                submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_rate_ip (ip_address),
                INDEX idx_rate_time (submitted_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ');
    }
}
