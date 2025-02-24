<?php

declare(strict_types=1);

namespace App\Models\Concerns\Media;

use Illuminate\Database\Eloquent\Relations\MorphTo;

trait HasRelations
{
    /**
    * Get the parent model.
    */
    public function mediaable(): MorphTo
    {
        return $this->morphTo();
    }
}
