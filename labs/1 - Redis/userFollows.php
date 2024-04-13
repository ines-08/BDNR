<?php

session_start(); // Start session

// Check if user is not logged in
if (!isset($_SESSION['username'])) {
    // Redirect user to the login page
    header("Location: login.php");
    exit(); // Stop further execution
}

require __DIR__ . '/vendor/autoload.php';

Predis\Autoloader::register();
?>

<h2>User Follows</h2>

<?php
try {
    // Connect to the localhost Redis server.
    $redis = new Predis\Client();

    // Get logged-in user's username
    $loggedInUser = $_SESSION['username'];

    // Get logged-in user's favorite users (if any)
    $favoriteUsersKey = "follows:$loggedInUser";
    $favoriteUsers = $redis->smembers($favoriteUsersKey);
    // Get all users from Redis database
    $allUsers = $redis->keys("user:*");
    $allUsernames = [];
    foreach ($allUsers as $userKey) {
        // Extract the username from the user key
        $username = explode(':', $userKey);
        $username = end($username);
        
        // Skip the logged-in user in the list
        if ($username != $loggedInUser) {
            $allUsernames[$username] = $username;
        }
    }

    // Display the list of users
    echo "<ul>";
    foreach ($allUsernames as $username) {
        echo "<li>{$username} - ";
        // Check if the user is already in the favorite list
        if (in_array($username, $favoriteUsers)) {
            // If yes, display the unfollow link
            echo "<a href='unfollow.php?username={$username}'>Unfollow</a>";
        } else {
            // If not, display the follow link
            echo "<a href='follow.php?username={$username}'>Follow</a>";
        }
        echo "</li>";
    }
    echo "</ul>";

} catch (Exception $e) {
    echo "An error occurred: " . $e->getMessage();
}
?>
