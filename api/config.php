<?php
/**
 * Vidi Veda - Database & Configuration File
 */

ini_set('display_errors', '0');
error_reporting(E_ALL);

// CORS headers for React dev server support
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    exit(0);
}

// Database Connection Parameters
// UPDATE THESE FOR HOSTINGER DEPLOYMENT
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'vidiveda_db');

// Used only to sign admin session tokens (not a login password).
// Change this to a long random string on Hostinger.
define('TOKEN_SECRET', 'vidiveda-change-this-token-secret');

// Initialize Connection Helper
function get_db_connection() {
    // Suppress warnings to handle failure gracefully in JSON
    @$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode([
            "success" => false, 
            "message" => "Database connection failed. Please ensure your database is created in Hostinger and credentials in config.php are correct.",
            "error" => $conn->connect_error
        ]);
        exit;
    }
    $conn->set_charset("utf8mb4");
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    return $conn;
}
