<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\AlbumMediaItem;
use Illuminate\Database\Eloquent\Collection;

class AlbumMediaItemRepository
{
    /**
     * Find album media items by IDs.
     */
    public function findByIds(array $ids, array $relations = []): Collection
    {
        return AlbumMediaItem::with($relations)->whereIn('id', $ids)->get();
    }

    /**
     * Create a new album media item.
     */
    public function create(
        int $albumId,
        int $columnSpan,
        bool $isDisplayedOnBanner
    ): AlbumMediaItem {
        return AlbumMediaItem::query()->create([
            'album_id' => $albumId,
            'column_span' => $columnSpan,
            'is_displayed_on_banner' => $isDisplayedOnBanner,
        ]);
    }

    /**
     * Update an album media item.
     */
    public function update(int $id, int $columnSpan, bool $isDisplayedOnBanner): bool
    {
        $updatedCount = AlbumMediaItem::query()->where('id', $id)->update([
            'column_span' => $columnSpan,
            'is_displayed_on_banner' => $isDisplayedOnBanner,
        ]);

        return $updatedCount === 1;
    }

    /**
     * Destroy an album media item by ID.
     */
    public function destroyById(int $id): bool
    {
        $deletedCount = AlbumMediaItem::query()->where('id', $id)->delete();

        return $deletedCount === 1;
    }

    /**
     * Bulk destroy album media items by IDs.
     */
    public function bulkDestroyByIds(array $ids): bool
    {
        $deletedCount = AlbumMediaItem::query()->whereIn('id', $ids)->delete();

        return $deletedCount === count($ids);
    }
}
