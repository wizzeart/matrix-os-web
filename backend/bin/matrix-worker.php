<?php

require dirname(__DIR__) . '/vendor/autoload.php';

use App\Modules\Channel\Infra\RabbitMQ\MatrixCentralWorker;

echo "========================================\n";
echo "MATRIX OS: Background Worker Initialization\n";
echo "========================================\n";

$worker = new MatrixCentralWorker();
$worker->consume();
