-- =========================================================================
-- RAYONGCOOP DIGITAL PORTAL - Migration 010
-- RYCOOP LED Member Check (ระบบตรวจสอบสมาชิกสหกรณ์กับข้อมูลกรมบังคับคดี)
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. LED CHECK RUNS
CREATE TABLE IF NOT EXISTS `led_check_runs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `run_type` ENUM('MANUAL', 'BATCH', 'SCHEDULED') NOT NULL,
    `started_at` DATETIME NULL,
    `completed_at` DATETIME NULL,
    `total_members` INT UNSIGNED NOT NULL DEFAULT 0,
    `checked_members` INT UNSIGNED NOT NULL DEFAULT 0,
    `not_found_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `possible_match_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `review_required_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `verified_match_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `false_match_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `api_error_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `status` ENUM('PENDING', 'RUNNING', 'COMPLETED', 'PARTIAL', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `initiated_by` BIGINT UNSIGNED NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_led_runs_status_created` (`status`, `created_at`),
    INDEX `idx_led_runs_type_created` (`run_type`, `created_at`),
    INDEX `idx_led_runs_initiated_by` (`initiated_by`),
    CONSTRAINT `fk_led_runs_initiated_by` FOREIGN KEY (`initiated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. LED CHECK RESULTS
CREATE TABLE IF NOT EXISTS `led_check_results` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `run_id` BIGINT UNSIGNED NOT NULL,
    `member_id` BIGINT UNSIGNED NOT NULL,
    `query_value` VARCHAR(255) NOT NULL,
    `query_type` ENUM('FULL_NAME', 'FIRST_NAME_LAST_NAME', 'MEMBER_NO') NOT NULL,
    `checked_at` DATETIME NOT NULL,
    `api_total` INT UNSIGNED NOT NULL DEFAULT 0,
    `match_score` DECIMAL(5,2) NULL,
    `status` ENUM(
        'NOT_FOUND',
        'POSSIBLE_MATCH',
        'MULTIPLE_MATCH',
        'REVIEW_REQUIRED',
        'VERIFIED_MATCH',
        'FALSE_MATCH',
        'API_ERROR'
    ) NOT NULL,
    `api_response_hash` CHAR(64) NULL,
    `reviewed_by` BIGINT UNSIGNED NULL,
    `reviewed_at` DATETIME NULL,
    `review_note` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_led_results_member_checked` (`member_id`, `checked_at`),
    INDEX `idx_led_results_status_checked` (`status`, `checked_at`),
    INDEX `idx_led_results_run_id` (`run_id`),
    INDEX `idx_led_results_reviewed_by` (`reviewed_by`),
    CONSTRAINT `fk_led_results_run` FOREIGN KEY (`run_id`) REFERENCES `led_check_runs` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_led_results_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_led_results_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. LED MATCH RECORDS
CREATE TABLE IF NOT EXISTS `led_match_records` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `check_result_id` BIGINT UNSIGNED NOT NULL,
    `external_record_id` VARCHAR(100) NULL,
    `external_data_json` JSON NULL,
    `normalized_name` VARCHAR(255) NULL,
    `match_score` DECIMAL(5,2) NULL,
    `match_reason` VARCHAR(255) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_led_match_check_result` (`check_result_id`),
    INDEX `idx_led_match_external_id` (`external_record_id`),
    CONSTRAINT `fk_led_match_check_result` FOREIGN KEY (`check_result_id`) REFERENCES `led_check_results` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. SEED DEFAULT SYSTEM SETTINGS FOR LED CHECK
INSERT IGNORE INTO `site_settings` (`key`, `value`, `group`, `is_public`, `created_at`, `updated_at`) VALUES
('led_auto_check_enabled', '0', 'led', 0, NOW(), NOW()),
('led_auto_check_time', '08:00', 'led', 0, NOW(), NOW()),
('led_batch_size', '50', 'led', 0, NOW(), NOW()),
('led_request_delay', '500', 'led', 0, NOW(), NOW()),
('led_retry_count', '3', 'led', 0, NOW(), NOW()),
('led_timeout', '15', 'led', 0, NOW(), NOW()),
('admin_notification_enabled', '1', 'led', 0, NOW(), NOW()),
('timezone', 'Asia/Bangkok', 'general', 1, NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;
