<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\MediaItem;
use Common\App\Repositories\MediaItemRepository as CommonMediaItemRepository;

/**
 * The repository class for the media item.
 */
class MediaItemRepository extends CommonMediaItemRepository
{
    /**
     * Create a new media item.
     */
    public function create(int $galleryId, string $filePath, string $frame, bool $isBanner): MediaItem
    {
        return MediaItem::query()->create([
            'gallery_id' => $galleryId,
            'file_path' => $filePath,
            'frame' => $frame,
            'is_banner' => $isBanner,
        ]);
    }
}
