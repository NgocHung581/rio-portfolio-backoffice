<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Enums\PerPage;
use App\Models\Category;
use Common\App\Enums\MediaType;
use Common\App\Repositories\CategoryRepository as CommonCategoryRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

/**
 * The repository class for the category.
 */
class CategoryRepository extends CommonCategoryRepository
{
    /**
     * Get a paginated list of categories.
     */
    public function paginate(
        PerPage $perPage,
        ?string $keyword = null
    ): LengthAwarePaginator {
        return Category::query()
            ->when(
                isset($keyword),
                fn ($query) => $query->whereLike('name_en', "%{$keyword}%")->orWhereLike('name_vi', "%{$keyword}%")
            )
            ->orderBy('id', 'desc')
            ->paginate($perPage->value);
    }

    /**
     * Get all categories.
     */
    public function findAll(): Collection
    {
        return Category::all();
    }

    /**
     * Find a category by ID.
     */
    public function findById(int $id): ?Category
    {
        return Category::find($id);
    }

    /**
     * Create a new category.
     */
    public function create(string $nameEn, string $nameVi, MediaType $mediaType): Category
    {
        return Category::query()->create([
            'name_en' => $nameEn,
            'name_vi' => $nameVi,
            'media_type' => $mediaType,
            'slug' => Str::slug($nameEn),
        ]);
    }

    /**
     * Update a category by ID.
     */
    public function update(
        int $id,
        string $nameEn,
        string $nameVi,
        MediaType $mediaType
    ): int {
        return Category::query()->where('id', $id)->update([
            'name_en' => $nameEn,
            'name_vi' => $nameVi,
            'media_type' => $mediaType,
            'slug' => Str::slug($nameEn),
        ]);
    }

    /**
     * Bulk delete categories by IDs.
     */
    public function bulkDelete(array $ids): int
    {
        return Category::query()->whereIn('id', $ids)->delete();
    }
}
