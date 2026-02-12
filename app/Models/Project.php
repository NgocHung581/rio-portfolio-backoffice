<?php

declare(strict_types=1);

namespace App\Models;

use Common\App\Models\Project as CommonProject;

/**
 * The model class for project.
 */
class Project extends CommonProject
{
    protected $fillable = [
        'category_id',
        'title_en',
        'title_vi',
        'description_en',
        'description_vi',
        'summary_en',
        'summary_vi',
        'is_highlight',
        'thumbnail_file_path',
        'thumbnail_frame',
        'web_visibility',
    ];
}
