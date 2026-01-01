<?php

declare(strict_types=1);

namespace App\Enums;

use Common\App\Traits\EnumHelper;

/**
 * The enum class for per page.
 */
enum PerPage: int
{
    use EnumHelper;

    /** @var int Per page: 10. */
    case Ten = 10;

    /** @var int Per page: 20. */
    case Twenty = 20;

    /** @var int Per page: 50. */
    case Fifty = 50;

    /**
     * Get the label of the case.
     */
    public function label(): string
    {
        return match ($this) {
            self::Ten => '10',
            self::Twenty => '20',
            self::Fifty => '50',
        };
    }

    /**
     * Resolve the given value to an enum case.
     * If the given value is not a valid integer, the default value will be returned.
     */
    public static function resolve(mixed $value): self
    {
        $filteredValue = filter_var($value, FILTER_VALIDATE_INT, FILTER_NULL_ON_FAILURE);

        return isset($filteredValue) ? (self::tryFrom($filteredValue) ?? self::Ten) : self::Ten;
    }
}
