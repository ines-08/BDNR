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


$userUnfriend = $_POST['userunfriend'];

echo "<h3> User: " . $_SESSION['username'] ."</h3>";
echo "<h3> User Friend: " . $userUnfriend ."</h3>";

$result = $client->run("MATCH 
    (user1:User {name: '" . $_SESSION['username'] . "'})-[f:FOLLOW]->
    (user2:User {name: '" . $userUnfriend . "'})
    DELETE f;");


header("Location: users.php");
exit;
?>
