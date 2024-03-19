<?php

require __DIR__ . '/vendor/autoload.php';

Predis\Autoloader::register();

try {
        // Connect to the localhost Redis server.
        $redis = new Predis\Client();

        // Set simple value.
        $redis->set("hello", "redis");

        // Set expiring value.
        $redis->set("foo", "bar!");
        $redis->expire("foo", 5); // 5 seconds

} catch (Exception $e) {
        print $e->getMessage();
};

?>