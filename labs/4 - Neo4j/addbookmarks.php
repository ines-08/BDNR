<?php

session_start();

require __DIR__ . '/vendor/autoload.php';

use \Laudis\Neo4j\Authentication\Authenticate;
use \Laudis\Neo4j\ClientBuilder;

$auth = Authenticate::basic('neo4j', 'Bdnr24neo4j');
$client = ClientBuilder::create()
               ->withDriver('http', 'http://localhost:7474', $auth)
               ->withDefaultDriver('http')
               ->build();

$url = $_POST['url'];
$tags = $_POST['tags'];

$result = $client->run( "CREATE (tag:Tag {name: '"  .  $tags .  "'}), 
    (b:Bookmark {url: '" . $url .  "'}),
    (b)-[:HAS_TAG]->(tag);");

$client->run("MATCH (x:User {name:'" . $_SESSION['username'] ."'}), 
    (b:Bookmark {url: '" . $url ."'})   
    CREATE (x)-[:Has]->(b) ;");

// Redirect to index.php
header("Location: index.php");

exit;
?>
