<?php

declare(strict_types=1);

namespace App\Core;

use FastRoute\Dispatcher;
use FastRoute\RouteCollector;
use Psr\Container\ContainerInterface;
use function FastRoute\simpleDispatcher;

class Router
{
    private Dispatcher $dispatcher;

    public function __construct()
    {
        $this->dispatcher = simpleDispatcher(function(RouteCollector $r) {
            // Rutas base
            $r->addRoute('GET', '/api/status', ['App\Modules\Terminal\Infra\Http\StatusController', 'handle']);
            // Se irán añadiendo más rutas aquí...
        });
    }

    public function dispatch(string $httpMethod, string $uri, ContainerInterface $container): void
    {
        // Strip query string (?foo=bar) and decode URI
        if (false !== $pos = strpos($uri, '?')) {
            $uri = substr($uri, 0, $pos);
        }
        $uri = rawurldecode($uri);

        $routeInfo = $this->dispatcher->dispatch($httpMethod, $uri);

        switch ($routeInfo[0]) {
            case Dispatcher::NOT_FOUND:
                http_response_code(404);
                echo json_encode(['error' => 'Terminal Endpoint Not Found']);
                break;
            case Dispatcher::METHOD_NOT_ALLOWED:
                $allowedMethods = $routeInfo[1];
                http_response_code(405);
                echo json_encode(['error' => 'Method Not Allowed']);
                break;
            case Dispatcher::FOUND:
                $handler = $routeInfo[1];
                $vars = $routeInfo[2];
                
                // Instanciar controlador usando el contenedor de DI
                $controllerName = $handler[0];
                $methodName = $handler[1];
                
                $controller = $container->get($controllerName);
                $response = $controller->$methodName($vars);
                
                header('Content-Type: application/json');
                echo json_encode($response);
                break;
        }
    }
}
