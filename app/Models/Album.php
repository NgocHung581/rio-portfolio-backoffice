<?php

declare(strict_types=1);

namespace App\Models;

use Common\App\Models\Album as CommonAlbum;

class Album extends CommonAlbum
{
    protected $fillable = [
        'name_en',
        'name_vi',
        'title_en',
        'title_vi',
        'description_en',
        'description_vi',
        'summary_en',
        'summary_vi',
        'thumbnail_url',
        'is_highlight',
    ];
}
