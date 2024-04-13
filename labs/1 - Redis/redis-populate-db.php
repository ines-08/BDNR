<?php

require __DIR__ . '/vendor/autoload.php';
require __DIR__. '/backend.php';

Predis\Autoloader::register();

try {
    // Connect to the localhost Redis server.
    $redis = new Predis\Client();

    // Flush all keys from the Redis database.
    $redis->flushdb();
    echo "All keys have been cleaned from the Redis database.\n";

    // Add sample bookmarks
    addBookmark("http://www.up.pt", ["education", "porto"]);
    addBookmark("http://www.yahoo.com", ["company", "web", "search"]);
    addBookmark("http://www.fe.up.pt", ["education", "engineering", "feup", "porto", "portugal"]);
    addBookmark("http://www.google.com", ["company", "search", "web"]);

    // Ensure that all specified tags are created
    $tags = ["company", "search", "porto", "education", "portugal", "feup", "web", "engineering", "google"];
    foreach ($tags as $tag) {
        $redis->sadd("tag:$tag", "");
    }

    // Add users
    $users = [
        [
            'username' => 'zeze',
            'password' => '123'
        ],
        [
            'username' => 'nes',
            'password' => '123'
        ]
    ];

    foreach ($users as $user) {
        $username = $user['username'];
        $password = password_hash($user['password'], PASSWORD_DEFAULT); // Hash the password
        $userData = [
            'id' => uniqid(), // Generate a unique ID for the user
            'username' => $username,
            'password' => $password
        ];
        $redis->hmset("user:$username", $userData);
    }

    echo "Database populated successfully.\n";

} catch (Exception $e) {
    echo "An error occurred: " . $e->getMessage();
}

?>
