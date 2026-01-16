<?php
class SkinAnalysisModel {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function saveSkinAnalysis($user_id, $analysis_result) {
        $stmt = $this->db->prepare("INSERT INTO skin_analysis (user_id, analysis_result) VALUES (?, ?)");
        $stmt->bind_param("is", $user_id, $analysis_result);
        return $stmt->execute();
    }

    public function getSkinAnalysisByUser($user_id) {
        $stmt = $this->db->prepare("SELECT * FROM skin_analysis WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}
?>