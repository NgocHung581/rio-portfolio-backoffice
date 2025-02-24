<?php

declare(strict_types=1);

namespace App\Models\Concerns\Album;

use App\Models\Media;
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
}
