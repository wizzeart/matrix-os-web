<?php

declare(strict_types=1);

namespace App\Modules\Auth\Application;

use App\Modules\Auth\Domain\Shell;

class SwitchShellCommand
{
    private string $operatorId;
    private string $targetShellType;

    public function __construct(string $operatorId, string $targetShellType)
    {
        $this->operatorId = $operatorId;
        $this->targetShellType = $targetShellType;
    }

    public function execute(): Shell
    {
        // En un caso real, esto actualizaría la DB/Redis del usuario
        // Para la prueba, devolvemos la simulación
        if ($this->targetShellType === 'security') {
            return Shell::createSecurityShell();
        }

        return Shell::createDeveloperShell();
    }
}
