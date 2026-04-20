<?php
/**
 * Configuration for the contact form backend & admin dashboard.
 *
 * For production, override values via environment variables (recommended)
 * or edit this file directly. DO NOT commit real credentials.
 */

// ---------- Database ----------
// 'sqlite' (zero-setup, default) or 'mysql'.
define('DB_DRIVER', getenv('DB_DRIVER') ?: 'mysql');   // was 'sqlite'

define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'magnify_services');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');           // XAMPP default: empty// ---------- Admin credentials ----------
// To generate a new hash:
//   php -r "echo password_hash('your-new-password', PASSWORD_BCRYPT) . PHP_EOL;"
//
// The default password is "changeme". CHANGE THIS BEFORE GOING LIVE.
define('ADMIN_USERNAME', getenv('ADMIN_USERNAME') ?: 'admin');
define(
    'ADMIN_PASSWORD_HASH',
    getenv('ADMIN_PASSWORD_HASH')
        ?: '$2y$10$1FSVr7BXF8IhSz6jTFAPauDDkbM2MKL74jmW3QhypbVAsIw8WS6.K' // bcrypt('changeme')
);

// ---------- Notifications ----------
// Email to receive alerts when a new submission arrives. Leave empty to disable.
define('NOTIFY_EMAIL', getenv('NOTIFY_EMAIL') ?: '');
define('NOTIFY_FROM', getenv('NOTIFY_FROM') ?: 'no-reply@magnifyservices.local');

// ---------- CORS ----------
// Allowed origin for the frontend (use your production URL, e.g. https://magnifyservices.com).
// '*' is fine for local development.
define('ALLOWED_ORIGIN', getenv('ALLOWED_ORIGIN') ?: '*');

// ---------- Rate limiting ----------
// Max submissions per IP per hour. Set to 0 to disable.
define('RATE_LIMIT_PER_HOUR', (int) (getenv('RATE_LIMIT_PER_HOUR') ?: 10));

// ---------- Session ----------
define('SESSION_NAME', 'MAGNIFY_ADMIN');
define('SESSION_LIFETIME', 60 * 60 * 4); // 4 hours

// ---------- Error handling ----------
// In production, set to 0. Errors will still be logged by PHP.
define('DEBUG_MODE', (bool) (getenv('DEBUG_MODE') ?: false));

if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', '0');
}
