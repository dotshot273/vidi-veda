-- =============================================================================
-- Vidi Veda — MySQL schema
-- =============================================================================
-- Import this file into the database already selected in phpMyAdmin / MySQL.
--
-- Hostinger:
--   1. Create a MySQL database in hPanel (name may be prefixed, e.g. u123_vidiveda).
--   2. Put that name in public/api/config.php as DB_NAME (with DB_USER / DB_PASS).
--   3. Open phpMyAdmin → select that database → Import → choose this file.
--
-- Local XAMPP / WAMP (optional): uncomment the two lines below, then import.
--
-- CREATE DATABASE IF NOT EXISTS `vidiveda_db`
--   DEFAULT CHARACTER SET utf8mb4
--   COLLATE utf8mb4_unicode_ci;
-- USE `vidiveda_db`;
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- -----------------------------------------------------------------------------
-- Parent registrations (student enquiry header)
-- ID format: VV-STU-YYYY-NNNN
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `parents` (
  `id` VARCHAR(50) NOT NULL,
  `parent_name` VARCHAR(150) NOT NULL,
  `mobile_number` VARCHAR(15) NOT NULL,
  `whatsapp_number` VARCHAR(15) NOT NULL,
  `address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_parents_city` (`city`),
  KEY `idx_parents_mobile` (`mobile_number`),
  KEY `idx_parents_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Children linked to a parent registration
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `children` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `student_id` VARCHAR(50) NOT NULL,
  `student_name` VARCHAR(150) NOT NULL,
  `student_class` VARCHAR(50) NOT NULL,
  `board` VARCHAR(50) NOT NULL,
  `subjects` TEXT NOT NULL,
  `tuition_type` VARCHAR(150) NOT NULL,
  `preferred_timing` VARCHAR(150) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_children_student_id` (`student_id`),
  CONSTRAINT `fk_children_parent`
    FOREIGN KEY (`student_id`) REFERENCES `parents` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Tutor applications
-- ID format: VV-TUT-YYYY-NNNN
-- status: pending | approved | rejected
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tutors` (
  `id` VARCHAR(50) NOT NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `mobile_number` VARCHAR(15) NOT NULL,
  `qualification` VARCHAR(150) NOT NULL,
  `subjects` TEXT NOT NULL,
  `experience` VARCHAR(80) NOT NULL,
  `preferred_areas` VARCHAR(255) NOT NULL,
  `resume_path` VARCHAR(255) DEFAULT NULL,
  `id_proof_path` VARCHAR(255) DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tutors_status` (`status`),
  KEY `idx_tutors_mobile` (`mobile_number`),
  KEY `idx_tutors_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Website contact / inquiry form
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL DEFAULT '',
  `mobile` VARCHAR(15) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contacts_mobile` (`mobile`),
  KEY `idx_contacts_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Admin login accounts (username + hashed password)
-- Default login after import: admin / VidiVeda@2026
-- Change this immediately from the admin panel.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admin_users_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `admin_users` (`username`, `password_hash`)
VALUES ('admin', '$2y$10$XhQm7EWU/IkYQ3ZfZN1JS.YFw6zU6rBjovqzuggZrufR8ocNceN.W');

-- -----------------------------------------------------------------------------
-- Teacher ↔ student mapping for demos and paid coaching
-- type: demo | coaching
-- status: active | completed | cancelled
-- amount: fee in INR
-- started_at: date the teacher became active on this mapping
--
-- Foreign keys are omitted so this imports on Hostinger when parents/children/tutors
-- already exist with older INT / charset definitions.
-- -----------------------------------------------------------------------------
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
