<?php
/**
 * View a single contact submission. Opening this page marks it as read.
 */
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/../api/db.php';

admin_require_login();

$id = (int) ($_GET['id'] ?? 0);
if ($id <= 0) {
    header('Location: dashboard.php');
    exit;
}

$pdo = db();
$stmt = $pdo->prepare('SELECT * FROM contact_submissions WHERE id = ?');
$stmt->execute([$id]);
$row = $stmt->fetch();

if (!$row) {
    $pageTitle = 'Not found';
    require __DIR__ . '/includes/header.php';
    echo '<section class="card"><h1>Submission not found</h1>';
    echo '<p><a class="btn btn-ghost" href="dashboard.php">← Back to dashboard</a></p></section>';
    require __DIR__ . '/includes/footer.php';
    exit;
}

// Auto-mark as read on open.
if (empty($row['is_read'])) {
    $pdo->prepare('UPDATE contact_submissions SET is_read = 1 WHERE id = ?')->execute([$id]);
    $row['is_read'] = 1;
}

$pageTitle = 'Submission #' . $id;
require __DIR__ . '/includes/header.php';
?>
<p><a class="back" href="dashboard.php">← Back to dashboard</a></p>

<section class="card">
    <header class="view-header">
        <div>
            <h1 class="view-subject">
                <?= $row['subject'] ? e($row['subject']) : '<span class="muted">No subject</span>' ?>
            </h1>
            <p class="muted small">
                Submission #<?= (int) $row['id'] ?> ·
                <?= e(date('F j, Y \a\t g:i a', strtotime($row['created_at']))) ?>
            </p>
        </div>

        <form method="post" action="action.php" class="view-actions">
            <input type="hidden" name="csrf" value="<?= e(admin_csrf_token()) ?>">
            <input type="hidden" name="id" value="<?= (int) $row['id'] ?>">
            <input type="hidden" name="return_to" value="dashboard.php">

            <button class="btn btn-ghost" type="submit" name="action" value="mark_unread">
                Mark as unread
            </button>
            <button class="btn btn-danger" type="submit" name="action" value="delete"
                    data-confirm="Delete this submission? This cannot be undone.">
                Delete
            </button>
        </form>
    </header>

    <dl class="meta">
        <div><dt>From</dt><dd><?= e($row['name']) ?></dd></div>
        <div>
            <dt>Email</dt>
            <dd>
                <a href="mailto:<?= e($row['email']) ?><?= $row['subject'] ? '?subject=' . rawurlencode('Re: ' . $row['subject']) : '' ?>">
                    <?= e($row['email']) ?>
                </a>
            </dd>
        </div>
        <?php if (!empty($row['phone'])): ?>
            <div>
                <dt>Phone</dt>
                <dd><a href="tel:<?= e($row['phone']) ?>"><?= e($row['phone']) ?></a></dd>
            </div>
        <?php endif; ?>
        <?php if (!empty($row['ip_address'])): ?>
            <div><dt>IP address</dt><dd class="muted"><?= e($row['ip_address']) ?></dd></div>
        <?php endif; ?>
    </dl>

    <h2 class="mt">Message</h2>
    <div class="message"><?= nl2br(e($row['message'])) ?></div>

    <?php if (!empty($row['user_agent'])): ?>
        <details class="ua">
            <summary>User agent</summary>
            <code><?= e($row['user_agent']) ?></code>
        </details>
    <?php endif; ?>
</section>

<script>
    document.querySelectorAll('[data-confirm]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            if (!confirm(this.dataset.confirm)) e.preventDefault();
        });
    });
</script>
<?php require __DIR__ . '/includes/footer.php'; ?>
