<?php
/**
 * Vidi Veda - Secure Admin Panel Backend API
 */

header('Content-Type: application/json');
require_once 'config.php';

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'login':
            handleLogin();
            break;

        case 'change_password':
            requireAuth();
            handleChangePassword();
            break;
            
        case 'get_students':
            requireAuth();
            handleGetStudents();
            break;
            
        case 'get_tutors':
            requireAuth();
            handleGetTutors();
            break;
            
        case 'get_contacts':
            requireAuth();
            handleGetContacts();
            break;
            
        case 'update_tutor_status':
            requireAuth();
            handleUpdateTutorStatus();
            break;

        case 'get_assignments':
            requireAuth();
            handleGetAssignments();
            break;

        case 'save_assignment':
            requireAuth();
            handleSaveAssignment();
            break;

        case 'update_assignment_status':
            requireAuth();
            handleUpdateAssignmentStatus();
            break;
            
        default:
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid Administrative Action"]);
            break;
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}

/**
 * Handle Admin Authentication Check (Stateless Token Validation)
 */
function get_authorization_header() {
    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (is_array($headers)) {
            foreach ($headers as $key => $value) {
                if (strtolower($key) === 'authorization') {
                    return $value;
                }
            }
        }
    }

    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        if (is_array($headers)) {
            foreach ($headers as $key => $value) {
                if (strtolower($key) === 'authorization') {
                    return $value;
                }
            }
        }
    }

    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        return $_SERVER['HTTP_AUTHORIZATION'];
    }

    if (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        return $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }

    return '';
}

function find_admin_user($username) {
    $conn = get_db_connection();
    $stmt = $conn->prepare("SELECT id, username, password_hash FROM admin_users WHERE username = ? LIMIT 1");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->bind_result($id, $db_user, $password_hash);
    $found = $stmt->fetch();
    $stmt->close();
    $conn->close();

    if (!$found) {
        return null;
    }

    return [
        'id' => $id,
        'username' => $db_user,
        'password_hash' => $password_hash,
    ];
}

function issue_admin_token($username) {
    $expiry = time() + (24 * 3600);
    $hash = hash_hmac('sha256', "$username.$expiry", TOKEN_SECRET);
    return base64_encode("$username.$expiry.$hash");
}

function requireAuth() {
    $authHeader = get_authorization_header();
    
    if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Authorization token required"]);
        exit;
    }

    $token = $matches[1];
    $decoded = base64_decode($token);
    
    if (!$decoded) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid authorization token format"]);
        exit;
    }

    $parts = explode('.', $decoded);
    if (count($parts) !== 3) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Corrupted authorization token"]);
        exit;
    }

    $user = $parts[0];
    $expiry = (int)$parts[1];
    $hash = $parts[2];

    $expected_hash = hash_hmac('sha256', "$user.$expiry", TOKEN_SECRET);
    
    if ($expiry < time()) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Authorization token has expired"]);
        exit;
    }

    if (!hash_equals($expected_hash, $hash)) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Access denied. Invalid credentials signature."]);
        exit;
    }

    $admin = find_admin_user($user);
    if (!$admin) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Administrator account not found"]);
        exit;
    }

    $GLOBALS['auth_admin'] = $admin;
}

/**
 * Handle Login & Token Generation
 */
function handleLogin() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        return;
    }

    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    if (!is_array($data)) {
        $data = $_POST;
    }

    $username = trim($data['username'] ?? '');
    $password = (string)($data['password'] ?? '');

    if ($username === '' || $password === '') {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Username and password are required"]);
        return;
    }

    $admin = find_admin_user($username);
    if (!$admin || !password_verify($password, $admin['password_hash'])) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid administrator username or password"]);
        return;
    }

    echo json_encode([
        "success" => true,
        "message" => "Authorization successful",
        "token" => issue_admin_token($admin['username'])
    ]);
}

function handleChangePassword() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        return;
    }

    $admin = $GLOBALS['auth_admin'] ?? null;
    $data = read_json_body();
    $current = (string)($data['current_password'] ?? '');
    $new_password = (string)($data['new_password'] ?? '');

    if (!$admin || $current === '' || $new_password === '') {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Current and new password are required"]);
        return;
    }

    if (strlen($new_password) < 8) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "New password must be at least 8 characters"]);
        return;
    }

    if (!password_verify($current, $admin['password_hash'])) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Current password is incorrect"]);
        return;
    }

    $new_hash = password_hash($new_password, PASSWORD_DEFAULT);
    $username = $admin['username'];
    $conn = get_db_connection();
    $stmt = $conn->prepare("UPDATE admin_users SET password_hash = ? WHERE username = ?");
    $stmt->bind_param("ss", $new_hash, $username);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    echo json_encode(["success" => true, "message" => "Password updated successfully"]);
}

/**
 * Get Students & Child sub-relations
 */
function handleGetStudents() {
    $conn = get_db_connection();
    
    $students_list = [];
    $parents_result = $conn->query("SELECT * FROM parents ORDER BY created_at DESC");

    if ($parents_result) {
        while ($parent = $parents_result->fetch_assoc()) {
            $parent['children'] = [];
            $students_list[$parent['id']] = $parent;
        }
    }

    if (!empty($students_list)) {
        $children_result = $conn->query("SELECT * FROM children");
        if ($children_result) {
            while ($child = $children_result->fetch_assoc()) {
                $sid = $child['student_id'] ?? '';
                if (isset($students_list[$sid])) {
                    $students_list[$sid]['children'][] = $child;
                }
            }
        }
    }

    echo json_encode(["success" => true, "data" => array_values($students_list)]);
    $conn->close();
}

/**
 * Get Tutors applications list
 */
function handleGetTutors() {
    $conn = get_db_connection();
    $result = $conn->query("SELECT * FROM tutors ORDER BY created_at DESC");
    $tutors_list = [];

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $tutors_list[] = $row;
        }
    }

    echo json_encode(["success" => true, "data" => $tutors_list]);
    $conn->close();
}

/**
 * Get Contact queries list
 */
function handleGetContacts() {
    $conn = get_db_connection();
    $result = $conn->query("SELECT * FROM contacts ORDER BY created_at DESC");
    $contacts_list = [];

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $contacts_list[] = $row;
        }
    }

    echo json_encode(["success" => true, "data" => $contacts_list]);
    $conn->close();
}

/**
 * Update Tutor Application Status
 */
function handleUpdateTutorStatus() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        return;
    }

    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $tutor_id = trim($data['tutor_id'] ?? '');
    $status = trim($data['status'] ?? '');

    if (empty($tutor_id) || !in_array($status, ['pending', 'approved', 'rejected'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid Tutor ID or status value"]);
        return;
    }

    $conn = get_db_connection();
    $stmt = $conn->prepare("UPDATE tutors SET status = ? WHERE id = ?");
    $stmt->bind_param("ss", $status, $tutor_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Status updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database write error: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
}

function ensure_assignments_table($conn) {
    $conn->query("CREATE TABLE IF NOT EXISTS `assignments` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `type` VARCHAR(20) NOT NULL,
        `status` VARCHAR(20) NOT NULL DEFAULT 'active',
        `parent_id` VARCHAR(50) NOT NULL,
        `child_id` INT NOT NULL,
        `tutor_id` VARCHAR(50) NOT NULL,
        `address` TEXT NOT NULL,
        `amount` DECIMAL(10,2) NOT NULL DEFAULT 0,
        `started_at` DATE NOT NULL,
        `notes` TEXT,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
}

function read_json_body() {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    if (is_array($data)) {
        return $data;
    }
    return !empty($_POST) ? $_POST : [];
}

function handleGetAssignments() {
    $type = trim($_GET['type'] ?? '');
    if (!in_array($type, ['demo', 'coaching'], true)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid assignment type"]);
        return;
    }

    $conn = get_db_connection();
    ensure_assignments_table($conn);

    $sql = "SELECT a.*,
                p.parent_name, p.mobile_number AS parent_mobile, p.city, p.address AS parent_address,
                c.student_name, c.student_class, c.board, c.subjects, c.tuition_type,
                t.full_name AS tutor_name, t.mobile_number AS tutor_mobile
            FROM assignments a
            LEFT JOIN parents p ON p.id = a.parent_id
            LEFT JOIN children c ON c.id = a.child_id
            LEFT JOIN tutors t ON t.id = a.tutor_id
            WHERE a.type = '" . $conn->real_escape_string($type) . "'
            ORDER BY a.status = 'active' DESC, a.started_at DESC, a.id DESC";

    $result = $conn->query($sql);
    $rows = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
    }

    echo json_encode(["success" => true, "data" => $rows]);
    $conn->close();
}

function handleSaveAssignment() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        return;
    }

    $data = read_json_body();
    $id = (int)($data['id'] ?? 0);
    $type = trim($data['type'] ?? '');
    $parent_id = trim($data['parent_id'] ?? '');
    $child_id = (int)($data['child_id'] ?? 0);
    $tutor_id = trim($data['tutor_id'] ?? '');
    $address = trim($data['address'] ?? '');
    $amount = (float)($data['amount'] ?? 0);
    $started_at = trim($data['started_at'] ?? '');
    $notes = trim($data['notes'] ?? '');

    if (!in_array($type, ['demo', 'coaching'], true)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Type must be demo or coaching"]);
        return;
    }

    if ($parent_id === '' || $child_id <= 0 || $tutor_id === '' || $address === '' || $started_at === '') {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Student, teacher, address and start date are required"]);
        return;
    }

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $started_at)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Start date must be YYYY-MM-DD"]);
        return;
    }

    if ($amount < 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Amount cannot be negative"]);
        return;
    }

    $conn = get_db_connection();
    ensure_assignments_table($conn);

    $check = $conn->prepare("SELECT id FROM children WHERE id = ? AND student_id = ?");
    $check->bind_param("is", $child_id, $parent_id);
    $check->execute();
    $check->store_result();
    if ($check->num_rows === 0) {
        $check->close();
        $conn->close();
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Selected child does not belong to that parent registration"]);
        return;
    }
    $check->close();

    $tutor_check = $conn->prepare("SELECT id FROM tutors WHERE id = ?");
    $tutor_check->bind_param("s", $tutor_id);
    $tutor_check->execute();
    $tutor_check->store_result();
    if ($tutor_check->num_rows === 0) {
        $tutor_check->close();
        $conn->close();
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Selected tutor was not found"]);
        return;
    }
    $tutor_check->close();

    if ($id > 0) {
        $stmt = $conn->prepare("UPDATE assignments SET type = ?, parent_id = ?, child_id = ?, tutor_id = ?, address = ?, amount = ?, started_at = ?, notes = ? WHERE id = ?");
        $stmt->bind_param("ssissdssi", $type, $parent_id, $child_id, $tutor_id, $address, $amount, $started_at, $notes, $id);
    } else {
        $stmt = $conn->prepare("INSERT INTO assignments (type, status, parent_id, child_id, tutor_id, address, amount, started_at, notes) VALUES (?, 'active', ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssissdss", $type, $parent_id, $child_id, $tutor_id, $address, $amount, $started_at, $notes);
    }

    $stmt->execute();
    echo json_encode([
        "success" => true,
        "message" => $id > 0 ? "Assignment updated" : "Teacher mapped successfully",
        "id" => $id > 0 ? $id : $conn->insert_id
    ]);
    $stmt->close();
    $conn->close();
}

function handleUpdateAssignmentStatus() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        return;
    }

    $data = read_json_body();
    $id = (int)($data['id'] ?? 0);
    $status = trim($data['status'] ?? '');
    $convert_to = trim($data['convert_to'] ?? '');

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid assignment ID"]);
        return;
    }

    $conn = get_db_connection();
    ensure_assignments_table($conn);

    if ($convert_to === 'coaching') {
        $stmt = $conn->prepare("UPDATE assignments SET type = 'coaching', status = 'active' WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(["success" => true, "message" => "Demo moved to active coaching"]);
        $stmt->close();
        $conn->close();
        return;
    }

    if (!in_array($status, ['active', 'completed', 'cancelled'], true)) {
        $conn->close();
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid status"]);
        return;
    }

    $stmt = $conn->prepare("UPDATE assignments SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $id);
    $stmt->execute();
    echo json_encode(["success" => true, "message" => "Status updated"]);
    $stmt->close();
    $conn->close();
}

