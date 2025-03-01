<?php

declare(strict_types=1);

namespace App\Models\Concerns\AlbumMedia;

use App\Models\Album;
use App\Models\Media;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

trait HasRelations
{
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
    public function albumMediaFile(): MorphOne
    {
        return $this->morphOne(Media::class, 'mediaable');
    }
}
