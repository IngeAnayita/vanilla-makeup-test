<?php
class UserModel {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function registerUser($name, $email, $password, $skin_type, $occupation, $exposure_level) {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->db->prepare("INSERT INTO users (name, email, password, skin_type, occupation, exposure_level) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $name, $email, $hashed_password, $skin_type, $occupation, $exposure_level);
        return $stmt->execute();
    }

    public function authenticateUser($email, $password) {
        $stmt = $this->db->prepare("SELECT id, password, name, email, skin_type, occupation, exposure_level FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($result->num_rows === 0) {
            return ['success' => false, 'error' => 'Usuario no encontrado'];
        }
        
        $user = $result->fetch_assoc();
        
        if(password_verify($password, $user['password'])) {
            return [
                'success' => true,
                'user_id' => $user['id'],
                'user_name' => $user['name'],
                'email' => $user['email'],
                'skin_type' => $user['skin_type'],
                'occupation' => $user['occupation'],
                'exposure_level' => $user['exposure_level'],
            ];
        } else {
            return ['success' => false, 'error' => 'Contraseña incorrecta'];
        }
    }

    public function getUserById($user_id) {
        $stmt = $this->db->prepare("SELECT name, email, skin_type, occupation, exposure_level FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }
}
?>