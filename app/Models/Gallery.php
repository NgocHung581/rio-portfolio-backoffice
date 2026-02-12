<?php

declare(strict_types=1);

namespace App\Models;

use Common\App\Models\Gallery as CommonGallery;

/**
 * The model class for gallery.
 */
class Gallery extends CommonGallery
{
    protected $fillable = [
        'project_id',
        'caption',
    ];
}
