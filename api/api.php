<?php
/**
 * Vidi Veda - Public Frontend API
 */

header('Content-Type: application/json');
require_once 'config.php';

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'register_student':
            handleRegisterStudent();
            break;
            
        case 'register_tutor':
            handleRegisterTutor();
            break;
            
        case 'submit_contact':
            handleSubmitContact();
            break;
            
        default:
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid API Action"]);
            break;
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}

/**
 * Handle Student & Children Registration
 */
function read_request_payload() {
    if (!empty($_POST)) {
        $data = $_POST;
        if (isset($data['children']) && is_string($data['children'])) {
            $decoded = json_decode($data['children'], true);
            if (is_array($decoded)) {
                $data['children'] = $decoded;
            }
        }
        return $data;
    }

    $input = file_get_contents('php://input');
    if ($input === false || trim($input) === '') {
        return null;
    }

    $data = json_decode($input, true);
    return is_array($data) ? $data : null;
}

function ensure_student_schema($conn) {
    try {
        $column = $conn->query("SHOW COLUMNS FROM `children` LIKE 'tuition_type'");
        $row = $column ? $column->fetch_assoc() : null;
        if ($row && preg_match('/varchar\((\d+)\)/i', $row['Type'], $matches) && (int)$matches[1] < 150) {
            $conn->query("ALTER TABLE `children` MODIFY `tuition_type` VARCHAR(150) NOT NULL");
            $conn->query("ALTER TABLE `children` MODIFY `preferred_timing` VARCHAR(150) NOT NULL");
            $conn->query("ALTER TABLE `children` MODIFY `board` VARCHAR(50) NOT NULL");
            $conn->query("ALTER TABLE `parents` MODIFY `city` VARCHAR(100) NOT NULL");
        }
    } catch (Throwable $e) {
        // Continue; insert will report the real database error
    }
}

function handleRegisterStudent() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        return;
    }

    $data = read_request_payload();

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid registration payload"]);
        return;
    }

    $parent_name = trim($data['parent_name'] ?? '');
    $mobile = trim($data['mobile_number'] ?? '');
    $whatsapp = trim($data['whatsapp_number'] ?? '');
    $address = trim($data['address'] ?? '');
    $city = trim($data['city'] ?? '');
    $children = $data['children'] ?? [];

    // Validation
    if (empty($parent_name) || empty($mobile) || empty($whatsapp) || empty($address) || empty($city)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "All parent fields are required"]);
        return;
    }

    if (empty($children) || !is_array($children)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "At least one child details must be provided"]);
        return;
    }

    $conn = get_db_connection();
    ensure_student_schema($conn);

    // Begin Transaction to ensure both parent and children records write together
    $conn->begin_transaction();

    try {
        // Generate Unique Student ID: VV-STU-YEAR-RANDOM
        $year = date('Y');
        $rand = rand(1000, 9999);
        $student_id = "VV-STU-{$year}-{$rand}";

        // Ensure uniqueness
        $check = $conn->prepare("SELECT id FROM parents WHERE id = ?");
        $check->bind_param("s", $student_id);
        $check->execute();
        $check->store_result();
        if ($check->num_rows > 0) {
            $student_id = "VV-STU-{$year}-" . rand(1000, 9999);
        }
        $check->close();

        // Insert Parent
        $parent_stmt = $conn->prepare("INSERT INTO parents (id, parent_name, mobile_number, whatsapp_number, address, city) VALUES (?, ?, ?, ?, ?, ?)");
        $parent_stmt->bind_param("ssssss", $student_id, $parent_name, $mobile, $whatsapp, $address, $city);
        $parent_stmt->execute();
        $parent_stmt->close();

        // Insert Children
        $child_stmt = $conn->prepare("INSERT INTO children (student_id, student_name, student_class, board, subjects, tuition_type, preferred_timing) VALUES (?, ?, ?, ?, ?, ?, ?)");
        
        foreach ($children as $child) {
            $c_name = trim($child['student_name'] ?? '');
            $c_class = trim($child['student_class'] ?? '');
            $c_board = trim($child['board'] ?? '');
            $c_subjects = trim($child['subjects'] ?? '');
            $c_type = trim($child['tuition_type'] ?? '');
            $c_timing = trim($child['preferred_timing'] ?? '');

            if (empty($c_name) || empty($c_class) || empty($c_board) || empty($c_subjects)) {
                throw new Exception("Missing required fields for child information");
            }

            $child_stmt->bind_param("sssssss", $student_id, $c_name, $c_class, $c_board, $c_subjects, $c_type, $c_timing);
            $child_stmt->execute();
        }
        $child_stmt->close();

        // Commit Transaction
        $conn->commit();
        echo json_encode([
            "success" => true,
            "message" => "Registration successful",
            "student_id" => $student_id
        ]);

    } catch (Throwable $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Transaction failed: " . $e->getMessage()]);
    } finally {
        $conn->close();
    }
}

/**
 * Handle Tutor Application with file uploads
 */
function handleRegisterTutor() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        return;
    }

    if (empty($_POST) && empty($_FILES) && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
        http_response_code(413);
        echo json_encode(["success" => false, "message" => "Upload is too large for the server. Please use files under 5MB."]);
        return;
    }

    $full_name = trim($_POST['full_name'] ?? '');
    $mobile = trim($_POST['mobile_number'] ?? '');
    $qualification = trim($_POST['qualification'] ?? '');
    $subjects = trim($_POST['subjects'] ?? '');
    $experience = trim($_POST['experience'] ?? '');
    $preferred_areas = trim($_POST['preferred_areas'] ?? '');

    // Validation
    if (empty($full_name) || empty($mobile) || empty($qualification) || empty($subjects) || empty($experience) || empty($preferred_areas)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "All tutor details are required"]);
        return;
    }

    // Verify Files Exist
    if (!isset($_FILES['resume']) || !isset($_FILES['id_proof'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Resume and ID proof files are required"]);
        return;
    }

    $resume_file = $_FILES['resume'];
    $id_proof_file = $_FILES['id_proof'];

    // File validation details
    $allowed_resume_exts = ['pdf', 'doc', 'docx'];
    $allowed_id_exts = ['pdf', 'jpg', 'jpeg', 'png'];

    $resume_ext = strtolower(pathinfo($resume_file['name'], PATHINFO_EXTENSION));
    $id_ext = strtolower(pathinfo($id_proof_file['name'], PATHINFO_EXTENSION));

    if (!in_w_list($resume_ext, $allowed_resume_exts)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Resume must be a PDF or Word document"]);
        return;
    }

    if (!in_w_list($id_ext, $allowed_id_exts)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID Proof must be a PDF or Image (JPG, PNG)"]);
        return;
    }

    // Size limit: 5MB
    if ($resume_file['size'] > 5 * 1024 * 1024 || $id_proof_file['size'] > 5 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "File sizes must be under 5MB each"]);
        return;
    }

    $uploads_dir = __DIR__ . '/uploads';
    if (!file_exists($uploads_dir)) {
        mkdir($uploads_dir, 0755, true);
    }

    // Generate Unique Tutor ID
    $conn = get_db_connection();
    $year = date('Y');
    $rand = rand(1000, 9999);
    $tutor_id = "VV-TUT-{$year}-{$rand}";

    // Ensure uniqueness
    $check = $conn->prepare("SELECT id FROM tutors WHERE id = ?");
    $check->bind_param("s", $tutor_id);
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) {
        $tutor_id = "VV-TUT-{$year}-" . rand(1000, 9999);
    }
    $check->close();

    // Safe filenames: ID_Prefix + Timestamp + CleanExt
    $resume_filename = "resume_{$tutor_id}_" . time() . ".{$resume_ext}";
    $id_filename = "id_{$tutor_id}_" . time() . ".{$id_ext}";

    $resume_dest = $uploads_dir . '/' . $resume_filename;
    $id_dest = $uploads_dir . '/' . $id_filename;

    if (move_uploaded_file($resume_file['tmp_name'], $resume_dest) && move_uploaded_file($id_proof_file['tmp_name'], $id_dest)) {
        // Save to Database
        $stmt = $conn->prepare("INSERT INTO tutors (id, full_name, mobile_number, qualification, subjects, experience, preferred_areas, resume_path, id_proof_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssssss", $tutor_id, $full_name, $mobile, $qualification, $subjects, $experience, $preferred_areas, $resume_filename, $id_filename);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Tutor registration complete",
                "tutor_id" => $tutor_id
            ]);
        } else {
            // Delete files if database write failed
            unlink($resume_dest);
            unlink($id_dest);
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Database write error: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "File upload failed. Check folder write permissions."]);
    }
    $conn->close();
}

/**
 * Handle Contact Message Queries
 */
function handleSubmitContact() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        return;
    }

    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid message payload"]);
        return;
    }

    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $mobile = trim($data['mobile'] ?? '');
    $message = trim($data['message'] ?? '');

    if (empty($name) || empty($mobile) || empty($message)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Name, Mobile and Message are required"]);
        return;
    }

    $conn = get_db_connection();
    $stmt = $conn->prepare("INSERT INTO contacts (name, email, mobile, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $mobile, $message);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Message sent successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database error: " . $stmt->error]);
    }
    $stmt->close();
    $conn->close();
}

// Utility extension verify check helper
function in_w_list($needle, $haystack) {
    return in_array($needle, $haystack);
}
?>
