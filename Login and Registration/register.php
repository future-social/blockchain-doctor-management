<?php
if (isset($_POST['username']) && isset($_POST['password'])) :

    # Database Connection my_test_db is the Database name.
    $db_conn = mysqli_connect("localhost", "root", "", "authentication");

    # Assigning user data to variables for easy access later.
    $username = $_POST['username'];
    $password = $_POST['password'];

    # SQL query for Inserting the Form Data into the users table.
    $sql = "INSERT INTO `user` (`username`, `password`) VALUES ('$username', '$password')";

    # Executing the Above SQL query.
    $query = mysqli_query($db_conn, $sql);

    # Checks that the query executed successfully
    if ($query) {
        echo 'New data inserted successfully. <a href="login.html">Go Back</a>';
    } else {
        echo "Failed to insert new data.";
    }
    exit;
endif;

/**
 * This message occurs when a user tries to access Insert.php without -
 * the required method and credentials.
 */
echo '404 Page Not Found. <a href="register.html">Go Home</a>';
