<?php
require_once 'db_connection.php';

$action = $_GET['action'];

if ($action === 'sendMessage') {
    $data = json_decode(file_get_contents('php://input'), true);
    $message = $data['message'];

    // Aquí puedes integrar un servicio de NLP como Dialogflow o un chatbot simple
    $response = "Gracias por tu mensaje: " . $message;

    echo json_encode(['response' => $response]);
}
?>