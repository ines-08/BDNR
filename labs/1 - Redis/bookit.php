<?php

require __DIR__ . '/vendor/autoload.php';
require __DIR__. '/backend.php';

Predis\Autoloader::register();

try {
    // Connect to the localhost Redis server.
    $redis = new Predis\Client();

    // Get URL and tags from POST data
    $url = $_POST['url'];
    $tags = explode(' ', $_POST['tags']);

    
    addBookmark($url, $tags);

    header("Location: index.php");
    exit();

    


} catch (Exception $e) {
    echo "An error occurred: " . $e->getMessage();
}

?>
