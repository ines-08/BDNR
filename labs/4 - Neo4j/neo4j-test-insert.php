<?php
require __DIR__ . '/vendor/autoload.php';

use \Laudis\Neo4j\Authentication\Authenticate;
use \Laudis\Neo4j\ClientBuilder;

$auth = Authenticate::basic('neo4j', 'Bdnr24neo4j');
$client = ClientBuilder::create()
               ->withDriver('http', 'http://localhost:7474', $auth)
               ->withDefaultDriver('http')
               ->build();

// Create a new Person node and a relationship with a new City.
$results = $client->run(<<<'CYPHER'
MATCH
        (p:Country {name: "Portugal"})
CREATE
        (b:City {name: "Braga"}),
        (r:Person {name: "Rita"}),
        (r)-[:LIVES_IN]->(b),
        (b)-[:IS_IN]->(p);
CYPHER
);

echo "Number of nodes created: ". ($results->getSummary()->getCounters()->nodesCreated()) ."\n";
?>