<?php

declare(strict_types=1);

namespace App\Modules\Channel\Domain;

class SnippetAnnotation
{
    private string $authorId;
    private int $lineNumber;
    private string $comment;
    private \DateTimeImmutable $createdAt;

    public function __construct(string $authorId, int $lineNumber, string $comment)
    {
        $this->authorId = $authorId;
        $this->lineNumber = $lineNumber;
        $this->comment = $comment;
        $this->createdAt = new \DateTimeImmutable();
    }
}
