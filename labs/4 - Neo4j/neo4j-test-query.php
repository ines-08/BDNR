<?php
require __DIR__ . '/vendor/autoload.php';

use \Laudis\Neo4j\Authentication\Authenticate;
use \Laudis\Neo4j\ClientBuilder;

$auth = Authenticate::basic('neo4j', 'Bdnr24neo4j');
$client = ClientBuilder::create()
               ->withDriver('http', 'http://localhost:7474', $auth)
               ->withDefaultDriver('http')
               ->build();

// Results are a CypherList
$results = $client->run('MATCH (n) RETURN n');

// A row is a CypherMap
foreach ($results as $result) {
        // Returns a Node
        $n = $result->get('n');

        echo $n->getId() ."\t";
        echo $n->getProperty('name') ."\n";
}
?>