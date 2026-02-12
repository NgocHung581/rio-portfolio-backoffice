<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Gallery;
use Common\App\Repositories\GalleryRepository as CommonGalleryRepository;

/**
 * The repository class for the gallery.
 */
class GalleryRepository extends CommonGalleryRepository
{
    /**
     * Create a new gallery.
     */
    public function create(int $projectId, ?string $caption): Gallery
    {
        return Gallery::query()->create([
            'project_id' => $projectId,
            'caption' => $caption,
        ]);
    }
}
