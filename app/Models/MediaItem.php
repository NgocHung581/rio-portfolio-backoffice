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
        'file_path',
        'frame',
        'is_banner',
    ];
}
