<?php

declare(strict_types=1);

namespace App\Modules\Channel\Infra\RabbitMQ;

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class MatrixCentralWorker
{
    public function consume()
    {
        $host = getenv('RABBITMQ_HOST') ?: 'rabbitmq';
        $port = 5672;
        $user = getenv('RABBITMQ_USER') ?: 'matrix';
        $pass = getenv('RABBITMQ_PASS') ?: 'matrix_password';

        try {
            $connection = new AMQPStreamConnection($host, $port, $user, $pass);
            $channel = $connection->channel();

            $queue_name = 'image_processing_queue';
            $lab_queue = 'lab_deployment_queue';
            
            $channel->queue_declare($queue_name, false, true, false, false);
            $channel->queue_declare($lab_queue, false, true, false, false);

            echo " [*] Matrix Central Worker Online. Awaiting quantum payloads. To exit press CTRL+C\n";

            $callback = function ($msg) {
                echo ' [x] Received payload: ', $msg->body, "\n";
                $data = json_decode($msg->body, true);
                
                // Simular el procesamiento a Ascii, Binario y Matrix Mode
                echo " [.] Extracting quantum pixels...\n";
                sleep(1);
                echo " [.] Generating ASCII Mapping...\n";
                sleep(1);
                echo " [.] Compiling Hexadecimal View...\n";
                
                echo " [✓] Image [{$data['filename']}] successfully converted to all Matrix dimensions.\n";
                
                $msg->ack();
            };

            $labCallback = function ($msg) {
                echo ' [x] Received Lab Deployment Request: ', $msg->body, "\n";
                $data = json_decode($msg->body, true);
                
                echo " [.] Spinning up Ephemeral Sandbox container...\n";
                sleep(2);
                echo " [.] Compiling payload in secure environment...\n";
                sleep(1);
                
                echo " [✓] Execution complete for Node [{$data['targetNode']}]. Output transmitted.\n";
                $msg->ack();
            };

            $channel->basic_qos(null, 1, null);
            $channel->basic_consume($queue_name, '', false, false, false, false, $callback);
            $channel->basic_consume($lab_queue, '', false, false, false, false, $labCallback);

            while ($channel->is_open()) {
                $channel->wait();
            }

            $channel->close();
            $connection->close();
        } catch (\Exception $e) {
            echo "RabbitMQ Connection Failed. Is the motherboard online? Error: " . $e->getMessage() . "\n";
        }
    }
}
