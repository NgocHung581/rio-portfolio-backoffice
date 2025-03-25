<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Album;
use Common\App\Repositories\AlbumRepository as CommonAlbumRepository;
use Illuminate\Support\Str;

class AlbumRepository extends CommonAlbumRepository
{
    /**
     * Create a new album.
     */
    public function create(
        string $titleEn,
        string $titleVi,
        string $nameEn,
        string $nameVi,
        string $descriptionEn,
        string $descriptionVi,
        string $summaryEn,
        string $summaryVi,
        bool $isHighlight
    ): Album {
        $album = Album::query()->create([
            'title_en' => $titleEn,
            'title_vi' => $titleVi,
            'name_en' => $nameEn,
            'name_vi' => $nameVi,
            'description_en' => $descriptionEn,
            'description_vi' => $descriptionVi,
            'summary_en' => $summaryEn,
            'summary_vi' => $summaryVi,
            'slug' => Str::slug($nameEn),
            'is_highlight' => $isHighlight,
        ]);

        return $album;
    }

    /**
     * Update the album.
     */
    public function update(
        int $id,
        string $titleEn,
        string $titleVi,
        string $nameEn,
        string $nameVi,
        string $descriptionEn,
        string $descriptionVi,
        string $summaryEn,
        string $summaryVi,
        bool $isHighlight
    ): bool {
        $updatedCount = Album::query()->where('id', $id)->update([
            'title_en' => $titleEn,
            'title_vi' => $titleVi,
            'name_en' => $nameEn,
            'name_vi' => $nameVi,
            'description_en' => $descriptionEn,
            'description_vi' => $descriptionVi,
            'summary_en' => $summaryEn,
            'summary_vi' => $summaryVi,
            'slug' => Str::slug($nameEn),
            'is_highlight' => $isHighlight,
        ]);

        return $updatedCount === 1;
    }

    /**
     * Delete (soft) the album by ID.
     */
    public function deleteById(int $id): bool
    {
        $deletedCount = Album::query()->where('id', $id)->delete();

        return $deletedCount === 1;
    }

    /**
     * Restore the album by ID.
     */
    public function restoreById(int $id): bool
    {
        $restoredCount = Album::query()
            ->withTrashed()
            ->where('id', $id)
            ->whereNotNull('deleted_at')
            ->restore();

        return $restoredCount === 1;
    }

    /**
     * Delete (force) the album by ID.
     */
    public function destroyById(int $id): bool
    {
        $deletedCount = Album::query()->withTrashed()->where('id', $id)->forceDelete();

        return $deletedCount === 1;
    }

    /**
     * Get the count of highlighted albums.
     */
    public function countHighlightAlbums(): int
    {
        return Album::query()->where('is_highlight', true)->count();
    }
}
