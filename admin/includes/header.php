<?php
/** Shared admin header — expects $pageTitle to be defined (optional). */
if (!isset($pageTitle)) {
    $pageTitle = 'Admin';
}
?><!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title><?= e($pageTitle) ?> — Magnify Services Admin</title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
<header class="topbar">
    <div class="topbar-inner">
        <a class="brand" href="dashboard.php">
            <span class="brand-mark"></span>
            Magnify Services · Admin
        </a>
        <?php if (admin_is_logged_in()): ?>
            <nav class="topnav">
                <a href="dashboard.php">Dashboard</a>
                <span class="user">Signed in as <strong><?= e($_SESSION['admin_user'] ?? '') ?></strong></span>
                <a class="btn btn-ghost" href="logout.php">Log out</a>
            </nav>
        <?php endif; ?>
    </div>
</header>
<main class="container">
