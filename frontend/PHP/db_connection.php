<?php
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "vanilla_makeup";

$db = new mysqli($servername, $username, $password, $dbname);
/*
if ($db->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Connection failed: ' . $db->connect_error]));
} else {
    echo json_encode(['success' => true, 'message' => 'Connected successfully!']);
}
   */ 
?>