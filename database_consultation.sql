-- Adds the consultation_requests table (Book a Visit form).
-- Run this once after database.sql, the same way — Import in phpMyAdmin
-- or:  mysql -u root -p < database_consultation.sql

USE magnify_services;

CREATE TABLE IF NOT EXISTS consultation_requests (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    phone           VARCHAR(50)  NOT NULL,
    preferred_date  DATE         NOT NULL,
    preferred_time  VARCHAR(20)  NOT NULL,   -- 'morning' | 'afternoon' | 'evening'
    service         VARCHAR(100) NULL,        -- service id from src/lib/constants.ts
    message         TEXT         NULL,
    status          VARCHAR(20)  NOT NULL DEFAULT 'pending',
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
