<?php

require __DIR__ . '/vendor/autoload.php';
require __DIR__. '/backend.php';

Predis\Autoloader::register();

session_start(); // Start session

try {
    // Connect to the localhost Redis server.
    $redis = new Predis\Client();

    // Check if the user is already logged in
    if(isset($_SESSION['user_id'])) {
        // User is already logged in, perform actions accordingly
        // For example, display bookmarks or redirect to another page
        header("Location: home.php");
        exit(); // Stop further execution
    } else {
        // If the user is not logged in, redirect to login page
        header("Location: login.php");
        exit(); // Stop further execution
    }

    // If user is logged in, continue displaying bookmarks or performing other actions

} catch (Exception $e) {
    echo "An error occurred: " . $e->getMessage();
}
?>
