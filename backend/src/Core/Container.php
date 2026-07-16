<?php

declare(strict_types=1);

namespace App\Core;

use DI\ContainerBuilder;
use Psr\Container\ContainerInterface;
use Predis\Client as RedisClient;

class Container
{
    public static function build(): ContainerInterface
    {
        $builder = new ContainerBuilder();
        
        $builder->addDefinitions([
            // Database Connection (PDO)
            \PDO::class => function () {
                $host = getenv('DB_HOST') ?: 'mariadb';
                $db   = getenv('DB_NAME') ?: 'matrix_os';
                $user = getenv('DB_USER') ?: 'matrix';
                $pass = getenv('DB_PASS') ?: 'matrix_password';
                
                $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
                $options = [
                    \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
                    \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
                    \PDO::ATTR_EMULATE_PREPARES   => false,
                ];
                
                return new \PDO($dsn, $user, $pass, $options);
            },
            
            // Redis Client
            RedisClient::class => function () {
                return new RedisClient([
                    'scheme' => 'tcp',
                    'host'   => getenv('REDIS_HOST') ?: 'redis',
                    'port'   => 6379,
                ]);
            },
        ]);
        
        return $builder->build();
    }
}
