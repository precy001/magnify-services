<?php
/**
 * Admin login — GET shows form, POST authenticates.
 */
require_once __DIR__ . '/includes/auth.php';

if (admin_is_logged_in()) {
    header('Location: dashboard.php');
    exit;
}

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = trim((string) ($_POST['username'] ?? ''));
    $pass = (string) ($_POST['password'] ?? '');

    // Slow down brute-force attempts a little.
    usleep(random_int(150000, 400000));

    $userOk = hash_equals(ADMIN_USERNAME, $user);
    $passOk = password_verify($pass, ADMIN_PASSWORD_HASH);

    if ($userOk && $passOk) {
        admin_login($user);
        header('Location: dashboard.php');
        exit;
    }

    $error = 'Invalid username or password.';
}

$pageTitle = 'Sign in';
require __DIR__ . '/includes/header.php';
?>
<section class="card card-narrow">
    <h1>Sign in</h1>
    <p class="muted">Admin access to contact form submissions.</p>

    <?php if ($error): ?>
        <div class="alert alert-error"><?= e($error) ?></div>
    <?php endif; ?>

    <form method="post" action="login.php" autocomplete="off" class="form">
        <label>
            <span>Username</span>
            <input type="text" name="username" required autofocus
                   value="<?= e($_POST['username'] ?? '') ?>">
        </label>
        <label>
            <span>Password</span>
            <input type="password" name="password" required>
        </label>
        <button class="btn btn-primary" type="submit">Sign in</button>
    </form>

    <p class="muted small">
        Default credentials are <code>admin</code> / <code>changeme</code>.
        Change <code>ADMIN_PASSWORD_HASH</code> in <code>api/config.php</code>
        before deploying.
    </p>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
