<?php

require __DIR__ . '/vendor/autoload.php';

// MongoDB connection
$mongoClient = new MongoDB\Client();
$collection = $mongoClient->miniforum->topics;

// Insert new topic
$topic = [
    "title" => $_POST['title'],
    "body" => $_POST['body'],
    "author" => $_POST['author']
];
$insertResult = $collection->insertOne($topic);

// Redirect to index.php
header("Location: index.php");
exit;
?>
