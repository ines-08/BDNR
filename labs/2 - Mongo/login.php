<?php

session_start();

require __DIR__ . '/vendor/autoload.php';

// MongoDB connection
$mongoClient = new MongoDB\Client();
$collection = $mongoClient->miniforum->users;

$user_database = $collection->findOne(['username' => $_POST['username']]);

$user = [
    "username" => $_POST['username'],
    "password" => $_POST['password']
];

$register = $collection->insertOne($user);

$_SESSION['username'] = $_POST['username'];

// Redirect to index.php
header("Location: index.php");
exit;
?>
