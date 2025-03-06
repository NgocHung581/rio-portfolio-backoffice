<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class AboutPageInformation extends Model
{
    protected $table = 'about_page_information';

    protected $primaryKey = 'id';

    protected $fillable = [
        'description',
    ];

    /**
     * Get the partner logos for the about page information.
     */
    public function partnerLogos(): MorphMany
    {
        return $this->morphMany(MediaFile::class, 'media_fileable');
    }
}
