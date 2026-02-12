<?php

declare(strict_types=1);

namespace App\Models;

use Common\App\Models\Category as CommonCategory;

/**
 * The model class for the category.
 */
class Category extends CommonCategory
{
    protected $fillable = [
        'name_en',
        'name_vi',
        'media_type',
        'slug',
    ];
}
