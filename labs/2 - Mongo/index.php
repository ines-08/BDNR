<?php
session_start();

?>

<!DOCTYPE html>
<html>

    <head>
        <title>MiniForum</title>
    </head>

    <body>

        <h1>MiniForum - BDNR Lab 2</h1>
        <h3><a href="/">Home</a></h3>
        <h3><a href="new_topic.html">Start a new topic!</a></h3>
        <hr></hr>

        <?php

        require __DIR__ . '/vendor/autoload.php';

        // MongoDB connection
        $mongoClient = new MongoDB\Client();
        $collection = $mongoClient->miniforum->topics;
        $topics = $collection->find();

        echo "Welcome " . $_SESSION['username'];
        // There is a specific topic to show
        if (isset($_GET['topic'])) {

            // Show specific topic and comments
            $topicId = new MongoDB\BSON\ObjectId($_GET['topic']);
            $topic = $collection->findOne(['_id' => $topicId]);

            echo "<h2> Topic '" . $topic['title'] . "'</h2>";
            echo "<h5><strong>Author:</strong> " . $topic['author'] . "</h5>";
            echo "<p>\"" . $topic['body'] . "\"</p>";
            echo "<p>" . strval($topic['likes']) . " likes </p>";
            ?>

            <form method="POST" action="like.php">
                <input hidden name="title" value=<?= $topic['title'] ?> />
                <button type=submit>Like</button>
            </form>

            <?php
            echo "<hr></hr>";
            
            // Display comments
            echo "<h3>Comments</h3>";
            echo "<ul>";
            if (isset($topic['comments'])) {
                foreach ($topic['comments'] as $comment) {
                    echo "<li><strong>" . $comment['author'] . ":</strong> " . $comment['text'] . "</li>";
                }
            }
            echo "</ul>";
            echo "<hr></hr>";

            // Comment form
            echo "<h3>Add Comment</h3>";
            echo "<form action='new_comment.php' method='post'>";
            echo "<input type='hidden' name='topic' value='" . $_GET['topic'] . "'>";
            echo "<p><label for='comment'>Comment:</label><br>";
            echo "<textarea name='comment' id='comment' required></textarea></p>";
            echo "<p><label for='author'>Your Name:</label><br>";
            echo "<input type='text' name='author' id='author' required></p>";
            echo "<p><input type='submit' value='Add Comment'></p>";
            echo "</form>";
        } else {
        
            // Show list of all topics
            $topics = $collection->find();

            echo "<h2>Topics</h2>";
            echo "<ul>";
            foreach ($topics as $topic) {
                echo "<li><a href='?topic=" . $topic['_id'] . "'>" . $topic['title'] . "</a></li>";
            }
            echo "</ul>";
        }
        ?>

        <hr></hr>

    </body>

    <footer>
        BDNR Lab 2 @ 2024
    </footer>

</html>
