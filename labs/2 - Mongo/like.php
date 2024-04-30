<?php

require __DIR__ . '/vendor/autoload.php';

// MongoDB connection
$mongoClient = new MongoDB\Client();
$collection = $mongoClient->miniforum->topics;

$topic = $collection->findOne(['title' => $_POST['title']]);

$newLikes = isset($topic['likes']) ? $topic['likes'] + 1 : 1;

$updateResult = $collection->updateOne(
    ['_id' => $topic['_id']],
    ['$set' => ['likes' => $newLikes]]
);

// Redirect to index.php
header("Location: index.php");
exit;
?>
