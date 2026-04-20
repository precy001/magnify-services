<?php
/**
 * Shared authentication & session helpers for the admin area.
 */

require_once __DIR__ . '/../../api/config.php';

function admin_session_start(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_name(SESSION_NAME);
    session_set_cookie_params([
        'lifetime' => 0, // session cookie; we enforce lifetime in-session
        'path'     => '/',
        'domain'   => '',
        'secure'   => !empty($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();

    // Enforce idle timeout.
    if (isset($_SESSION['admin_login_at'])) {
        if ((time() - $_SESSION['admin_login_at']) > SESSION_LIFETIME) {
            admin_logout();
        }
    }
}

function admin_is_logged_in(): bool
{
    admin_session_start();
    return !empty($_SESSION['admin_logged_in']) && !empty($_SESSION['admin_user']);
}

function admin_require_login(): void
{
    if (!admin_is_logged_in()) {
        header('Location: login.php');
        exit;
    }
}

function admin_login(string $user): void
{
    admin_session_start();
    // Prevent session fixation.
    session_regenerate_id(true);
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_user']      = $user;
    $_SESSION['admin_login_at']  = time();
    $_SESSION['csrf_token']      = bin2hex(random_bytes(32));
}

function admin_logout(): void
{
    admin_session_start();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $p['path'],
            $p['domain'],
            $p['secure'],
            $p['httponly']
        );
    }
    session_destroy();
    header('Location: login.php');
    exit;
}

function admin_csrf_token(): string
{
    admin_session_start();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function admin_csrf_check(?string $token): bool
{
    admin_session_start();
    return !empty($_SESSION['csrf_token'])
        && is_string($token)
        && hash_equals($_SESSION['csrf_token'], $token);
}

function e(?string $s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
