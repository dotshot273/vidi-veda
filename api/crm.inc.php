<?php
/**
 * CRM persistence for the AdminPanel (leads, teachers, demos, money, follow-ups).
 * Tables are created automatically if missing (Hostinger-safe: no FKs, one TIMESTAMP).
 */

function crm_today() {
    return date('Y-m-d');
}

function crm_add_days($date, $days) {
    $ts = strtotime($date . ' ' . ((int)$days) . ' days');
    return $ts ? date('Y-m-d', $ts) : crm_today();
}

function crm_now_label() {
    return crm_today() . ' ' . date('H:i');
}

function crm_json_encode($value) {
    if (is_string($value)) {
        $parts = array_values(array_filter(array_map('trim', explode(',', $value)), 'strlen'));
        return json_encode($parts);
    }
    if (!is_array($value)) {
        return json_encode([]);
    }
    return json_encode(array_values($value));
}

function crm_json_decode($value) {
    $decoded = json_decode((string)$value, true);
    return is_array($decoded) ? $decoded : [];
}

function crm_ensure_schema($conn) {
    $tables = [
        "CREATE TABLE IF NOT EXISTS `crm_leads` (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS `crm_teachers` (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS `crm_demos` (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS `crm_tuitions` (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS `crm_payments` (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS `crm_commissions` (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS `crm_followups` (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE IF NOT EXISTS `crm_audit_logs` (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    ];

    foreach ($tables as $sql) {
        $conn->query($sql);
    }
}

function crm_next_id($conn, $table, $prefix, $pad = 5) {
    $max = 0;
    $result = $conn->query("SELECT id FROM `$table`");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            if (preg_match('/(\d+)$/', (string)$row['id'], $match)) {
                $max = max($max, (int)$match[1]);
            }
        }
    }
    return $prefix . str_pad((string)($max + 1), $pad, '0', STR_PAD_LEFT);
}

function crm_fetch_all($conn, $sql) {
    $rows = [];
    $result = $conn->query($sql);
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
    }
    return $rows;
}

function crm_blank_to_null($value) {
    $value = trim((string)$value);
    return $value === '' ? null : $value;
}

function crm_map_lead($row) {
    return [
        'id' => $row['id'],
        'enquiryDate' => $row['enquiry_date'],
        'parentName' => $row['parent_name'],
        'parentContact' => $row['parent_contact'],
        'studentName' => $row['student_name'],
        'studentClass' => $row['student_class'],
        'school' => $row['school'],
        'location' => $row['location'],
        'subjectRequired' => $row['subject_required'],
        'preferredTiming' => $row['preferred_timing'],
        'preferredDays' => $row['preferred_days'],
        'teacherPreference' => $row['teacher_preference'],
        'expectedMonthlyFee' => (float)$row['expected_monthly_fee'],
        'leadSource' => $row['lead_source'],
        'status' => $row['status'],
        'assignedTeacherId' => crm_blank_to_null($row['assigned_teacher_id']),
        'assignedTeacherName' => crm_blank_to_null($row['assigned_teacher_name']),
        'demoId' => crm_blank_to_null($row['demo_id']),
        'tuitionId' => crm_blank_to_null($row['tuition_id']),
        'remarks' => $row['remarks'],
        'createdAt' => $row['created_on'],
        'updatedAt' => $row['updated_on'],
    ];
}

function crm_map_teacher($row) {
    $classes = crm_json_decode($row['classes_json']);
    $subjects = crm_json_decode($row['subjects_json']);
    $areas = crm_json_decode($row['areas_json']);
    return [
        'id' => $row['id'],
        'name' => $row['name'],
        'contact' => $row['contact'],
        'contactNumber' => $row['contact'],
        'email' => $row['email'],
        'gender' => $row['gender'] ?: null,
        'qualification' => $row['qualification'],
        'graduation' => $row['graduation'],
        'postGraduation' => $row['post_graduation'],
        'board' => $row['board'],
        'teachingExperienceYears' => (int)$row['teaching_experience_years'],
        'classes' => $classes,
        'classesTaught' => $classes,
        'subjects' => $subjects,
        'areasCovered' => $areas,
        'preferredTimings' => $row['preferred_timings'],
        'preferredTiming' => $row['preferred_timings'],
        'experience' => $row['experience'],
        'expectedNegotiatedFee' => (float)$row['expected_negotiated_fee'],
        'expectedFee' => (float)$row['expected_negotiated_fee'],
        'availability' => $row['availability'],
        'demoReadiness' => $row['demo_readiness'] ?: 'Ready',
        'status' => $row['status'],
        'activeStudentsCount' => (int)$row['active_students_count'],
        'totalCommissionsPaid' => (float)$row['total_commissions_paid'],
        'rating' => (float)$row['rating'],
        'remarks' => $row['remarks'],
        'notes' => $row['notes'],
    ];
}

function crm_map_demo($row) {
    return [
        'id' => $row['id'],
        'leadId' => $row['lead_id'],
        'parentName' => $row['parent_name'],
        'studentName' => $row['student_name'],
        'teacherId' => $row['teacher_id'],
        'teacherName' => $row['teacher_name'],
        'startDate' => $row['start_date'],
        'endDate' => $row['end_date'],
        'timing' => $row['timing'],
        'day1Status' => $row['day1_status'],
        'day2Status' => $row['day2_status'],
        'day3Status' => $row['day3_status'],
        'parentFeedback' => crm_blank_to_null($row['parent_feedback']),
        'teacherFeedback' => crm_blank_to_null($row['teacher_feedback']),
        'finalResult' => crm_blank_to_null($row['final_result']),
        'followUpDate' => crm_blank_to_null($row['follow_up_date']),
        'remarks' => $row['remarks'],
    ];
}

function crm_map_tuition($row) {
    return [
        'id' => $row['id'],
        'leadId' => $row['lead_id'],
        'studentName' => $row['student_name'],
        'parentName' => $row['parent_name'],
        'parentContact' => $row['parent_contact'],
        'studentClass' => $row['student_class'],
        'school' => $row['school'],
        'subject' => $row['subject'],
        'location' => $row['location'],
        'teacherId' => $row['teacher_id'],
        'teacherName' => $row['teacher_name'],
        'teacherContact' => $row['teacher_contact'],
        'tuitionStartDate' => $row['tuition_start_date'],
        'monthlyTuitionFee' => (float)$row['monthly_tuition_fee'],
        'firstMonthFee' => (float)$row['first_month_fee'],
        'teacherCommission' => (float)$row['teacher_commission'],
        'registrationStatus' => $row['registration_status'],
        'teacherCommissionStatus' => $row['teacher_commission_status'],
        'tuitionStatus' => $row['tuition_status'],
        'nextFollowUp' => crm_blank_to_null($row['next_follow_up']),
        'remarks' => $row['remarks'],
    ];
}

function crm_map_payment($row) {
    return [
        'id' => $row['id'],
        'leadId' => $row['lead_id'],
        'tuitionId' => crm_blank_to_null($row['tuition_id']),
        'parentName' => $row['parent_name'],
        'studentName' => $row['student_name'],
        'amountDue' => (float)$row['amount_due'],
        'amountPaid' => (float)$row['amount_paid'],
        'balance' => (float)$row['balance'],
        'dueDate' => $row['due_date'],
        'paymentDate' => crm_blank_to_null($row['payment_date']),
        'paymentMethod' => crm_blank_to_null($row['payment_method']),
        'transactionRef' => crm_blank_to_null($row['transaction_ref']),
        'status' => $row['status'],
        'remindersSentCount' => (int)$row['reminders_sent_count'],
        'lastReminderDate' => crm_blank_to_null($row['last_reminder_date']),
        'remarks' => $row['remarks'],
    ];
}

function crm_map_commission($row) {
    return [
        'id' => $row['id'],
        'teacherId' => $row['teacher_id'],
        'teacherName' => $row['teacher_name'],
        'studentName' => $row['student_name'],
        'tuitionId' => $row['tuition_id'],
        'leadId' => $row['lead_id'],
        'firstMonthFee' => (float)$row['first_month_fee'],
        'commissionPercentage' => (int)$row['commission_percentage'],
        'commissionAmount' => (float)$row['commission_amount'],
        'amountPaid' => (float)$row['amount_paid'],
        'balance' => (float)$row['balance'],
        'dueDate' => $row['due_date'],
        'paymentDate' => crm_blank_to_null($row['payment_date']),
        'paymentMethod' => crm_blank_to_null($row['payment_method']),
        'transactionId' => crm_blank_to_null($row['transaction_id']),
        'status' => $row['status'],
        'remindersSentCount' => (int)$row['reminders_sent_count'],
        'lastReminderDate' => crm_blank_to_null($row['last_reminder_date']),
        'remarks' => $row['remarks'],
    ];
}

function crm_map_followup($row) {
    return [
        'id' => $row['id'],
        'dateCreated' => $row['date_created'],
        'dueDate' => $row['due_date'],
        'leadId' => crm_blank_to_null($row['lead_id']),
        'tuitionId' => crm_blank_to_null($row['tuition_id']),
        'studentName' => $row['student_name'],
        'parentName' => $row['parent_name'],
        'contactNumber' => $row['contact_number'],
        'teacherName' => crm_blank_to_null($row['teacher_name']),
        'assignedTeacherName' => crm_blank_to_null($row['assigned_teacher_name']),
        'followUpType' => $row['follow_up_type'],
        'priority' => $row['priority'] ?: 'Medium',
        'status' => $row['status'],
        'lastContactDate' => crm_blank_to_null($row['last_contact_date']),
        'nextAction' => $row['next_action'],
        'remarks' => $row['remarks'],
    ];
}

function crm_map_audit($row) {
    return [
        'id' => $row['id'],
        'timestamp' => $row['logged_at'],
        'entityType' => $row['entity_type'],
        'entityId' => $row['entity_id'],
        'user' => $row['user_name'],
        'action' => $row['action'],
        'oldValue' => crm_blank_to_null($row['old_value']),
        'newValue' => crm_blank_to_null($row['new_value']),
        'note' => $row['note'],
    ];
}

function crm_snapshot($conn) {
    crm_ensure_schema($conn);
    return [
        'leads' => array_map('crm_map_lead', crm_fetch_all($conn, "SELECT * FROM crm_leads ORDER BY created_at DESC")),
        'teachers' => array_map('crm_map_teacher', crm_fetch_all($conn, "SELECT * FROM crm_teachers ORDER BY created_at DESC")),
        'demos' => array_map('crm_map_demo', crm_fetch_all($conn, "SELECT * FROM crm_demos ORDER BY created_at DESC")),
        'tuitions' => array_map('crm_map_tuition', crm_fetch_all($conn, "SELECT * FROM crm_tuitions ORDER BY created_at DESC")),
        'payments' => array_map('crm_map_payment', crm_fetch_all($conn, "SELECT * FROM crm_payments ORDER BY created_at DESC")),
        'commissions' => array_map('crm_map_commission', crm_fetch_all($conn, "SELECT * FROM crm_commissions ORDER BY created_at DESC")),
        'followUps' => array_map('crm_map_followup', crm_fetch_all($conn, "SELECT * FROM crm_followups ORDER BY created_at DESC")),
        'auditLogs' => array_map('crm_map_audit', crm_fetch_all($conn, "SELECT * FROM crm_audit_logs ORDER BY created_at DESC")),
    ];
}

function crm_audit($conn, $entityType, $entityId, $action, $newValue = '', $note = '') {
    $id = crm_next_id($conn, 'crm_audit_logs', 'AUD-', 3);
    $logged = crm_now_label();
    $admin = $GLOBALS['auth_admin']['username'] ?? 'Admin';
    $stmt = $conn->prepare("INSERT INTO crm_audit_logs (id, logged_at, entity_type, entity_id, user_name, action, old_value, new_value, note) VALUES (?, ?, ?, ?, ?, ?, '', ?, ?)");
    $stmt->bind_param("ssssssss", $id, $logged, $entityType, $entityId, $admin, $action, $newValue, $note);
    $stmt->execute();
    $stmt->close();
}

function crm_ok($conn, $extra = []) {
    echo json_encode(array_merge(["success" => true, "data" => crm_snapshot($conn)], $extra));
}

function crm_row($conn, $table, $id) {
    $safeTable = preg_replace('/[^a-z_]/', '', $table);
    $safeId = $conn->real_escape_string($id);
    $result = $conn->query("SELECT * FROM `$safeTable` WHERE id = '$safeId' LIMIT 1");
    return $result ? $result->fetch_assoc() : null;
}

function handleGetCrm() {
    $conn = get_db_connection();
    crm_ok($conn);
    $conn->close();
}

function handleCrmAddLead() {
    $data = read_json_body();
    $today = crm_today();
    $conn = get_db_connection();
    crm_ensure_schema($conn);

    $id = crm_next_id($conn, 'crm_leads', 'T-');
    $enquiry = trim($data['enquiryDate'] ?? $today);
    $parentName = trim($data['parentName'] ?? '');
    $parentContact = trim($data['parentContact'] ?? '');
    $studentName = trim($data['studentName'] ?? '');
    $studentClass = trim($data['studentClass'] ?? '');
    $school = trim($data['school'] ?? '');
    $location = trim($data['location'] ?? '');
    $subject = trim($data['subjectRequired'] ?? '');
    $timing = trim($data['preferredTiming'] ?? '');
    $days = trim($data['preferredDays'] ?? '');
    $pref = trim($data['teacherPreference'] ?? '');
    $fee = (float)($data['expectedMonthlyFee'] ?? 0);
    $source = trim($data['leadSource'] ?? 'Other');
    $status = trim($data['status'] ?? 'New Lead');
    $remarks = trim($data['remarks'] ?? '');

    if ($parentName === '' || $parentContact === '' || $studentName === '') {
        $conn->close();
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Parent, contact and student name are required"]);
        return;
    }

    $stmt = $conn->prepare("INSERT INTO crm_leads (id, enquiry_date, parent_name, parent_contact, student_name, student_class, school, location, subject_required, preferred_timing, preferred_days, teacher_preference, expected_monthly_fee, lead_source, status, remarks, created_on, updated_on) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    $stmt->bind_param("ssssssssssssdsssss", $id, $enquiry, $parentName, $parentContact, $studentName, $studentClass, $school, $location, $subject, $timing, $days, $pref, $fee, $source, $status, $remarks, $today, $today);
    $stmt->execute();
    $stmt->close();

    $fuId = crm_next_id($conn, 'crm_followups', 'FU-');
    $nextAction = "Call $parentName about $studentName";
    $fuType = 'New Lead';
    $priority = 'High';
    $fuStatus = 'Pending';
    $fuStmt = $conn->prepare("INSERT INTO crm_followups (id, date_created, due_date, lead_id, student_name, parent_name, contact_number, follow_up_type, priority, status, next_action) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
    $fuStmt->bind_param("sssssssssss", $fuId, $today, $today, $id, $studentName, $parentName, $parentContact, $fuType, $priority, $fuStatus, $nextAction);
    $fuStmt->execute();
    $fuStmt->close();

    crm_audit($conn, 'Lead', $id, 'Created Lead', '', $parentName);
    $lead = crm_map_lead(crm_row($conn, 'crm_leads', $id));
    crm_ok($conn, ['lead' => $lead]);
    $conn->close();
}

function handleCrmUpdateLeadStatus() {
    $data = read_json_body();
    $id = trim($data['id'] ?? '');
    $status = trim($data['status'] ?? '');
    if ($id === '' || $status === '') {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Lead id and status are required"]);
        return;
    }
    $today = crm_today();
    $conn = get_db_connection();
    crm_ensure_schema($conn);
    $stmt = $conn->prepare("UPDATE crm_leads SET status = ?, updated_on = ? WHERE id = ?");
    $stmt->bind_param("sss", $status, $today, $id);
    $stmt->execute();
    $stmt->close();
    crm_audit($conn, 'Lead', $id, 'Status Updated', $status, '');
    crm_ok($conn);
    $conn->close();
}

function handleCrmAddTeacher() {
    $data = read_json_body();
    $name = trim($data['name'] ?? '');
    $contact = trim($data['contact'] ?? ($data['contactNumber'] ?? ''));
    if ($name === '' || $contact === '') {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Teacher name and contact are required"]);
        return;
    }
    $conn = get_db_connection();
    crm_ensure_schema($conn);
    $id = crm_next_id($conn, 'crm_teachers', 'TEA-');
    $email = trim($data['email'] ?? '');
    $gender = trim($data['gender'] ?? '');
    $qualification = trim($data['qualification'] ?? '');
    $graduation = trim($data['graduation'] ?? '');
    $postGraduation = trim($data['postGraduation'] ?? '');
    $board = trim($data['board'] ?? '');
    $years = (int)($data['teachingExperienceYears'] ?? 0);
    $classes = crm_json_encode($data['classes'] ?? ($data['classesTaught'] ?? []));
    $subjects = crm_json_encode($data['subjects'] ?? []);
    $areas = crm_json_encode($data['areasCovered'] ?? []);
    $timings = trim($data['preferredTimings'] ?? ($data['preferredTiming'] ?? ''));
    $experience = trim($data['experience'] ?? '');
    $fee = (float)($data['expectedNegotiatedFee'] ?? ($data['expectedFee'] ?? 0));
    $availability = trim($data['availability'] ?? '');
    $demoReady = trim($data['demoReadiness'] ?? 'Ready');
    $status = trim($data['status'] ?? 'Available');
    $rating = (float)($data['rating'] ?? 0);
    $remarks = trim($data['remarks'] ?? '');
    $notes = trim($data['notes'] ?? '');
    $active = 0;
    $paid = 0.0;

    $stmt = $conn->prepare("INSERT INTO crm_teachers (id, name, contact, email, gender, qualification, graduation, post_graduation, board, teaching_experience_years, classes_json, subjects_json, areas_json, preferred_timings, experience, expected_negotiated_fee, availability, demo_readiness, status, active_students_count, total_commissions_paid, rating, remarks, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    $stmt->bind_param("sssssssssisssssdsssiddss", $id, $name, $contact, $email, $gender, $qualification, $graduation, $postGraduation, $board, $years, $classes, $subjects, $areas, $timings, $experience, $fee, $availability, $demoReady, $status, $active, $paid, $rating, $remarks, $notes);
    $stmt->execute();
    $stmt->close();
    crm_audit($conn, 'Teacher', $id, 'Added Teacher', '', $name);
    $teacher = crm_map_teacher(crm_row($conn, 'crm_teachers', $id));
    crm_ok($conn, ['teacher' => $teacher]);
    $conn->close();
}

function handleCrmUpdateTeacher() {
    $data = read_json_body();
    $id = trim($data['id'] ?? '');
    $patch = $data['patch'] ?? $data;
    if ($id === '') {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Teacher id is required"]);
        return;
    }
    $conn = get_db_connection();
    crm_ensure_schema($conn);
    $row = crm_row($conn, 'crm_teachers', $id);
    if (!$row) {
        $conn->close();
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Teacher not found"]);
        return;
    }
    $name = trim($patch['name'] ?? $row['name']);
    $contact = trim($patch['contact'] ?? ($patch['contactNumber'] ?? $row['contact']));
    $email = trim($patch['email'] ?? $row['email']);
    $gender = trim($patch['gender'] ?? $row['gender']);
    $qualification = trim($patch['qualification'] ?? $row['qualification']);
    $graduation = trim($patch['graduation'] ?? $row['graduation']);
    $postGraduation = trim($patch['postGraduation'] ?? $row['post_graduation']);
    $board = trim($patch['board'] ?? $row['board']);
    $years = (int)($patch['teachingExperienceYears'] ?? $row['teaching_experience_years']);
    $classes = array_key_exists('classes', $patch) || array_key_exists('classesTaught', $patch)
        ? crm_json_encode($patch['classes'] ?? $patch['classesTaught'])
        : $row['classes_json'];
    $subjects = array_key_exists('subjects', $patch) ? crm_json_encode($patch['subjects']) : $row['subjects_json'];
    $areas = array_key_exists('areasCovered', $patch) ? crm_json_encode($patch['areasCovered']) : $row['areas_json'];
    $timings = trim($patch['preferredTimings'] ?? ($patch['preferredTiming'] ?? $row['preferred_timings']));
    $experience = array_key_exists('experience', $patch) ? trim((string)$patch['experience']) : $row['experience'];
    $fee = (float)($patch['expectedNegotiatedFee'] ?? ($patch['expectedFee'] ?? $row['expected_negotiated_fee']));
    $availability = trim($patch['availability'] ?? $row['availability']);
    $demoReady = trim($patch['demoReadiness'] ?? $row['demo_readiness']);
    $status = trim($patch['status'] ?? $row['status']);
    $active = (int)($patch['activeStudentsCount'] ?? $row['active_students_count']);
    $paid = (float)($patch['totalCommissionsPaid'] ?? $row['total_commissions_paid']);
    $rating = (float)($patch['rating'] ?? $row['rating']);
    $remarks = array_key_exists('remarks', $patch) ? trim((string)$patch['remarks']) : $row['remarks'];
    $notes = array_key_exists('notes', $patch) ? trim((string)$patch['notes']) : $row['notes'];

    $stmt = $conn->prepare("UPDATE crm_teachers SET name=?, contact=?, email=?, gender=?, qualification=?, graduation=?, post_graduation=?, board=?, teaching_experience_years=?, classes_json=?, subjects_json=?, areas_json=?, preferred_timings=?, experience=?, expected_negotiated_fee=?, availability=?, demo_readiness=?, status=?, active_students_count=?, total_commissions_paid=?, rating=?, remarks=?, notes=? WHERE id=?");
    $stmt->bind_param("ssssssssisssssdsssiddsss", $name, $contact, $email, $gender, $qualification, $graduation, $postGraduation, $board, $years, $classes, $subjects, $areas, $timings, $experience, $fee, $availability, $demoReady, $status, $active, $paid, $rating, $remarks, $notes, $id);
    $stmt->execute();
    $stmt->close();
    crm_ok($conn);
    $conn->close();
}

function handleCrmAssignTeacher() {
    $data = read_json_body();
    $leadId = trim($data['leadId'] ?? '');
    $teacherId = trim($data['teacherId'] ?? '');
    $conn = get_db_connection();
    crm_ensure_schema($conn);
    $lead = crm_row($conn, 'crm_leads', $leadId);
    $teacher = crm_row($conn, 'crm_teachers', $teacherId);
    if (!$lead || !$teacher) {
        $conn->close();
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Lead or teacher not found"]);
        return;
    }
    $today = crm_today();
    $status = $lead['status'];
    if (in_array($status, ['New Lead', 'Contacted', 'Teacher Searching'], true)) {
        $status = 'Teacher Shortlisted';
    }
    $tName = $teacher['name'];
    $stmt = $conn->prepare("UPDATE crm_leads SET assigned_teacher_id=?, assigned_teacher_name=?, status=?, updated_on=? WHERE id=?");
    $stmt->bind_param("sssss", $teacherId, $tName, $status, $today, $leadId);
    $stmt->execute();
    $stmt->close();
    crm_audit($conn, 'Lead', $leadId, 'Assigned Teacher', $tName, '');
    crm_ok($conn);
    $conn->close();
}

function handleCrmScheduleDemo() {
    $data = read_json_body();
    $leadId = trim($data['leadId'] ?? '');
    $teacherId = trim($data['teacherId'] ?? '');
    $startDate = trim($data['startDate'] ?? crm_today());
    $timing = trim($data['timing'] ?? '');
    $remarks = trim($data['remarks'] ?? '');
    $conn = get_db_connection();
    crm_ensure_schema($conn);
    $lead = crm_row($conn, 'crm_leads', $leadId);
    $teacher = crm_row($conn, 'crm_teachers', $teacherId);
    if (!$lead || !$teacher) {
        $conn->close();
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Select both a student and a teacher"]);
        return;
    }
    $id = crm_next_id($conn, 'crm_demos', 'DEM-');
    $endDate = crm_add_days($startDate, 2);
    $today = crm_today();
    $pending = 'Pending';
    $pName = $lead['parent_name'];
    $sName = $lead['student_name'];
    $tName = $teacher['name'];
    $stmt = $conn->prepare("INSERT INTO crm_demos (id, lead_id, parent_name, student_name, teacher_id, teacher_name, start_date, end_date, timing, day1_status, day2_status, day3_status, remarks) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");
    $stmt->bind_param("sssssssssssss", $id, $leadId, $pName, $sName, $teacherId, $tName, $startDate, $endDate, $timing, $pending, $pending, $pending, $remarks);
    $stmt->execute();
    $stmt->close();

    $leadStatus = 'Demo Scheduled';
    $uLead = $conn->prepare("UPDATE crm_leads SET demo_id=?, assigned_teacher_id=?, assigned_teacher_name=?, status=?, updated_on=? WHERE id=?");
    $uLead->bind_param("ssssss", $id, $teacherId, $tName, $leadStatus, $today, $leadId);
    $uLead->execute();
    $uLead->close();

    $tStatus = 'Demo';
    $uTeach = $conn->prepare("UPDATE crm_teachers SET status=? WHERE id=?");
    $uTeach->bind_param("ss", $tStatus, $teacherId);
    $uTeach->execute();
    $uTeach->close();

    crm_audit($conn, 'Demo', $id, 'Scheduled Demo', '', '');
    $demo = crm_map_demo(crm_row($conn, 'crm_demos', $id));
    crm_ok($conn, ['demo' => $demo]);
    $conn->close();
}

function handleCrmUpdateDemoDay() {
    $data = read_json_body();
    $demoId = trim($data['demoId'] ?? '');
    $day = (int)($data['day'] ?? 0);
    $status = trim($data['status'] ?? '');
    if (!in_array($day, [1, 2, 3], true) || $status === '') {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid demo day or status"]);
        return;
    }
    $col = $day === 1 ? 'day1_status' : ($day === 2 ? 'day2_status' : 'day3_status');
    $conn = get_db_connection();
    crm_ensure_schema($conn);
    $demo = crm_row($conn, 'crm_demos', $demoId);
    if (!$demo) {
        $conn->close();
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Demo not found"]);
        return;
    }
    $stmt = $conn->prepare("UPDATE crm_demos SET `$col` = ? WHERE id = ?");
    $stmt->bind_param("ss", $status, $demoId);
    $stmt->execute();
    $stmt->close();
    $today = crm_today();
    if ($status === 'Completed' && $day === 1) {
        $ls = 'Demo Running';
        $u = $conn->prepare("UPDATE crm_leads SET status=?, updated_on=? WHERE id=?");
        $leadId = $demo['lead_id'];
        $u->bind_param("sss", $ls, $today, $leadId);
        $u->execute();
        $u->close();
    }
    if ($status === 'Completed' && $day === 3) {
        $ls = 'Demo Completed';
        $u = $conn->prepare("UPDATE crm_leads SET status=?, updated_on=? WHERE id=?");
        $leadId = $demo['lead_id'];
        $u->bind_param("sss", $ls, $today, $leadId);
        $u->execute();
        $u->close();
    }
    crm_ok($conn);
    $conn->close();
}

function handleCrmDemoFeedback() {
    $data = read_json_body();
    $demoId = trim($data['demoId'] ?? '');
    $parentFeedback = trim($data['parentFeedback'] ?? '');
    $teacherFeedback = trim($data['teacherFeedback'] ?? '');
    $finalResult = trim($data['finalResult'] ?? '');
    $remarks = trim($data['remarks'] ?? '');
    $conn = get_db_connection();
    crm_ensure_schema($conn);
    $demo = crm_row($conn, 'crm_demos', $demoId);
    if (!$demo) {
        $conn->close();
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Demo not found"]);
        return;
    }
    $done = 'Completed';
    $stmt = $conn->prepare("UPDATE crm_demos SET parent_feedback=?, teacher_feedback=?, final_result=?, remarks=?, day1_status=?, day2_status=?, day3_status=? WHERE id=?");
    $stmt->bind_param("ssssssss", $parentFeedback, $teacherFeedback, $finalResult, $remarks, $done, $done, $done, $demoId);
    $stmt->execute();
    $stmt->close();

    $lead = crm_row($conn, 'crm_leads', $demo['lead_id']);
    $teacher = crm_row($conn, 'crm_teachers', $demo['teacher_id']);
    $today = crm_today();

    if ($finalResult === 'Confirmed' && $lead) {
        $tuitionId = crm_next_id($conn, 'crm_tuitions', 'TU-');
        $fee = (float)$lead['expected_monthly_fee'] ?: 4000;
        $commission = round($fee * 0.5, 2);
        $tContact = $teacher['contact'] ?? '';
        $reg = 'Pending';
        $tStat = 'Pending';
        $tuStat = 'Active';
        $note = 'Created from confirmed demo';
        $leadId = $lead['id'];
        $stuName = $lead['student_name'];
        $parName = $lead['parent_name'];
        $parContact = $lead['parent_contact'];
        $stuClass = $lead['student_class'];
        $school = $lead['school'];
        $subject = $lead['subject_required'];
        $location = $lead['location'];
        $teacherId = $demo['teacher_id'];
        $teacherName = $demo['teacher_name'];
        $insT = $conn->prepare("INSERT INTO crm_tuitions (id, lead_id, student_name, parent_name, parent_contact, student_class, school, subject, location, teacher_id, teacher_name, teacher_contact, tuition_start_date, monthly_tuition_fee, first_month_fee, teacher_commission, registration_status, teacher_commission_status, tuition_status, remarks) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        $insT->bind_param(
            "sssssssssssssdddssss",
            $tuitionId,
            $leadId,
            $stuName,
            $parName,
            $parContact,
            $stuClass,
            $school,
            $subject,
            $location,
            $teacherId,
            $teacherName,
            $tContact,
            $today,
            $fee,
            $fee,
            $commission,
            $reg,
            $tStat,
            $tuStat,
            $note
        );
        $insT->execute();
        $insT->close();

        $payId = crm_next_id($conn, 'crm_payments', 'PAY-');
        $due = 500.0;
        $paid = 0.0;
        $pStatus = 'Pending';
        $pNote = 'Registration fee';
        $insP = $conn->prepare("INSERT INTO crm_payments (id, lead_id, tuition_id, parent_name, student_name, amount_due, amount_paid, balance, due_date, status, reminders_sent_count, remarks) VALUES (?,?,?,?,?,?,?,?,?,?,0,?)");
        $insP->bind_param("sssssdddsss", $payId, $leadId, $tuitionId, $parName, $stuName, $due, $paid, $due, $today, $pStatus, $pNote);
        $insP->execute();
        $insP->close();

        $comId = crm_next_id($conn, 'crm_commissions', 'COM-');
        $pct = 50;
        $cDue = crm_add_days($today, 7);
        $cStatus = 'Pending';
        $insC = $conn->prepare("INSERT INTO crm_commissions (id, teacher_id, teacher_name, student_name, tuition_id, lead_id, first_month_fee, commission_percentage, commission_amount, amount_paid, balance, due_date, status, reminders_sent_count) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,0)");
        $insC->bind_param("sssssdsidddss", $comId, $teacherId, $teacherName, $stuName, $tuitionId, $leadId, $fee, $pct, $commission, $paid, $commission, $cDue, $cStatus);
        $insC->execute();
        $insC->close();

        $ls = 'Registration Pending';
        $uL = $conn->prepare("UPDATE crm_leads SET status=?, tuition_id=?, updated_on=? WHERE id=?");
        $uL->bind_param("ssss", $ls, $tuitionId, $today, $leadId);
        $uL->execute();
        $uL->close();

        if ($teacher) {
            $newCount = ((int)$teacher['active_students_count']) + 1;
            $ts = 'Active Tuition';
            $uT = $conn->prepare("UPDATE crm_teachers SET status=?, active_students_count=? WHERE id=?");
            $uT->bind_param("sis", $ts, $newCount, $teacherId);
            $uT->execute();
            $uT->close();
        }
    } elseif ($finalResult === 'Not Interested' && $lead) {
        $ls = 'Not Interested';
        $uL = $conn->prepare("UPDATE crm_leads SET status=?, updated_on=? WHERE id=?");
        $uL->bind_param("sss", $ls, $today, $lead['id']);
        $uL->execute();
        $uL->close();
    } elseif ($lead) {
        $ls = 'Parent Decision Pending';
        $uL = $conn->prepare("UPDATE crm_leads SET status=?, updated_on=? WHERE id=?");
        $uL->bind_param("sss", $ls, $today, $lead['id']);
        $uL->execute();
        $uL->close();
    }

    crm_audit($conn, 'Demo', $demoId, 'Demo Feedback', $finalResult, '');
    crm_ok($conn);
    $conn->close();
}

function handleCrmRecordPayment() {
    $data = read_json_body();
    $id = trim($data['id'] ?? '');
    $amountPaid = (float)($data['amountPaid'] ?? 0);
    $method = trim($data['paymentMethod'] ?? '');
    $ref = trim($data['transactionRef'] ?? '');
    $payDate = trim($data['paymentDate'] ?? crm_today());
    $remarks = trim($data['remarks'] ?? '');
    $conn = get_db_connection();
    crm_ensure_schema($conn);
    $row = crm_row($conn, 'crm_payments', $id);
    if (!$row) {
        $conn->close();
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Payment not found"]);
        return;
    }
    $paid = (float)$row['amount_paid'] + $amountPaid;
    $due = (float)$row['amount_due'];
    $balance = max(0, $due - $paid);
    $status = $balance <= 0 ? 'Paid' : 'Partially Paid';
    $note = $remarks !== '' ? $remarks : $row['remarks'];
    $stmt = $conn->prepare("UPDATE crm_payments SET amount_paid=?, balance=?, payment_method=?, transaction_ref=?, payment_date=?, remarks=?, status=? WHERE id=?");
    $stmt->bind_param("ddssssss", $paid, $balance, $method, $ref, $payDate, $note, $status, $id);
    $stmt->execute();
    $stmt->close();
    $today = crm_today();
    if ($paid >= $due && $row['lead_id']) {
        $lead = crm_row($conn, 'crm_leads', $row['lead_id']);
        if ($lead && in_array($lead['status'], ['Registration Pending', 'Confirmed'], true)) {
            $ls = 'Tuition Started';
            $u = $conn->prepare("UPDATE crm_leads SET status=?, updated_on=? WHERE id=?");
            $lid = $row['lead_id'];
            $u->bind_param("sss", $ls, $today, $lid);
            $u->execute();
            $u->close();
        }
        if ($row['tuition_id']) {
            $rs = 'Paid';
            $u2 = $conn->prepare("UPDATE crm_tuitions SET registration_status=? WHERE id=?");
            $tid = $row['tuition_id'];
            $u2->bind_param("ss", $rs, $tid);
            $u2->execute();
            $u2->close();
        }
    }
    crm_audit($conn, 'Payment', $id, 'Recorded Payment', '', '');
    crm_ok($conn);
    $conn->close();
}

function handleCrmRecordCommission() {
    $data = read_json_body();
    $id = trim($data['id'] ?? '');
    $amountPaid = (float)($data['amountPaid'] ?? 0);
    $method = trim($data['paymentMethod'] ?? '');
    $txn = trim($data['transactionId'] ?? '');
    $payDate = trim($data['paymentDate'] ?? crm_today());
    $remarks = trim($data['remarks'] ?? '');
    $conn = get_db_connection();
    crm_ensure_schema($conn);
    $row = crm_row($conn, 'crm_commissions', $id);
    if (!$row) {
        $conn->close();
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Commission not found"]);
        return;
    }
    $paid = (float)$row['amount_paid'] + $amountPaid;
    $due = (float)$row['commission_amount'];
    $balance = max(0, $due - $paid);
    $status = $balance <= 0 ? 'Paid' : 'Partially Paid';
    $note = $remarks !== '' ? $remarks : $row['remarks'];
    $stmt = $conn->prepare("UPDATE crm_commissions SET amount_paid=?, balance=?, payment_method=?, transaction_id=?, payment_date=?, remarks=?, status=? WHERE id=?");
    $stmt->bind_param("ddssssss", $paid, $balance, $method, $txn, $payDate, $note, $status, $id);
    $stmt->execute();
    $stmt->close();
    if ($balance <= 0 && $row['teacher_id']) {
        $teacher = crm_row($conn, 'crm_teachers', $row['teacher_id']);
        if ($teacher) {
            $total = (float)$teacher['total_commissions_paid'] + $amountPaid;
            $u = $conn->prepare("UPDATE crm_teachers SET total_commissions_paid=? WHERE id=?");
            $tid = $row['teacher_id'];
            $u->bind_param("ds", $total, $tid);
            $u->execute();
            $u->close();
        }
        if ($row['tuition_id']) {
            $cs = 'Paid';
            $u2 = $conn->prepare("UPDATE crm_tuitions SET teacher_commission_status=? WHERE id=?");
            $tuid = $row['tuition_id'];
            $u2->bind_param("ss", $cs, $tuid);
            $u2->execute();
            $u2->close();
        }
    }
    crm_audit($conn, 'Commission', $id, 'Recorded Commission', '', '');
    crm_ok($conn);
    $conn->close();
}

function handleCrmSendReminder() {
    $data = read_json_body();
    $kind = trim($data['kind'] ?? '');
    $id = trim($data['id'] ?? '');
    $today = crm_today();
    $conn = get_db_connection();
    crm_ensure_schema($conn);
    if ($kind === 'registration') {
        $stmt = $conn->prepare("UPDATE crm_payments SET reminders_sent_count = reminders_sent_count + 1, last_reminder_date=? WHERE id=?");
    } else {
        $stmt = $conn->prepare("UPDATE crm_commissions SET reminders_sent_count = reminders_sent_count + 1, last_reminder_date=? WHERE id=?");
    }
    $stmt->bind_param("ss", $today, $id);
    $stmt->execute();
    $stmt->close();
    crm_ok($conn);
    $conn->close();
}

function handleCrmAddFollowUp() {
    $data = read_json_body();
    $conn = get_db_connection();
    crm_ensure_schema($conn);
    $id = crm_next_id($conn, 'crm_followups', 'FU-');
    $today = crm_today();
    $due = trim($data['dueDate'] ?? $today);
    $leadId = trim($data['leadId'] ?? '');
    $tuitionId = trim($data['tuitionId'] ?? '');
    $studentName = trim($data['studentName'] ?? '');
    $parentName = trim($data['parentName'] ?? '');
    $contact = trim($data['contactNumber'] ?? '');
    $teacherName = trim($data['teacherName'] ?? '');
    $assigned = trim($data['assignedTeacherName'] ?? '');
    $type = trim($data['followUpType'] ?? 'Other');
    $priority = trim($data['priority'] ?? 'Medium');
    $status = trim($data['status'] ?? 'Pending');
    $next = trim($data['nextAction'] ?? '');
    $remarks = trim($data['remarks'] ?? '');
    $stmt = $conn->prepare("INSERT INTO crm_followups (id, date_created, due_date, lead_id, tuition_id, student_name, parent_name, contact_number, teacher_name, assigned_teacher_name, follow_up_type, priority, status, next_action, remarks) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    $stmt->bind_param("sssssssssssssss", $id, $today, $due, $leadId, $tuitionId, $studentName, $parentName, $contact, $teacherName, $assigned, $type, $priority, $status, $next, $remarks);
    $stmt->execute();
    $stmt->close();
    $item = crm_map_followup(crm_row($conn, 'crm_followups', $id));
    crm_ok($conn, ['followUp' => $item]);
    $conn->close();
}

function handleCrmUpdateFollowUp() {
    $data = read_json_body();
    $id = trim($data['id'] ?? '');
    $patch = $data['patch'] ?? $data;
    $conn = get_db_connection();
    crm_ensure_schema($conn);
    $row = crm_row($conn, 'crm_followups', $id);
    if (!$row) {
        $conn->close();
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Follow-up not found"]);
        return;
    }
    $due = trim($patch['dueDate'] ?? $row['due_date']);
    $status = trim($patch['status'] ?? $row['status']);
    $priority = trim($patch['priority'] ?? $row['priority']);
    $next = array_key_exists('nextAction', $patch) ? trim((string)$patch['nextAction']) : $row['next_action'];
    $remarks = array_key_exists('remarks', $patch) ? trim((string)$patch['remarks']) : $row['remarks'];
    $last = array_key_exists('lastContactDate', $patch) ? trim((string)$patch['lastContactDate']) : $row['last_contact_date'];
    $stmt = $conn->prepare("UPDATE crm_followups SET due_date=?, status=?, priority=?, next_action=?, remarks=?, last_contact_date=? WHERE id=?");
    $stmt->bind_param("sssssss", $due, $status, $priority, $next, $remarks, $last, $id);
    $stmt->execute();
    $stmt->close();
    crm_ok($conn);
    $conn->close();
}

function handleCrmImportLeads() {
    $data = read_json_body();
    $items = $data['leads'] ?? [];
    if (!is_array($items)) {
        $items = [];
    }
    $conn = get_db_connection();
    crm_ensure_schema($conn);
    $existing = [];
    foreach (crm_fetch_all($conn, "SELECT parent_contact FROM crm_leads") as $row) {
        $existing[preg_replace('/\D/', '', $row['parent_contact'])] = true;
    }
    $imported = 0;
    $skipped = 0;
    $today = crm_today();
    foreach ($items as $item) {
        $contact = trim($item['parentContact'] ?? '');
        $key = preg_replace('/\D/', '', $contact);
        $parentName = trim($item['parentName'] ?? '');
        if ($parentName === '' || ($key !== '' && isset($existing[$key]))) {
            $skipped++;
            continue;
        }
        if ($key !== '') {
            $existing[$key] = true;
        }
        $id = crm_next_id($conn, 'crm_leads', 'T-');
        $studentName = trim($item['studentName'] ?? $parentName);
        $studentClass = trim($item['studentClass'] ?? 'Class 10');
        $school = trim($item['school'] ?? '');
        $location = trim($item['location'] ?? '');
        $subject = trim($item['subjectRequired'] ?? '');
        $timing = trim($item['preferredTiming'] ?? '5:00 PM - 7:00 PM');
        $days = trim($item['preferredDays'] ?? 'Mon-Fri');
        $pref = '';
        $fee = (float)($item['expectedMonthlyFee'] ?? 4000);
        $source = trim($item['leadSource'] ?? 'Other');
        $status = 'New Lead';
        $remarks = '';
        $stmt = $conn->prepare("INSERT INTO crm_leads (id, enquiry_date, parent_name, parent_contact, student_name, student_class, school, location, subject_required, preferred_timing, preferred_days, teacher_preference, expected_monthly_fee, lead_source, status, remarks, created_on, updated_on) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        $stmt->bind_param("ssssssssssssdsssss", $id, $today, $parentName, $contact, $studentName, $studentClass, $school, $location, $subject, $timing, $days, $pref, $fee, $source, $status, $remarks, $today, $today);
        $stmt->execute();
        $stmt->close();
        $imported++;
    }
    crm_ok($conn, ['imported' => $imported, 'skipped' => $skipped]);
    $conn->close();
}

function handleCrmImportTeachers() {
    $data = read_json_body();
    $items = $data['teachers'] ?? [];
    if (!is_array($items)) {
        $items = [];
    }
    $conn = get_db_connection();
    crm_ensure_schema($conn);
    $existing = [];
    foreach (crm_fetch_all($conn, "SELECT contact FROM crm_teachers") as $row) {
        $existing[preg_replace('/\D/', '', $row['contact'])] = true;
    }
    $imported = 0;
    $skipped = 0;
    foreach ($items as $item) {
        $name = trim($item['name'] ?? '');
        $contact = trim($item['contact'] ?? '');
        $key = preg_replace('/\D/', '', $contact);
        if ($name === '' || ($key !== '' && isset($existing[$key]))) {
            $skipped++;
            continue;
        }
        if ($key !== '') {
            $existing[$key] = true;
        }
        $id = crm_next_id($conn, 'crm_teachers', 'TEA-');
        $email = '';
        $gender = '';
        $qualification = trim($item['qualification'] ?? '');
        $graduation = '';
        $postGraduation = '';
        $board = '';
        $years = 0;
        $classes = crm_json_encode([]);
        $subjects = crm_json_encode($item['subjects'] ?? ['Mathematics']);
        $areas = crm_json_encode($item['areasCovered'] ?? []);
        $timings = '';
        $experience = '';
        $fee = 0.0;
        $availability = '';
        $demoReady = 'Ready';
        $status = 'Available';
        $active = 0;
        $paid = 0.0;
        $rating = 0.0;
        $remarks = '';
        $notes = '';
        $stmt = $conn->prepare("INSERT INTO crm_teachers (id, name, contact, email, gender, qualification, graduation, post_graduation, board, teaching_experience_years, classes_json, subjects_json, areas_json, preferred_timings, experience, expected_negotiated_fee, availability, demo_readiness, status, active_students_count, total_commissions_paid, rating, remarks, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        $stmt->bind_param("sssssssssisssssdsssiddss", $id, $name, $contact, $email, $gender, $qualification, $graduation, $postGraduation, $board, $years, $classes, $subjects, $areas, $timings, $experience, $fee, $availability, $demoReady, $status, $active, $paid, $rating, $remarks, $notes);
        $stmt->execute();
        $stmt->close();
        $imported++;
    }
    crm_ok($conn, ['imported' => $imported, 'skipped' => $skipped]);
    $conn->close();
}

function handleCrmReset() {
    $conn = get_db_connection();
    crm_ensure_schema($conn);
    foreach (['crm_audit_logs', 'crm_followups', 'crm_commissions', 'crm_payments', 'crm_tuitions', 'crm_demos', 'crm_leads', 'crm_teachers'] as $table) {
        $conn->query("DELETE FROM `$table`");
    }
    crm_ok($conn);
    $conn->close();
}
