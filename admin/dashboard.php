<?php
/**
 * Admin dashboard — list of contact submissions.
 *
 * Query params:
 *   filter = all | unread | read   (default: all)
 *   q      = search string (name / email / subject / message)
 *   page   = 1-based page number
 */
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/../api/db.php';

admin_require_login();

$pdo = db();

$filter = $_GET['filter'] ?? 'all';
if (!in_array($filter, ['all', 'unread', 'read'], true)) {
    $filter = 'all';
}

$q = trim((string) ($_GET['q'] ?? ''));
$page = max(1, (int) ($_GET['page'] ?? 1));
$perPage = 20;
$offset = ($page - 1) * $perPage;

$where = [];
$params = [];

if ($filter === 'unread') {
    $where[] = 'is_read = 0';
} elseif ($filter === 'read') {
    $where[] = 'is_read = 1';
}

if ($q !== '') {
    $where[] = '(name LIKE :q OR email LIKE :q OR subject LIKE :q OR message LIKE :q)';
    $params[':q'] = '%' . $q . '%';
}

$whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

// Totals
$countStmt = $pdo->prepare("SELECT COUNT(*) FROM contact_submissions $whereSql");
$countStmt->execute($params);
$total = (int) $countStmt->fetchColumn();
$totalPages = max(1, (int) ceil($total / $perPage));
if ($page > $totalPages) {
    $page = $totalPages;
    $offset = ($page - 1) * $perPage;
}

// Aggregate counts for the filter bar
$allCount    = (int) $pdo->query('SELECT COUNT(*) FROM contact_submissions')->fetchColumn();
$unreadCount = (int) $pdo->query('SELECT COUNT(*) FROM contact_submissions WHERE is_read = 0')->fetchColumn();
$readCount   = $allCount - $unreadCount;

// Page rows
$sql = "SELECT id, name, email, phone, subject, message, is_read, created_at
        FROM contact_submissions
        $whereSql
        ORDER BY created_at DESC, id DESC
        LIMIT :limit OFFSET :offset";
$stmt = $pdo->prepare($sql);
foreach ($params as $k => $v) {
    $stmt->bindValue($k, $v);
}
$stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll();

function qs(array $overrides = []): string
{
    $merged = array_merge($_GET, $overrides);
    $merged = array_filter($merged, fn($v) => $v !== '' && $v !== null);
    return http_build_query($merged);
}

$flash = null;
if (!empty($_GET['msg'])) {
    $flashMap = [
        'marked_read'   => 'Submission marked as read.',
        'marked_unread' => 'Submission marked as unread.',
        'deleted'       => 'Submission deleted.',
        'bulk_read'     => 'Selected submissions marked as read.',
        'bulk_deleted'  => 'Selected submissions deleted.',
    ];
    $flash = $flashMap[$_GET['msg']] ?? null;
}

$pageTitle = 'Dashboard';
require __DIR__ . '/includes/header.php';
?>
<section class="stats">
    <div class="stat">
        <span class="stat-label">Total submissions</span>
        <span class="stat-value"><?= number_format($allCount) ?></span>
    </div>
    <div class="stat stat-accent">
        <span class="stat-label">Unread</span>
        <span class="stat-value"><?= number_format($unreadCount) ?></span>
    </div>
    <div class="stat">
        <span class="stat-label">Read</span>
        <span class="stat-value"><?= number_format($readCount) ?></span>
    </div>
</section>

<?php if ($flash): ?>
    <div class="alert alert-success"><?= e($flash) ?></div>
<?php endif; ?>

<section class="card">
    <div class="toolbar">
        <div class="tabs">
            <a href="?<?= e(qs(['filter' => 'all', 'page' => null])) ?>"
               class="tab <?= $filter === 'all' ? 'is-active' : '' ?>">
                All <span class="count"><?= $allCount ?></span>
            </a>
            <a href="?<?= e(qs(['filter' => 'unread', 'page' => null])) ?>"
               class="tab <?= $filter === 'unread' ? 'is-active' : '' ?>">
                Unread <span class="count"><?= $unreadCount ?></span>
            </a>
            <a href="?<?= e(qs(['filter' => 'read', 'page' => null])) ?>"
               class="tab <?= $filter === 'read' ? 'is-active' : '' ?>">
                Read <span class="count"><?= $readCount ?></span>
            </a>
        </div>

        <form method="get" action="dashboard.php" class="search">
            <input type="hidden" name="filter" value="<?= e($filter) ?>">
            <input type="search" name="q" placeholder="Search name, email, subject, message…"
                   value="<?= e($q) ?>">
            <button class="btn btn-ghost" type="submit">Search</button>
            <?php if ($q !== ''): ?>
                <a class="btn btn-ghost" href="?<?= e(qs(['q' => null, 'page' => null])) ?>">Clear</a>
            <?php endif; ?>
        </form>
    </div>

    <?php if (!$rows): ?>
        <div class="empty">
            <p>No submissions match this view.</p>
        </div>
    <?php else: ?>
        <form method="post" action="action.php" class="bulk-form">
            <input type="hidden" name="csrf" value="<?= e(admin_csrf_token()) ?>">
            <input type="hidden" name="return_to" value="<?= e('dashboard.php?' . qs()) ?>">

            <div class="bulk-bar">
                <label class="check">
                    <input type="checkbox" id="check-all">
                    <span>Select all</span>
                </label>
                <div class="bulk-actions">
                    <button class="btn btn-ghost" type="submit" name="action" value="bulk_mark_read">
                        Mark as read
                    </button>
                    <button class="btn btn-danger" type="submit" name="action" value="bulk_delete"
                            data-confirm="Delete the selected submissions? This cannot be undone.">
                        Delete
                    </button>
                </div>
            </div>

            <div class="table-wrap">
                <table class="table">
                    <thead>
                    <tr>
                        <th class="col-check"></th>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Preview</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <?php foreach ($rows as $r):
                        $preview = mb_substr(preg_replace('/\s+/', ' ', $r['message']), 0, 90);
                        if (mb_strlen($r['message']) > 90) {
                            $preview .= '…';
                        }
                    ?>
                        <tr class="<?= empty($r['is_read']) ? 'row-unread' : '' ?>">
                            <td class="col-check">
                                <input type="checkbox" name="ids[]" value="<?= (int) $r['id'] ?>" class="row-check">
                            </td>
                            <td class="nowrap">
                                <?= e(date('M j, Y', strtotime($r['created_at']))) ?>
                                <div class="muted small"><?= e(date('g:i a', strtotime($r['created_at']))) ?></div>
                            </td>
                            <td>
                                <?php if (empty($r['is_read'])): ?><span class="dot" title="Unread"></span><?php endif; ?>
                                <?= e($r['name']) ?>
                            </td>
                            <td><a href="mailto:<?= e($r['email']) ?>"><?= e($r['email']) ?></a></td>
                            <td><?= $r['subject'] ? e($r['subject']) : '<span class="muted">—</span>' ?></td>
                            <td class="preview"><?= e($preview) ?></td>
                            <td class="nowrap">
                                <a class="btn btn-ghost btn-sm"
                                   href="view.php?id=<?= (int) $r['id'] ?>">Open</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </form>

        <?php if ($totalPages > 1): ?>
            <nav class="pagination">
                <?php if ($page > 1): ?>
                    <a class="btn btn-ghost btn-sm" href="?<?= e(qs(['page' => $page - 1])) ?>">← Prev</a>
                <?php else: ?>
                    <span class="btn btn-ghost btn-sm disabled">← Prev</span>
                <?php endif; ?>

                <span class="muted small">Page <?= $page ?> of <?= $totalPages ?> · <?= $total ?> results</span>

                <?php if ($page < $totalPages): ?>
                    <a class="btn btn-ghost btn-sm" href="?<?= e(qs(['page' => $page + 1])) ?>">Next →</a>
                <?php else: ?>
                    <span class="btn btn-ghost btn-sm disabled">Next →</span>
                <?php endif; ?>
            </nav>
        <?php endif; ?>
    <?php endif; ?>
</section>

<script>
    // Select-all
    document.getElementById('check-all')?.addEventListener('change', function (e) {
        document.querySelectorAll('.row-check').forEach(cb => cb.checked = e.target.checked);
    });
    // Confirm destructive actions
    document.querySelectorAll('[data-confirm]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            if (!confirm(this.dataset.confirm)) e.preventDefault();
        });
    });
</script>
<?php require __DIR__ . '/includes/footer.php'; ?>
