<?php
/**
 * Vidi Veda - Secure Admin Panel Backend API
 */

header('Content-Type: application/json');
require_once 'config.php';

$action = $_GET['action'] ?? '';

// CORS Preflight handles config.php, routing begins here
switch ($action) {
    case 'login':
        handleLogin();
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
        
    default:
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid Administrative Action"]);
        break;
}

/**
 * Handle Admin Authentication Check (Stateless Token Validation)
 */
function requireAuth() {
    $headers = apache_request_headers();
    
    // Check capitalization variations of Authorization
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
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

    // Verify token expiry and signature hash integrity
    $expected_hash = hash_hmac('sha256', "$user.$expiry", ADMIN_PASS);
    
    if ($expiry < time()) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Authorization token has expired"]);
        exit;
    }

    if ($hash !== $expected_hash || $user !== ADMIN_USER) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Access denied. Invalid credentials signature."]);
        exit;
    }
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

    $username = trim($data['username'] ?? '');
    $password = trim($data['password'] ?? '');

    if ($username === ADMIN_USER && $password === ADMIN_PASS) {
        $expiry = time() + (24 * 3600); // Token valid for 24 Hours
        $hash = hash_hmac('sha256', "$username.$expiry", ADMIN_PASS);
        $token = base64_encode("$username.$expiry.$hash");
        
        echo json_encode([
            "success" => true,
            "message" => "Authorization successful",
            "token" => $token
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid administrator username or password"]);
    }
}

/**
 * Get Students & Child sub-relations
 */
function handleGetStudents() {
    $conn = get_db_connection();
    
    // Fetch parents
    $parents_result = $conn->query("SELECT * FROM parents ORDER BY created_at DESC");
    $students_list = [];

    if ($parents_result) {
        while ($parent = $parents_result->fetch_assoc()) {
            $parent_id = $parent['id'];
            
            // Fetch children for this parent
            $child_stmt = $conn->prepare("SELECT * FROM children WHERE student_id = ?");
            $child_stmt->bind_param("s", $parent_id);
            $child_stmt->execute();
            $children_result = $child_stmt->get_result();
            
            $children = [];
            while ($child = $children_result->fetch_assoc()) {
                $children[] = $child;
            }
            $child_stmt->close();
            
            $parent['children'] = $children;
            $students_list[] = $parent;
        }
    }

    echo json_encode(["success" => true, "data" => $students_list]);
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
?>
