<?php

require dirname(__DIR__) . '/vendor/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use App\Modules\Terminal\Infra\Websocket\TerminalSocketController;

$port = 8081;

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new TerminalSocketController()
        )
    ),
    $port
);

echo "========================================\n";
echo "MATRIX OS: Neural Link Active\n";
echo "Listening for WebSocket connections on port {$port}\n";
echo "========================================\n";

$server->run();
