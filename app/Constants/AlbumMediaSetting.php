<?php

declare(strict_types=1);

namespace App\Constants;

class AlbumMediaSetting
{
    /** @var int The maximum number of images that can be uploaded at once */
    public const IMAGES_COUNT_LIMIT_PER_UPLOAD = 10;

    /** @var int The maximum number of videos that can be uploaded at once */
    public const VIDEOS_COUNT_LIMIT_PER_UPLOAD = 1;
}
