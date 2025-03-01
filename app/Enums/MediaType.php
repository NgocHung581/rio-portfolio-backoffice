<?php

declare(strict_types=1);

namespace App\Enums;

enum MediaType: int
{
    /** @var int Media type: Image. */
    case Image = 1;

    /** @var int Media type: Video. */
    case Video = 2;

    /**
     * Get the label of the media type.
     */
    public function label(): string
    {
        return match ($this) {
            self::Image => __('image'),
            self::Video => __('video'),
        };
    }

    /**
     * Returns an array of all media types.
     */
    public static function toArray(): array
    {
        return array_map(
            fn (self $case): array => ['value' => $case->value, 'label' => $case->label()],
            self::cases()
        );
    }
}
