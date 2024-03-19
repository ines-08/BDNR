<?php

require __DIR__ . '/vendor/autoload.php';

Predis\Autoloader::register();

try {
        // Connect to the localhost Redis server.
        $redis = new Predis\Client();

        // Get values.
        print "hello => " . $redis->get('hello') . "\n";
        print "foo => " . $redis->get('foo') . "(" . $redis->pttl('foo') . " ms to live)\n";

} catch (Exception $e) {
        print $e->getMessage();
};

?>