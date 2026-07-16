<?php

$host = 'mariadb';
$db   = 'matrix_os';
$user = 'matrix';
$pass = 'matrix_password';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    
    echo "Connected to MariaDB successfully.\n";

    $sqlChannels = "
    CREATE TABLE IF NOT EXISTS channels (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        is_public BOOLEAN DEFAULT TRUE,
        password_hash VARCHAR(255) DEFAULT NULL,
        ai_linked BOOLEAN DEFAULT FALSE,
        ai_provider VARCHAR(50) DEFAULT NULL,
        ai_api_key VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";

    $pdo->exec($sqlChannels);
    echo "Table 'channels' created or already exists.\n";

    $sqlMessages = "
    CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        channel_id INT NOT NULL,
        sender VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        is_ai BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";

    $pdo->exec($sqlMessages);
    echo "Table 'messages' created or already exists.\n";

    // Insert default public channels
    $stmt = $pdo->prepare("INSERT IGNORE INTO channels (name, is_public) VALUES (:name, :pub)");
    $stmt->execute(['name' => 'nexus', 'pub' => true]);
    $stmt->execute(['name' => 'php-arch', 'pub' => true]);
    $stmt->execute(['name' => 'red-team', 'pub' => true]);
    
    // Insert a protected channel
    $stmt = $pdo->prepare("INSERT IGNORE INTO channels (name, is_public, password_hash) VALUES (:name, :pub, :pass)");
    $stmt->execute(['name' => 'mainframe', 'pub' => true, 'pass' => password_hash('1234', PASSWORD_DEFAULT)]);

    echo "Default channels seeded.\n";

} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
