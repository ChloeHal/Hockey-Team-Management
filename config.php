<?php
// Connexion MySQL - A remplir avec les identifiants Hostinger
// hPanel > Bases de donnees > creer une base, puis copier les infos ici

$db_host = 'localhost';
$db_name = 'u103504870_panthers';  // nom de la base de donnees
$db_user = 'u103504870_panthers';  // nom d'utilisateur
$db_pass = 'g?9WVrbCh0Q';  // mot de passe

try {
    $pdo = new PDO(
        "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4",
        $db_user,
        $db_pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Connexion base de donnees echouee']);
    exit;
}
