<?php

declare(strict_types=1);

namespace App\Modules\Channel\Domain;

class CodeSnippet
{
    private string $id;
    private string $channelId;
    private string $authorId;
    private string $language;
    private string $code;
    private array $annotations = [];

    public function __construct(string $id, string $channelId, string $authorId, string $language, string $code)
    {
        $this->id = $id;
        $this->channelId = $channelId;
        $this->authorId = $authorId;
        $this->language = $language;
        $this->code = $code;
    }

    public function addAnnotation(SnippetAnnotation $annotation): void
    {
        $this->annotations[] = $annotation;
    }
    
    public function getAnnotations(): array
    {
        return $this->annotations;
    }
}
