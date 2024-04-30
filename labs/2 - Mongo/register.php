<?php

require __DIR__ . '/vendor/autoload.php';

// MongoDB connection
$mongoClient = new MongoDB\Client();
$collection = $mongoClient->miniforum->users;

$user = [
    "username" => $_POST['username'],
    "password" => $_POST['password']
];

echo $user;

$register = $collection->insertOne($user);

// Redirect to index.php
header("Location: login.html");
exit;
?>
