<?php

declare(strict_types=1);

namespace App\Enums;

enum MediaType: int
{
    case Image = 1;

    case Video = 2;
}
