-- Run this in phpMyAdmin on your existing Vidi Veda database.
-- Use this if only the assignments table failed to import.

CREATE TABLE IF NOT EXISTS `assignments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(20) NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'active',
  `parent_id` VARCHAR(50) NOT NULL,
  `child_id` INT NOT NULL,
  `tutor_id` VARCHAR(50) NOT NULL,
  `address` TEXT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `started_at` DATE NOT NULL,
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_assignments_type_status` (`type`, `status`),
  KEY `idx_assignments_parent_id` (`parent_id`),
  KEY `idx_assignments_child_id` (`child_id`),
  KEY `idx_assignments_tutor_id` (`tutor_id`),
  KEY `idx_assignments_started_at` (`started_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
