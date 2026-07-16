<?php

declare(strict_types=1);

namespace App\Modules\Channel\Application;

class DeployEphemeralLabCommand
{
    private string $operatorId;
    private string $targetNode;
    private string $codePayload;

    public function __construct(string $operatorId, string $targetNode, string $codePayload)
    {
        $this->operatorId = $operatorId;
        $this->targetNode = $targetNode;
        $this->codePayload = $codePayload;
    }

    public function execute(): array
    {
        // En producción, esto publicaría un mensaje en RabbitMQ
        // para que un worker instancie un contenedor Docker aislado, 
        // compile $this->codePayload y devuelva el resultado.
        
        return [
            'status' => 'queued',
            'jobId' => uniqid('lab_', true),
            'message' => "Deployment initiated at node {$this->targetNode}"
        ];
    }
}
