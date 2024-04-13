<?php

session_start(); // Start session

if(isset($_SESSION['user_id'])) {
    // If user is already logged in, redirect to index.php or any other page
    header("Location: index.php");
    exit();
}

if($_SERVER["REQUEST_METHOD"] == "POST") {
    // If login form is submitted
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Validate username and password (you can add more validation as per your requirements)
    if(empty($username) || empty($password)) {
        $error = "Please enter both username and password.";
    } else {
        // Check username and password against database (in this case Redis)

        require __DIR__ . '/vendor/autoload.php';
        require __DIR__. '/backend.php';

        Predis\Autoloader::register();

        try {
            // Connect to the localhost Redis server.
            $redis = new Predis\Client();

            // Retrieve user information from Redis
            $userData = $redis->hgetall("user:$username");

            // Verify password
            if($userData && password_verify($password, $userData['password'])) {
                // Password is correct, set session and redirect
                $_SESSION['user_id'] = $userData['id'];
                $_SESSION['username'] = $username;
                header("Location: index.php"); // Redirect to desired page
                exit();
            } else {
                // Invalid credentials, display error message
                $error = "Invalid username or password.";
            }

        } catch (Exception $e) {
            $error = "An error occurred: " . $e->getMessage();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>
<body>
    <h2>Login</h2>
    <?php if(isset($error)) { ?>
        <p style="color: red;"><?php echo $error; ?></p>
    <?php } ?>
    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username"><br>
        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password"><br><br>
        <input type="submit" value="Login">
    </form>
</body>
</html>
