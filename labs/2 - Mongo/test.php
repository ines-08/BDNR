<?php

require __DIR__ . '/vendor/autoload.php';

try {
    // Connect to the local Mongo server.
    $mongo = new MongoDB\Client();

    // Select a database (create if it doesn't exist).
    $db = $mongo->selectDatabase('bdnr-php');

    // Select a collection.
    $docs = $db->docs;

    // Create two new documents.
    $new_docs = [
        [
            'country' => 'France',
            'capital' => 'Paris'
        ],
        [
            'country' => 'Italy',
            'capital' => 'Rome'
        ]
    ];

    // Insert documents to collection.
    $insert = $docs->insertMany($new_docs);

    // Print insert information.
    print_r($insert);

} catch (Exception $e) {
    print $e->getMessage();
};

?>