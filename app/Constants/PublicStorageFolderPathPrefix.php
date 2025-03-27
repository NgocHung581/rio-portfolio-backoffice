<?php

declare(strict_types=1);

namespace App\Constants;

class PublicStorageFolderPathPrefix
{
    /** @var string The path prefix for storing album media files */
    public const ALBUM_MEDIA = 'albums/album_';

    /** @var string The path prefix for storing partner logo files */
    public const PARTNER_LOGOS = 'partners';
}
