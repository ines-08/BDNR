<?php

session_start();

if(isset($_SESSION['username'])) {
    header("Location: index.php");
    exit(); // Stop further execution
}

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

$result = $client->run("MATCH (user:User {name: '"  .  $username .  "'}) 
RETURN user.name;");

// foreach ($result as $re) {
//     // Returns a Node
//     $r = $re->get('user.name');
//     echo "<a>" . $r . "</a>";
// }

$_SESSION['username'] = $username;

header("Location: index.php");

exit;
?>
