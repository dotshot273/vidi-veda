<?php
/**
 * Vidi Veda - Database Installer
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config.php';

$message = "";
$status = "info"; // info, success, error

// 1. Try to connect to MySQL
@$conn = new mysqli(DB_HOST, DB_USER, DB_PASS);

if ($conn->connect_error) {
    $status = "error";
    $message = "Could not connect to MySQL server. Please verify the host, username, and password in <code>public/api/config.php</code>.<br><br>Error: " . $conn->connect_error;
} else {
    // Connection to server succeeded. Now let's try to select or create the DB
    $db_name = DB_NAME;
    $db_selected = $conn->select_db($db_name);
    
    if (!$db_selected) {
        // Try to create the database (works on XAMPP/WAMP, usually fails on Hostinger Shared due to permissions)
        if ($conn->query("CREATE DATABASE IF NOT EXISTS `$db_name` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")) {
            $conn->select_db($db_name);
            $db_selected = true;
        } else {
            $status = "error";
            $message = "Database <code>" . DB_NAME . "</code> does not exist and could not be created automatically. Please create a database named <code>" . DB_NAME . "</code> inside your Hostinger hPanel / Control Panel first, then refresh this page.";
        }
    }
    
    if ($db_selected) {
        // We are connected to the database. Let's create tables.
        $queries = [];
        
        // Parents Table
        $queries['parents'] = "CREATE TABLE IF NOT EXISTS `parents` (
            `id` VARCHAR(50) PRIMARY KEY,
            `parent_name` VARCHAR(100) NOT NULL,
            `mobile_number` VARCHAR(15) NOT NULL,
            `whatsapp_number` VARCHAR(15) NOT NULL,
            `address` TEXT NOT NULL,
            `city` VARCHAR(50) NOT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
        
        // Children Table
        $queries['children'] = "CREATE TABLE IF NOT EXISTS `children` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `student_id` VARCHAR(50) NOT NULL,
            `student_name` VARCHAR(100) NOT NULL,
            `student_class` VARCHAR(50) NOT NULL,
            `board` VARCHAR(20) NOT NULL,
            `subjects` TEXT NOT NULL,
            `tuition_type` VARCHAR(50) NOT NULL,
            `preferred_timing` VARCHAR(50) NOT NULL,
            FOREIGN KEY (`student_id`) REFERENCES `parents`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
        
        // Tutors Table
        $queries['tutors'] = "CREATE TABLE IF NOT EXISTS `tutors` (
            `id` VARCHAR(50) PRIMARY KEY,
            `full_name` VARCHAR(100) NOT NULL,
            `mobile_number` VARCHAR(15) NOT NULL,
            `qualification` VARCHAR(150) NOT NULL,
            `subjects` TEXT NOT NULL,
            `experience` VARCHAR(50) NOT NULL,
            `preferred_areas` VARCHAR(255) NOT NULL,
            `resume_path` VARCHAR(255) DEFAULT NULL,
            `id_proof_path` VARCHAR(255) DEFAULT NULL,
            `status` VARCHAR(20) DEFAULT 'pending',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
        
        // Contacts Table
        $queries['contacts'] = "CREATE TABLE IF NOT EXISTS `contacts` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(100) NOT NULL,
            `email` VARCHAR(100) NOT NULL,
            `mobile` VARCHAR(15) NOT NULL,
            `message` TEXT NOT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
        
        // Admin Users Table
        $queries['admin_users'] = "CREATE TABLE IF NOT EXISTS `admin_users` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `username` VARCHAR(50) NOT NULL UNIQUE,
            `password_hash` VARCHAR(255) NOT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
        
        $success = true;
        $err_msgs = [];
        
        foreach ($queries as $table => $sql) {
            if (!$conn->query($sql)) {
                $success = false;
                $err_msgs[] = "Error creating table `$table`: " . $conn->error;
            }
        }
        
        if ($success) {
            // Table creation succeeded. Let's create the default admin user
            $admin_user = ADMIN_USER;
            $admin_pass_hash = password_hash(ADMIN_PASS, PASSWORD_DEFAULT);
            
            // Check if admin user already exists
            $check_admin = $conn->prepare("SELECT id FROM admin_users WHERE username = ?");
            $check_admin->bind_param("s", $admin_user);
            $check_admin->execute();
            $result = $check_admin->get_result();
            
            if ($result->num_rows === 0) {
                $insert_admin = $conn->prepare("INSERT INTO admin_users (username, password_hash) VALUES (?, ?)");
                $insert_admin->bind_param("ss", $admin_user, $admin_pass_hash);
                if (!$insert_admin->execute()) {
                    $err_msgs[] = "Error creating default administrator: " . $insert_admin->error;
                    $success = false;
                }
            }
            
            // Create uploads directory
            $uploads_dir = __DIR__ . '/uploads';
            if (!file_exists($uploads_dir)) {
                mkdir($uploads_dir, 0755, true);
                // Create .htaccess inside uploads to prevent direct script execution
                file_put_contents($uploads_dir . '/.htaccess', "Options -ExecCGI\nRemoveHandler .php .phtml .php3 .php4 .php5 .php6 .php7 .php8 .phps .pl .py .jsp .asp .sh .cgi\n<Files ^(*.php|*.phps)>\norder deny,allow\ndeny from all\n</Files>");
            }
        }
        
        if ($success) {
            $status = "success";
            $message = "Database tables and administrator account initialized successfully!<br><br>
                       <strong>Database:</strong> <code>" . DB_NAME . "</code><br>
                       <strong>Default Admin Username:</strong> <code>" . ADMIN_USER . "</code><br>
                       <strong>Default Admin Password:</strong> <code>" . ADMIN_PASS . "</code><br><br>
                       <em>Important: For security, please delete this file (<code>install.php</code>) from your hosting after setup.</em>";
        } else {
            $status = "error";
            $message = "Installation failed with the following errors:<br><ul><li>" . implode("</li><li>", $err_msgs) . "</li></ul>";
        }
    }
    
    $conn->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vidi Veda Setup Wizard</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #FFF8F5;
            color: #2C2520;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(255, 122, 48, 0.08);
            max-width: 500px;
            width: 100%;
            padding: 40px;
            border-top: 6px solid #FF7A30;
            text-align: center;
        }
        h1 {
            font-family: 'Outfit', sans-serif;
            color: #FF7A30;
            margin-top: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .logo-subtitle {
            font-size: 14px;
            color: #7E7267;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 30px;
            font-weight: 600;
        }
        .alert {
            padding: 20px;
            border-radius: 10px;
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 30px;
            text-align: left;
        }
        .alert-success {
            background-color: #E6F7ED;
            color: #1E6B3F;
            border-left: 4px solid #34D399;
        }
        .alert-error {
            background-color: #FDF2F2;
            color: #9B1C1C;
            border-left: 4px solid #F87171;
        }
        code {
            background-color: rgba(0,0,0,0.06);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 14px;
        }
        .btn {
            display: inline-block;
            background-color: #FF7A30;
            color: white;
            padding: 12px 30px;
            border-radius: 30px;
            text-decoration: none;
            font-family: 'Outfit', sans-serif;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(255, 122, 48, 0.2);
            border: none;
            cursor: pointer;
        }
        .btn:hover {
            background-color: #E05E1A;
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(255, 122, 48, 0.3);
        }
        .btn-secondary {
            background-color: transparent;
            color: #FF7A30;
            border: 2px solid #FF7A30;
            box-shadow: none;
            margin-left: 10px;
        }
        .btn-secondary:hover {
            background-color: #FFF8F5;
            color: #E05E1A;
            border-color: #E05E1A;
            transform: translateY(-2px);
            box-shadow: none;
        }
        .footer-text {
            font-size: 12px;
            color: #A3968A;
            margin-top: 40px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Vidi Veda</h1>
        <div class="logo-subtitle">Home Tutoring Platform</div>
        
        <?php if ($status == 'success'): ?>
            <div class="alert alert-success">
                <?php echo $message; ?>
            </div>
            <a href="/" class="btn">Go to Website</a>
        <?php else: ?>
            <div class="alert alert-error">
                <?php echo $message; ?>
            </div>
            <button onclick="window.location.reload();" class="btn">Try Again</button>
            <a href="/" class="btn btn-secondary">Go to Home</a>
        <?php endif; ?>
        
        <div class="footer-text">
            Vidi Veda Setup Wizard © 2026. Bareilly, Uttar Pradesh, India.
        </div>
    </div>
</body>
</html>
