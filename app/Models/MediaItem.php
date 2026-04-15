<?php

declare(strict_types=1);

namespace App\Models;

use Common\App\Models\MediaItem as CommonMediaItem;

/**
 * The model class for media item.
 */
class MediaItem extends CommonMediaItem
{
    protected $fillable = [
        'gallery_id',
        'file_id',
        'file_name',
        'file_mime_type',
        'frame',
        'is_banner',
    ];
}
