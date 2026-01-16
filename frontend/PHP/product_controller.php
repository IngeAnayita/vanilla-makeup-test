<?php
require_once 'db_connection.php';
require_once '../MODEL/ProductModel.php';

$action = $_GET['action'];
$productModel = new ProductModel($db);

if ($action === 'getProducts') {
    $skin_type = $_GET['skin_type']; // Puedes obtener esto de la sesión del usuario
    $products = $productModel->getProductsBySkinType($skin_type);
    echo json_encode($products);
}
?>