<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\MediaItem;
use Common\App\Enums\MediaFrame;
use Common\App\Repositories\MediaItemRepository as CommonMediaItemRepository;

/**
 * The repository class for the media item.
 */
class MediaItemRepository extends CommonMediaItemRepository
{
    /**
     * Create a new media item.
     */
    public function create(int $galleryId, string $filePath, MediaFrame $frame, bool $isBanner): MediaItem
    {
        return MediaItem::query()->create([
            'gallery_id' => $galleryId,
            'file_path' => $filePath,
            'frame' => $frame,
            'is_banner' => $isBanner,
        ]);
    }

    /**
     * Update a media item by ID.
     */
    public function update(int $id, MediaFrame $frame, bool $isBanner): int
    {
        return MediaItem::query()->where('id', $id)->update([
            'frame' => $frame,
            'is_banner' => $isBanner,
        ]);
    }

    /**
     * Bulk delete media items by IDs.
     */
    public function bulkDelete(array $ids): int
    {
        return MediaItem::query()->whereIn('id', $ids)->delete();
    }
}
