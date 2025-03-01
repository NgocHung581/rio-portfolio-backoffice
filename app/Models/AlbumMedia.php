<?php

declare(strict_types=1);

namespace App\Models;

use App\Models\Concerns\AlbumMedia\HasRelations;
use Illuminate\Database\Eloquent\Model;

class AlbumMedia extends Model
{
    use HasRelations;

    protected $table = 'album_media';

    protected $primaryKey = 'id';

    protected $fillable = [
        'album_id',
        'column_span',
        'is_displayed_on_banner',
    ];

    protected $casts = [
        'is_displayed_on_banner' => 'boolean',
    ];
}
