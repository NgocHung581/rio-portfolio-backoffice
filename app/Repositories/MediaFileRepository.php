<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\MediaFile;

class MediaFileRepository
{
    /**
     * Bulk destroy media by IDs.
     */
    public function bulkDestroyByIds(array $ids): bool
    {
        $deletedCount = MediaFile::query()->whereIn('id', $ids)->delete();

        return $deletedCount === count($ids);
    }
}
