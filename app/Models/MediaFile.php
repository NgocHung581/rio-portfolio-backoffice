<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class MediaFile extends Model
{
    protected $table = 'media_files';

    protected $primaryKey = 'id';

    protected $fillable = [
        'file_type',
        'file_path',
        'file_name',
        'file_size',
        'media_fileable_id',
        'media_fileable_type',
    ];

    /**
    * Get the parent model.
    */
    public function mediaFileable(): MorphTo
    {
        return $this->morphTo();
    }
}
