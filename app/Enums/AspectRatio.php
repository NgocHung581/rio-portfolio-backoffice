<?php

declare(strict_types=1);

namespace App\Enums;

use Common\App\Traits\EnumHelper;

enum AspectRatio: string
{
    use EnumHelper;

    /** @var string Aspect ratio: 4/5 */
    case FOUR_FIVE = '4/5';

    /** @var string Aspect ratio: 16/9 */
    case SIXTEEN_NINE = '16/9';

    /**
     * Get the label of the aspect ratio.
     */
    public function label(): string
    {
        return match ($this) {
            self::FOUR_FIVE => '4:5',
            self::SIXTEEN_NINE => '16:9',
        };
    }
}
