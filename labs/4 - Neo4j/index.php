<?php
    session_start();

    if(!isset($_SESSION['username'])) {
        header("Location: login.html");
    } 
?>

<!DOCTYPE html>
<html>

    <head>
        <title>Bookit! 3</title>
    </head>

    <body>
        <h1>Welcome <?= $_SESSION['username'] ?> !</h1>
        <h1>Latest Bookmarks</h1>
        <a href="users.php">See users</a>
        <hr></hr>

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

        $bookmarks = $client->run("MATCH (user:User {name: '" . $_SESSION['username'] . "'})-
            [:Has]->(b:Bookmark)-[:HAS_TAG]->(t:Tag)
            WITH b, COLLECT(t.name) AS tags
            RETURN b.url, tags
            ORDER BY b.when_added
            LIMIT 10;");

        // A row is a CypherMap
        echo "<ul>";
        foreach ($bookmarks as $result) {
                // Returns a Node
                $bookmark = $result->get('b.url');
                echo "<h4><a>" . $bookmark . "</a></h4>";
                $tags= $result->get('tags');
                
                for ($index=0; $index < count($tags); $index++){
                    echo "<li>" . $tags[$index] . "</li>";
                }
        }
        echo "</ul>";
        ?>

        <hr></hr>
        <a href="/">Home</a>
        <a href="logout.php">Logout</a>
        <a href="addbookmarks.html">Add another bookmark</a>
    </body>

    <footer>
        BDNR Lab 4 @ 2024
    </footer>

</html>
