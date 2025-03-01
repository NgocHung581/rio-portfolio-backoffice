<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class AlbumMediaItem extends Model
{
    protected $table = 'album_media_items';

    protected $primaryKey = 'id';

    protected $fillable = [
        'album_id',
        'column_span',
        'is_displayed_on_banner',
    ];

    protected $casts = [
        'is_displayed_on_banner' => 'boolean',
    ];

    /**
     * Get the media's album.
     */
    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }

    /**
     * Get the media's file.
     */
    public function mediaFile(): MorphOne
    {
        return $this->morphOne(MediaFile::class, 'media_fileable');
    }
}
