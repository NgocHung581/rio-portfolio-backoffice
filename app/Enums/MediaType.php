<?php

declare(strict_types=1);

namespace App\Enums;

enum MediaType: int
{
    /** @var int Media type: Thumbnail. */
    case Thumbnail = 1;

    /** @var int Media type: Image. */
    case Image = 2;

    /** @var int Media type: Video. */
    case Video = 3;

    /**
     * Get the label of the file type.
     */
    public function label(): string
    {
        return match ($this) {
            self::Thumbnail => __('thumbnail'),
            self::Image => __('image'),
            self::Video => __('video'),
        };
    }

    /**
     * Get an array of file types, excluding the thumbnail, where the key is the lower-cased name of the type
     * and the value is the value of the type.
     */
    public static function toFileTypeArray(): array
    {
        $array = [];

        foreach (self::cases() as $case) {
            if ($case !== self::Thumbnail) {
                $array[strtolower($case->name)] = $case->value;
            }
        }

        return $array;
    }

    /**
     * Returns an array of file type options, excluding the thumbnail.
     */
    public static function toFileTypeOptions(): array
    {
        $options = [];

        foreach (self::cases() as $case) {
            if ($case !== self::Thumbnail) {
                $options[] = ['value' => $case->value, 'label' => $case->label()];
            }
        }

        return $options;
    }
}
