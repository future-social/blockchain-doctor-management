<?php

if($_SERVER["REQUEST_METHOD"] == "POST"){

    //retrieve form data
    $username = $_POST['username'];
    $password = $_POST['password'];

    //database connection
    $host = "localhost";
    $dbusername = "root";
    $dbpassword = "";
    $dbname = "authentication";

    $conn = new mysqli($host, $dbusername, $dbpassword, $dbname);

    if($conn->connect_error){
        die("Connection failed: ". $conn->connect_error);   
    }

    $query = "SELECT * FROM user WHERE username='$username' AND password='$password'";
    $result = $conn->query($query);
    
    if(($result->num_rows == 1) && (strpos($username, "adm") !== false)){
        session_start();
        $_SESSION['username'] = $username;
        echo "<script>alert('Welcome $username');document.location='ChangePassword.html'</script>";    
    }
    else if(($result->num_rows == 1) && (strpos($username, "doc") !== false)){
        session_start();
        $_SESSION['username'] = $username;
        echo "<script>alert('Welcome DOCTOR');document.location='ChangePassword.html'</script>";
    }
    else{
        //Login uncess
        echo "<script>alert('Your login attempt was unsuccessful. Please check your username and password and try again.');document.location='login.html'</script>";
        exit();
    }

    $conn->close();
}
?>