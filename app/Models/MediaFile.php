<?php

declare(strict_types=1);

namespace App\Models;

use Common\App\Models\MediaFile as CommonMediaFile;

class MediaFile extends CommonMediaFile
{
    protected $fillable = [
        'type',
        'file_path',
        'file_name',
        'file_size',
        'media_fileable_id',
        'media_fileable_type',
    ];
}
