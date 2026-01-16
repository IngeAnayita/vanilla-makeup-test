<?php
require_once 'db_connection.php';
require_once '../MODEL/RecommendationModel.php';

header('Content-Type: application/json');

$action = $_GET['action'];
$recommendationModel = new RecommendationModel($db);

if ($action === 'getRecommendations') {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Usuario no autenticado']);
        exit;
    }
    $recommendations = $recommendationModel->getPersonalizedRecommendations($_SESSION['user_id']);
    echo json_encode($recommendations);
}
?>