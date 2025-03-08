<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\MediaFile;
use Common\App\Repositories\MediaFileRepository as CommonMediaFileRepository;

class MediaFileRepository extends CommonMediaFileRepository
{
    /**
     * Bulk destroy media files by IDs.
     */
    public function bulkDestroyByIds(array $ids): bool
    {
        $deletedCount = MediaFile::query()->whereIn('id', $ids)->delete();

        return $deletedCount === count($ids);
    }
}
