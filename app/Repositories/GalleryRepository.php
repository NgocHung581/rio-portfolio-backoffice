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

    /**
     * Update a gallery by ID.
     */
    public function update(int $id, ?string $caption): int
    {
        return Gallery::query()->where('id', $id)->update([
            'caption' => $caption,
        ]);
    }

    /**
     * Bulk delete galleries by IDs.
     */
    public function bulkDelete(array $ids): int
    {
        return Gallery::query()->whereIn('id', $ids)->delete();
    }
}
