CREATE TABLE IF NOT EXISTS `rate_limit_attempts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `rate_key` VARCHAR(64) NOT NULL,
    `ip_address` VARCHAR(45) NOT NULL,
    `window_started_at` DATETIME NOT NULL,
    `attempts` INT UNSIGNED NOT NULL DEFAULT 0,
    `updated_at` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `rate_limit_attempts_key_ip_unique` (`rate_key`, `ip_address`),
    KEY `rate_limit_attempts_updated_at_index` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
