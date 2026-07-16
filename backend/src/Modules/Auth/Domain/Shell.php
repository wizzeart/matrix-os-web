<?php

declare(strict_types=1);

namespace App\Modules\Auth\Domain;

class Shell
{
    private string $id;
    private string $name;
    private string $theme;
    private array $permissions;

    public function __construct(string $id, string $name, string $theme, array $permissions)
    {
        $this->id = $id;
        $this->name = $name;
        $this->theme = $theme;
        $this->permissions = $permissions;
    }

    public static function createDeveloperShell(): self
    {
        return new self('dev_shell', 'Architect', 'matrix-green', ['read', 'write', 'compile']);
    }

    public static function createSecurityShell(): self
    {
        return new self('sec_shell', 'Cypher', 'cyber-red', ['audit', 'penetration', 'read']);
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getTheme(): string
    {
        return $this->theme;
    }
}
