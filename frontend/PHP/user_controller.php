<?php
require_once 'db_connection.php';
require_once '../MODEL/UserModel.php';

header('Content-Type: application/json');

$action = $_GET['action'];
$userModel = new UserModel($db);

if ($action === 'register') {
    $data = json_decode(file_get_contents('php://input'), true);
    $success = $userModel->registerUser(
        $data['name'],
        $data['email'],
        $data['password'],
        $data['skin_type'],
        $data['occupation'],
        $data['exposure_level'],
    );
    echo json_encode(['success' => $success]);

} elseif ($action === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    $result = $userModel->authenticateUser($data['email'], $data['password']);
    echo json_encode($result);

} elseif ($action === 'getUser') {
    session_start();
    if(isset($_SESSION['user_id'])) {
        $user = $userModel->getUserById($_SESSION['user_id']);
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['success' => false]);
    }
}

$db->close();
?>