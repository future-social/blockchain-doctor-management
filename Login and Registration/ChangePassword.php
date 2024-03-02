<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    // Redirect to the login page if not logged in
    header("Location: login.html");
    exit();
}

// Connect to MySQL database
$host = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "authentication";

$conn = new mysqli($host, $dbusername, $dbpassword, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the username from the session
$username = $_SESSION['username'];

// Process change password form
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $new_password = $_POST["new_password"];
    $confirm_new_password = $_POST["confirm_new_password"];

    // Add additional validation as needed

    // Check if the new passwords match
    if ($new_password !== $confirm_new_password) {
        echo "New passwords do not match.";
    } else {
        // Update the password in the database
        $update_sql = "UPDATE user SET password = '$new_password' WHERE username = '$username'";
        if ($conn->query($update_sql) === TRUE) {
            echo "Password changed successfully!";
        } else {
            echo "Error updating password: " . $conn->error;
        }
    }
}

$conn->close();
?>
