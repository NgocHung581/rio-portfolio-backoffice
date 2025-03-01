<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Album extends Model
{
    use SoftDeletes;

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

    /**
     * Get the album's thumbnail.
     */
    public function thumbnail(): MorphOne
    {
        return $this->morphOne(MediaFile::class, 'media_fileable');
    }

    /**
     * Get the album's media items.
     */
    public function mediaItems(): HasMany
    {
        return $this->hasMany(AlbumMediaItem::class);
    }
}
