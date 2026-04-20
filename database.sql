-- Run this once in phpMyAdmin (Import tab → choose file → Go)
-- or from the command line:  mysql -u root -p < database.sql

CREATE DATABASE IF NOT EXISTS magnify_services
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE magnify_services;

CREATE TABLE IF NOT EXISTS contact_submissions (
    id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(150) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    phone      VARCHAR(50)  NULL,
    subject    VARCHAR(100) NULL,
    message    TEXT         NOT NULL,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_users (
    id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default admin — username: admin, password: changeme
-- To change the password later, generate a new hash with:
--   php -r "echo password_hash('your-new-password', PASSWORD_BCRYPT);"
-- then run:
--   UPDATE admin_users SET password_hash = '<hash>' WHERE username = 'admin';
INSERT IGNORE INTO admin_users (username, password_hash) VALUES
  ('admin', '$2y$10$1FSVr7BXF8IhSz6jTFAPauDDkbM2MKL74jmW3QhypbVAsIw8WS6.K');
