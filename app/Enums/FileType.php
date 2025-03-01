<?php

declare(strict_types=1);

namespace App\Enums;

enum FileType: int
{
    /** @var int File type: Image. */
    case Image = 1;

    /** @var int File type: Video. */
    case Video = 2;

    /**
     * Get the label of the file type.
     */
    public function label(): string
    {
        return match ($this) {
            self::Image => __('image'),
            self::Video => __('video'),
        };
    }

    /**
     * Returns an array of all file types.
     */
    public static function toArray(): array
    {
        return array_map(
            fn(self $case): array => ['value' => $case->value, 'label' => $case->label()],
            self::cases()
        );
    }
}
