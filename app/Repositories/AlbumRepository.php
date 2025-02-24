<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Album;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class AlbumRepository
{
    /**
     * Find all albums.
     */
    public function findAlbums(
        int $perPage,
        ?string $keyword,
        array $relations = [],
        array $withCountRelations = [],
        string $sortKey = 'created_at',
        string $sortOrder = 'desc',
        bool $withTrashed = true
    ): LengthAwarePaginator {
        return Album::query()
            ->withTrashed($withTrashed)
            ->when(
                isset($keyword),
                function (Builder $query) use ($keyword) {
                    $query->whereLike('title_en', "%{$keyword}%")
                        ->orWhereLike('title_vi', "%{$keyword}%")
                        ->orWhereLike('name_en', "%{$keyword}%")
                        ->orWhereLike('name_vi', "%{$keyword}%");
                }
            )
            ->with($relations)
            ->withCount($withCountRelations)
            ->orderBy($sortKey, $sortOrder)
            ->paginate($perPage);
    }

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
            'title_en'       => $titleEn,
            'title_vi'       => $titleVi,
            'name_en'        => $nameEn,
            'name_vi'        => $nameVi,
            'description_en' => $descriptionEn,
            'description_vi' => $descriptionVi,
            'summary_en'     => $summaryEn,
            'summary_vi'     => $summaryVi,
            'is_highlight'   => $isHighlight,
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
            'title_en'       => $titleEn,
            'title_vi'       => $titleVi,
            'name_en'        => $nameEn,
            'name_vi'        => $nameVi,
            'description_en' => $descriptionEn,
            'description_vi' => $descriptionVi,
            'summary_en'     => $summaryEn,
            'summary_vi'     => $summaryVi,
            'is_highlight'   => $isHighlight,
        ]);

        return $updatedCount === 1;
    }

    /**
     * Delete (soft) the album by ID.
     */
    public function deleteAlbumById(int $id): bool
    {
        $deletedCount = Album::query()->where('id', $id)->delete();

        return $deletedCount === 1;
    }

    /**
     * Restore the album by ID.
     */
    public function restoreAlbumById(int $id): bool
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
    public function destroyAlbumById(int $id): bool
    {
        $deletedCount = Album::query()->withTrashed()->where('id', $id)->forceDelete();

        return $deletedCount === 1;
    }
}
