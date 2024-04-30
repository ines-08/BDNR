<?php
require __DIR__ . '/vendor/autoload.php';

use \Laudis\Neo4j\Authentication\Authenticate;
use \Laudis\Neo4j\ClientBuilder;

$auth = Authenticate::basic('neo4j', 'Bdnr24neo4j');
$client = ClientBuilder::create()
               ->withDriver('http', 'http://localhost:7474', $auth)
               ->withDefaultDriver('http')
               ->build();

$username = $_POST['username'];
$password = $_POST['password'];

$result = $client->run( "CREATE (user:User {name: '"  .  $username .  "', password:
'" . $password ."'});");

// Redirect to index.php
header("Location: index.php");

exit;
?>
