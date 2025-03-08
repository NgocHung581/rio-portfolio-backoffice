<?php

declare(strict_types=1);

namespace App\Models;

use Common\App\Models\AlbumMediaItem as CommonAlbumMediaItem;

class AlbumMediaItem extends CommonAlbumMediaItem
{
    protected $fillable = [
        'album_id',
        'column_span',
        'is_displayed_on_banner',
    ];
}
