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


echo "<h2> Profile " . $_SESSION['username']. "</h2>";
echo "<h3> Following </h3>";

$followers = [];

$following = $client->run("MATCH 
    ( x:User {name: '" . $_SESSION['username'] ."'})-[:FOLLOW]->(m:User) 
    RETURN m.name;");

foreach ($following as $follow) {
    $f = $follow->get('m.name');
    array_push($followers, $f);

    if ($f != $_SESSION['username']) { 

        $bookmarks = $client->run("MATCH (user:User {name: '" . $f . "'})-
            [:Has]->(b:Bookmark)-[:HAS_TAG]->(t:Tag)
            WITH b, COLLECT(t.name) AS tags
            RETURN b.url, tags
            ORDER BY b.when_added
            LIMIT 10;");
        ?>

        <form action="unfollow.php" method='post'>
            <h3> <?= $f ?> </h3>
            <input name="userunfriend" hidden value=<?= $f ?> />

            <?php
            foreach ($bookmarks as $result) {
                $bookmark = $result->get('b.url');
                echo "<h4 style='margin-left: 20px;'><a>" . $bookmark . "</a></h4>";
                $tags= $result->get('tags');
                
                for ($index=0; $index < count($tags); $index++){
                    echo "<li style='margin-left: 20px;'>" . $tags[$index] . "</li>";
                }
        }
            ?>
            <button> Unfollow </button>
        </form>
    <?php }
}

$result = $client->run("MATCH (user:User) RETURN user.name;");

echo "<h3> Others </h3>";

foreach ($result as $user) {
    
    $us = $user->get('user.name');
    if($us != $_SESSION['username'] && !in_array($us, $followers)) { ?>
        <form action="follow.php" method='post'>
            <li> <?= $us ?> </li>
            <input name="userfriend" hidden value=<?= $us ?> />
            <button> Follow </button>
        </form>
    <?php } 
}

exit;
?>
