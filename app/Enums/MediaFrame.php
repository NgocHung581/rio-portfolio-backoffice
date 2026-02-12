<?php

declare(strict_types=1);

namespace App\Enums;

use Common\App\Traits\EnumHelper;

/**
 * The enum class for media frame.
 */
enum MediaFrame: string
{
    use EnumHelper;

    /** @var string Media frame: 1:1. */
    case ONE_ONE = '1/1';

    /** @var string Media frame: 4:5. */
    case FOUR_FIVE = '4/5';

    /** @var string Media frame: 9:16. */
    case NINE_SIXTEEN = '9/16';

    /** @var string Media frame: 16:9. */
    case SIXTEEN_NINE = '16/9';

    /**
     * Get the label of the case.
     */
    public function label(): string
    {
        return match ($this) {
            self::ONE_ONE => '1:1',
            self::FOUR_FIVE => '4:5',
            self::NINE_SIXTEEN => '9:16',
            self::SIXTEEN_NINE => '16:9',
        };
    }
}
