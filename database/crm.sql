-- Vidi Veda CRM tables only. Import this into the existing database if schema.sql was already applied.
SET NAMES utf8mb4;
-- -----------------------------------------------------------------------------
-- AdminPanel CRM (leads, teachers, demos, tuitions, money, follow-ups)
-- These are also created automatically by api/crm.inc.php on first CRM request.
-- No foreign keys (Hostinger-safe). One TIMESTAMP per table.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `crm_leads` (
  `id` VARCHAR(32) NOT NULL,
  `enquiry_date` VARCHAR(20) NOT NULL DEFAULT '',
  `parent_name` VARCHAR(150) NOT NULL DEFAULT '',
  `parent_contact` VARCHAR(40) NOT NULL DEFAULT '',
  `student_name` VARCHAR(150) NOT NULL DEFAULT '',
  `student_class` VARCHAR(50) NOT NULL DEFAULT '',
  `school` VARCHAR(150) NOT NULL DEFAULT '',
  `location` VARCHAR(150) NOT NULL DEFAULT '',
  `subject_required` VARCHAR(255) NOT NULL DEFAULT '',
  `preferred_timing` VARCHAR(150) NOT NULL DEFAULT '',
  `preferred_days` VARCHAR(150) NOT NULL DEFAULT '',
  `teacher_preference` VARCHAR(150) NOT NULL DEFAULT '',
  `expected_monthly_fee` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `lead_source` VARCHAR(50) NOT NULL DEFAULT 'Other',
  `status` VARCHAR(50) NOT NULL DEFAULT 'New Lead',
  `assigned_teacher_id` VARCHAR(32) NOT NULL DEFAULT '',
  `assigned_teacher_name` VARCHAR(150) NOT NULL DEFAULT '',
  `demo_id` VARCHAR(32) NOT NULL DEFAULT '',
  `tuition_id` VARCHAR(32) NOT NULL DEFAULT '',
  `remarks` TEXT,
  `created_on` VARCHAR(20) NOT NULL DEFAULT '',
  `updated_on` VARCHAR(20) NOT NULL DEFAULT '',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `crm_teachers` (
  `id` VARCHAR(32) NOT NULL,
  `name` VARCHAR(150) NOT NULL DEFAULT '',
  `contact` VARCHAR(40) NOT NULL DEFAULT '',
  `email` VARCHAR(150) NOT NULL DEFAULT '',
  `gender` VARCHAR(20) NOT NULL DEFAULT '',
  `qualification` VARCHAR(255) NOT NULL DEFAULT '',
  `graduation` VARCHAR(255) NOT NULL DEFAULT '',
  `post_graduation` VARCHAR(255) NOT NULL DEFAULT '',
  `board` VARCHAR(150) NOT NULL DEFAULT '',
  `teaching_experience_years` INT NOT NULL DEFAULT 0,
  `classes_json` TEXT,
  `subjects_json` TEXT,
  `areas_json` TEXT,
  `preferred_timings` VARCHAR(150) NOT NULL DEFAULT '',
  `experience` TEXT,
  `expected_negotiated_fee` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `availability` VARCHAR(150) NOT NULL DEFAULT '',
  `demo_readiness` VARCHAR(40) NOT NULL DEFAULT 'Ready',
  `status` VARCHAR(40) NOT NULL DEFAULT 'Available',
  `active_students_count` INT NOT NULL DEFAULT 0,
  `total_commissions_paid` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `rating` DECIMAL(3,1) NOT NULL DEFAULT 0,
  `remarks` TEXT,
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `crm_demos` (
  `id` VARCHAR(32) NOT NULL,
  `lead_id` VARCHAR(32) NOT NULL DEFAULT '',
  `parent_name` VARCHAR(150) NOT NULL DEFAULT '',
  `student_name` VARCHAR(150) NOT NULL DEFAULT '',
  `teacher_id` VARCHAR(32) NOT NULL DEFAULT '',
  `teacher_name` VARCHAR(150) NOT NULL DEFAULT '',
  `start_date` VARCHAR(20) NOT NULL DEFAULT '',
  `end_date` VARCHAR(20) NOT NULL DEFAULT '',
  `timing` VARCHAR(150) NOT NULL DEFAULT '',
  `day1_status` VARCHAR(30) NOT NULL DEFAULT 'Pending',
  `day2_status` VARCHAR(30) NOT NULL DEFAULT 'Pending',
  `day3_status` VARCHAR(30) NOT NULL DEFAULT 'Pending',
  `parent_feedback` VARCHAR(50) NOT NULL DEFAULT '',
  `teacher_feedback` VARCHAR(50) NOT NULL DEFAULT '',
  `final_result` VARCHAR(50) NOT NULL DEFAULT '',
  `follow_up_date` VARCHAR(20) NOT NULL DEFAULT '',
  `remarks` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_crm_demos_lead` (`lead_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `crm_tuitions` (
  `id` VARCHAR(32) NOT NULL,
  `lead_id` VARCHAR(32) NOT NULL DEFAULT '',
  `student_name` VARCHAR(150) NOT NULL DEFAULT '',
  `parent_name` VARCHAR(150) NOT NULL DEFAULT '',
  `parent_contact` VARCHAR(40) NOT NULL DEFAULT '',
  `student_class` VARCHAR(50) NOT NULL DEFAULT '',
  `school` VARCHAR(150) NOT NULL DEFAULT '',
  `subject` VARCHAR(255) NOT NULL DEFAULT '',
  `location` VARCHAR(150) NOT NULL DEFAULT '',
  `teacher_id` VARCHAR(32) NOT NULL DEFAULT '',
  `teacher_name` VARCHAR(150) NOT NULL DEFAULT '',
  `teacher_contact` VARCHAR(40) NOT NULL DEFAULT '',
  `tuition_start_date` VARCHAR(20) NOT NULL DEFAULT '',
  `monthly_tuition_fee` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `first_month_fee` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `teacher_commission` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `registration_status` VARCHAR(40) NOT NULL DEFAULT 'Pending',
  `teacher_commission_status` VARCHAR(40) NOT NULL DEFAULT 'Pending',
  `tuition_status` VARCHAR(40) NOT NULL DEFAULT 'Active',
  `next_follow_up` VARCHAR(20) NOT NULL DEFAULT '',
  `remarks` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `crm_payments` (
  `id` VARCHAR(32) NOT NULL,
  `lead_id` VARCHAR(32) NOT NULL DEFAULT '',
  `tuition_id` VARCHAR(32) NOT NULL DEFAULT '',
  `parent_name` VARCHAR(150) NOT NULL DEFAULT '',
  `student_name` VARCHAR(150) NOT NULL DEFAULT '',
  `amount_due` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `amount_paid` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `balance` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `due_date` VARCHAR(20) NOT NULL DEFAULT '',
  `payment_date` VARCHAR(20) NOT NULL DEFAULT '',
  `payment_method` VARCHAR(40) NOT NULL DEFAULT '',
  `transaction_ref` VARCHAR(80) NOT NULL DEFAULT '',
  `status` VARCHAR(40) NOT NULL DEFAULT 'Pending',
  `reminders_sent_count` INT NOT NULL DEFAULT 0,
  `last_reminder_date` VARCHAR(20) NOT NULL DEFAULT '',
  `remarks` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `crm_commissions` (
  `id` VARCHAR(32) NOT NULL,
  `teacher_id` VARCHAR(32) NOT NULL DEFAULT '',
  `teacher_name` VARCHAR(150) NOT NULL DEFAULT '',
  `student_name` VARCHAR(150) NOT NULL DEFAULT '',
  `tuition_id` VARCHAR(32) NOT NULL DEFAULT '',
  `lead_id` VARCHAR(32) NOT NULL DEFAULT '',
  `first_month_fee` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `commission_percentage` INT NOT NULL DEFAULT 50,
  `commission_amount` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `amount_paid` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `balance` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `due_date` VARCHAR(20) NOT NULL DEFAULT '',
  `payment_date` VARCHAR(20) NOT NULL DEFAULT '',
  `payment_method` VARCHAR(40) NOT NULL DEFAULT '',
  `transaction_id` VARCHAR(80) NOT NULL DEFAULT '',
  `status` VARCHAR(40) NOT NULL DEFAULT 'Pending',
  `reminders_sent_count` INT NOT NULL DEFAULT 0,
  `last_reminder_date` VARCHAR(20) NOT NULL DEFAULT '',
  `remarks` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `crm_followups` (
  `id` VARCHAR(32) NOT NULL,
  `date_created` VARCHAR(20) NOT NULL DEFAULT '',
  `due_date` VARCHAR(20) NOT NULL DEFAULT '',
  `lead_id` VARCHAR(32) NOT NULL DEFAULT '',
  `tuition_id` VARCHAR(32) NOT NULL DEFAULT '',
  `student_name` VARCHAR(150) NOT NULL DEFAULT '',
  `parent_name` VARCHAR(150) NOT NULL DEFAULT '',
  `contact_number` VARCHAR(40) NOT NULL DEFAULT '',
  `teacher_name` VARCHAR(150) NOT NULL DEFAULT '',
  `assigned_teacher_name` VARCHAR(150) NOT NULL DEFAULT '',
  `follow_up_type` VARCHAR(50) NOT NULL DEFAULT 'Other',
  `priority` VARCHAR(20) NOT NULL DEFAULT 'Medium',
  `status` VARCHAR(20) NOT NULL DEFAULT 'Pending',
  `last_contact_date` VARCHAR(20) NOT NULL DEFAULT '',
  `next_action` TEXT,
  `remarks` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `crm_audit_logs` (
  `id` VARCHAR(32) NOT NULL,
  `logged_at` VARCHAR(40) NOT NULL DEFAULT '',
  `entity_type` VARCHAR(40) NOT NULL DEFAULT '',
  `entity_id` VARCHAR(32) NOT NULL DEFAULT '',
  `user_name` VARCHAR(50) NOT NULL DEFAULT 'Admin',
  `action` VARCHAR(80) NOT NULL DEFAULT '',
  `old_value` VARCHAR(255) NOT NULL DEFAULT '',
  `new_value` VARCHAR(255) NOT NULL DEFAULT '',
  `note` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
