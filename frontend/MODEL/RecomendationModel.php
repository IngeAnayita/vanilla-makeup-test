<?php
class RecommendationModel {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getPersonalizedRecommendations($user_id) {
        // Obtener datos del usuario
        $user_stmt = $this->db->prepare("SELECT skin_type, occupation, exposure_level FROM users WHERE id = ?");
        $user_stmt->bind_param("i", $user_id);
        $user_stmt->execute();
        $user = $user_stmt->get_result()->fetch_assoc();

        // Consulta para productos recomendados
        $query = "SELECT * FROM products WHERE skin_type = ? AND category IN (";
        
        // Añadir categorías basadas en ocupación y exposición
        $categories = [];
        if (strpos($user['occupation'], 'exterior') !== false || $user['exposure_level'] === 'sol') {
            $categories[] = "'proteccion_solar'";
        }
        if (strpos($user['exposure_level'], 'agua') !== false) {
            $categories[] = "'resistente_agua'";
        }
        if (empty($categories)) {
            $categories = ["'base'", "'labios'", "'ojos'"]; // Categorías por defecto
        }

        $query .= implode(",", $categories) . ") ORDER BY RAND() LIMIT 5";

        $product_stmt = $this->db->prepare($query);
        $product_stmt->bind_param("s", $user['skin_type']);
        $product_stmt->execute();
        return $product_stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}
?>