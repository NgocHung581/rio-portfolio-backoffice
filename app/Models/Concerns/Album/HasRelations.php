<?php

declare(strict_types=1);

namespace App\Models\Concerns\Album;

use App\Models\AlbumMedia;
use App\Models\Media;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

trait HasRelations
{
    /**
     * Get the album's thumbnail.
     */
    public function thumbnail(): MorphOne
    {
        return $this->morphOne(Media::class, 'mediaable');
    }

    /**
     * Get the album's media.
     */
    public function media(): HasMany
    {
        return $this->hasMany(AlbumMedia::class);
    }
}
