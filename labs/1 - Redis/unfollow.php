<?php

session_start(); // Start session

// Check if user is not logged in
if (!isset($_SESSION['username'])) {
    // Redirect user to the login page
    header("Location: login.php");
    exit(); // Stop further execution
}

if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET['username'])) {
    // Get the logged-in user's username
    $loggedInUser = $_SESSION['username'];

    // Get the username to unfollow
    $usernameToUnfollow = $_GET['username'];

    // Perform the unfollow action
    require __DIR__ . '/vendor/autoload.php';
    Predis\Autoloader::register();
    try {
        // Connect to the localhost Redis server.
        $redis = new Predis\Client();

        // Remove the username from the logged-in user's favorite list
        $favoriteUsersKey = "follows:$loggedInUser";
        $redis->srem($favoriteUsersKey, $usernameToUnfollow);

        // Redirect back to the page where the unfollow action was triggered
        header("Location: {$_SERVER['HTTP_REFERER']}");
        exit(); // Stop further execution
    } catch (Exception $e) {
        echo "An error occurred: " . $e->getMessage();
    }
} else {
    // Invalid request, redirect to the home page
    header("Location: home.php");
    exit(); // Stop further execution
}
?>
