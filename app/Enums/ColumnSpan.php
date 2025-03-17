<?php

declare(strict_types=1);

namespace App\Enums;

use Common\App\Traits\EnumHelper;

enum ColumnSpan: int
{
    use EnumHelper;

    /** @var int The item will be displayed on 4 columns according to the grid layout (12 columns). */
    case FourColumns = 4;

    /** @var int The item will be displayed on 6 columns according to the grid layout (12 columns). */
    case SixColumns = 6;

    /** @var int The item will be displayed on 8 columns according to the grid layout (12 columns). */
    case EightColumns = 8;

    /** @var int The item will be displayed on 12 columns according to the grid layout (12 columns). */
    case TwelveColumns = 12;

    /**
     * Get the label of the item column span.
     */
    public function label(): string
    {
        return match ($this) {
            self::FourColumns => __('takes_up_one_third_row_length'),
            self::SixColumns => __('takes_up_one_half_row_length'),
            self::EightColumns => __('takes_up_two_third_row_length'),
            self::TwelveColumns => __('takes_up_full_row_length'),
        };
    }
}
