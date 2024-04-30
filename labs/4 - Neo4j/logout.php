<?php

session_start(); // Start session

// Unset all of the session variables
$_SESSION = array();

// Destroy the session.
session_destroy();

// Redirect user to the login page after logout
header("Location: login.php");
exit(); // Stop further execution

?>