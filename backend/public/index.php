<?php

declare(strict_types=1);

namespace App;

require __DIR__ . '/../vendor/autoload.php';

header('Content-Type: application/json');

// Respuesta inicial del Sistema Operativo Matrix
$response = [
    'system' => 'Matrix OS',
    'version' => '5.0.2050',
    'status' => 'ONLINE',
    'message' => 'Connection to Motherboard established. Awaiting operator input.',
    'modules_loaded' => [
        'Auth',
        'Terminal',
        'Channels',
        'NeuralLink'
    ]
];

echo json_encode($response, JSON_PRETTY_PRINT);
