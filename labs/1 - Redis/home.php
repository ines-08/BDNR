<?php

session_start(); // Start session

// Check if user is not logged in
if (!isset($_SESSION['user_id'])) {
    // Redirect user to the login page
    header("Location: login.php");
    exit(); // Stop further execution
}

require __DIR__ . '/vendor/autoload.php';
require __DIR__. '/backend.php';

Predis\Autoloader::register();
?>
<h1>BDNR melhor cadeira</h1>

<p> Logged in as <?php echo $_SESSION['username']; ?> </p>

<a href="logout.php">Logout</a>

<?php
try {
    // Connect to the localhost Redis server.
    $redis = new Predis\Client();

    // Check if tags are defined in URL parameters
    $tagsParam = isset($_GET['tags']) ? $_GET['tags'] : '';

    if ($tagsParam === '') {
        // If no tags are defined, retrieve the 15 most recent bookmarks
        $bookmarks = getRecentBookmarks();
    } else {
        // If tags are defined, parse the comma-separated list of tags
        $tags = explode(',', $tagsParam);
        // Retrieve a list of bookmarks resulting from the intersection of the selected tags
        $bookmarks = getBookmarksByTags($tags);
    }

    // Display the bookmarks with associated tags
    echo "<ul>";
    foreach ($bookmarks as $bookmark) {
        echo "<li><a href='{$bookmark['url']}'>{$bookmark['url']}</a>";
        echo "<p> Author : {$bookmark['author']}</p>";
        // Retrieve and display associated tags
        $bookmarkId = $bookmark['id'];
        $tags = $redis->smembers("bookmark:$bookmarkId:tags");
        if (!empty($tags)) {
            echo "<ul>";
            foreach ($tags as $tag) {
                echo "<li>{$tag}</li>";
            }
            echo "</ul>";
        } else {
            echo "<span>No tags associated</span>";
        }
        echo "</li>";
    }
    echo "</ul>";


} catch (Exception $e) {
    echo "An error occurred: " . $e->getMessage();
}

include 'add.html';
include 'userFollows.php';

?>