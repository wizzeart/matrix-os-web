<?php

declare(strict_types=1);

namespace App\Modules\Terminal\Infra\Websocket;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use App\Core\Database;
use PDO;

class TerminalSocketController implements MessageComponentInterface
{
    protected \SplObjectStorage $clients;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn)
    {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";

        // Manda el banner inicial
        $conn->send(json_encode([
            'type' => 'system',
            'message' => 'Secure WebSocket Link Established.'
        ]));
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $data = json_decode($msg, true);
        if (!$data || !isset($data['action'])) {
            // Backward compatibility
            $data = ['action' => 'broadcast', 'command' => $data['command'] ?? $msg];
        }

        $pdo = Database::getConnection();

        switch ($data['action']) {
            case 'say':
                $channelName = $data['channel'] ?? 'nexus';
                $message = $data['message'] ?? '';
                
                // Get channel ID
                $stmt = $pdo->prepare("SELECT id, ai_linked FROM channels WHERE name = :name");
                $stmt->execute(['name' => $channelName]);
                $channel = $stmt->fetch();

                if ($channel) {
                    // Guardar mensaje
                    $ins = $pdo->prepare("INSERT INTO messages (channel_id, sender, content) VALUES (:cid, :sender, :content)");
                    $ins->execute([
                        'cid' => $channel['id'],
                        'sender' => 'operator_' . $from->resourceId,
                        'content' => $message
                    ]);

                    // Broadcast a todos
                    $this->broadcast([
                        'type' => 'chat',
                        'channel' => $channelName,
                        'sender' => 'operator_' . $from->resourceId,
                        'message' => $message
                    ]);

                    if ($channel['ai_linked']) {
                        // TODO: Fire event to RabbitMQ for AI
                        $this->broadcast([
                            'type' => 'chat',
                            'channel' => $channelName,
                            'sender' => 'SYSTEM_AI',
                            'message' => 'Processing AI response...'
                        ]);
                    }
                } else {
                    $from->send(json_encode(['type' => 'error', 'message' => 'Channel not found.']));
                }
                break;
                
            case 'create-channel':
                $name = $data['name'];
                $isPublic = $data['is_public'] ?? true;
                $password = $data['password'] ?? null;
                $passHash = $password ? password_hash($password, PASSWORD_DEFAULT) : null;
                $aiKey = $data['ai_key'] ?? null;
                
                try {
                    $stmt = $pdo->prepare("INSERT INTO channels (name, is_public, password_hash, ai_linked, ai_api_key) VALUES (:name, :pub, :pass, :ai, :key)");
                    $stmt->execute([
                        'name' => $name,
                        'pub' => $isPublic,
                        'pass' => $passHash,
                        'ai' => $aiKey ? 1 : 0,
                        'key' => $aiKey
                    ]);
                    
                    $this->broadcast([
                        'type' => 'system',
                        'message' => "New channel created: $name"
                    ]);
                } catch (\Exception $e) {
                    $from->send(json_encode(['type' => 'error', 'message' => 'Channel creation failed.']));
                }
                break;
                
            case 'get-channels':
                $stmt = $pdo->query("SELECT name, is_public, password_hash, ai_linked FROM channels WHERE is_public = 1");
                $channels = $stmt->fetchAll();
                
                $from->send(json_encode([
                    'type' => 'channel-list',
                    'channels' => $channels
                ]));
                break;
                
            case 'exec-php':
                $code = $data['code'] ?? '';
                // Crear un archivo temporal
                $tmpFile = tempnam(sys_get_temp_dir(), 'matrix_lab_');
                file_put_contents($tmpFile, $code);
                
                // Ejecutar de forma segura con timeout (básico)
                $output = shell_exec('php ' . escapeshellarg($tmpFile) . ' 2>&1');
                
                unlink($tmpFile); // Limpiar
                
                $from->send(json_encode([
                    'type' => 'lab-result',
                    'output' => $output
                ]));
                break;

            case 'broadcast':
            default:
                foreach ($this->clients as $client) {
                    if ($from !== $client) {
                        $client->send(json_encode([
                            'type' => 'broadcast',
                            'from' => 'operator_' . $from->resourceId,
                            'command' => $data['command'] ?? ''
                        ]));
                    }
                }
                break;
        }
    }

    private function broadcast(array $payload)
    {
        $encoded = json_encode($payload);
        foreach ($this->clients as $client) {
            $client->send($encoded);
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }
}
