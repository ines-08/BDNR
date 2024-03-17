<?php

require __DIR__ . '/vendor/autoload.php';

// MongoDB connection
$mongoClient = new MongoDB\Client();
$collection = $mongoClient->miniforum->topics;

// Add comment to the topic
$topicId = new MongoDB\BSON\ObjectId($_POST['topic']);
$comment = [
    "text" => $_POST['comment'],
    "author" => $_POST['author']
];
$updateResult = $collection->updateOne(
    ['_id' => $topicId],
    ['$push' => ['comments' => $comment]]
);

// Redirect to index.php
header("Location: index.php");
exit;
?>
