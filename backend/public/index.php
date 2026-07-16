<?php

declare(strict_types=1);

namespace App;

require __DIR__ . '/../vendor/autoload.php';

use App\Core\Container;
use App\Core\Router;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Inicializar Contenedor
$container = Container::build();

// Inicializar Router
$router = new Router();

// Extraer info request
$httpMethod = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// Ejecutar
$router->dispatch($httpMethod, $uri, $container);
