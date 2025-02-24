<?php

declare(strict_types=1);

namespace App\Models;

use App\Models\Concerns\Album\HasRelations;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Album extends Model
{
    use SoftDeletes;
    use HasRelations;

    protected $table = 'albums';

    protected $primaryKey = 'id';

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

    protected $casts = [
        'is_highlight' => 'boolean',
    ];
}
