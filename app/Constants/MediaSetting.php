<?php

declare(strict_types=1);

namespace App\Constants;

/**
 * The constant class for media setting.
 */
class MediaSetting
{
    /** @var string[] Valid image types. */
    public const VALID_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'webp'];

    /** @var string Max image size. */
    public const MAX_IMAGE_SIZE_STRING = '30mb';

    /** @var string[] Valid video mime types. */
    public const VALID_VIDEO_MIME_TYPES = ['video/mov', 'video/gif'];

    /** @var string Max video size (2GB). */
    public const MAX_VIDEO_SIZE_NUMBER = 2097152;

    /** @var int Max media count per gallery. */
    public const MAX_MEDIA_COUNT_PER_GALLERY = 5;
}
