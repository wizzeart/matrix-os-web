<?php

declare(strict_types=1);

namespace App\Modules\Channel\Application;

use App\Modules\Channel\Domain\CodeSnippet;
use App\Modules\Channel\Domain\SnippetAnnotation;

class AnnotateSnippetCommand
{
    private string $snippetId;
    private string $operatorId;
    private int $lineNumber;
    private string $note;

    public function __construct(string $snippetId, string $operatorId, int $lineNumber, string $note)
    {
        $this->snippetId = $snippetId;
        $this->operatorId = $operatorId;
        $this->lineNumber = $lineNumber;
        $this->note = $note;
    }

    public function execute(): void
    {
        // 1. Cargar el Snippet desde el Repository
        // 2. Crear anotación
        $annotation = new SnippetAnnotation($this->operatorId, $this->lineNumber, $this->note);
        
        // 3. Agregarla al Snippet
        // $snippet->addAnnotation($annotation);
        
        // 4. Guardar Snippet
        
        // 5. Emitir evento de dominio (Domain Event) "SnippetAnnotated" 
        // a RabbitMQ / Redis PubSub para que WebSockets lo dibuje
    }
}
