<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Enums\PerPage;
use App\Models\Category;
use Common\App\Enums\MediaType;
use Common\App\Enums\WebVisibility;
use Common\App\Repositories\CategoryRepository as CommonCategoryRepository;
use Illuminate\Pagination\LengthAwarePaginator;

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
        ?array $webVisibilities = null,
        ?string $keyword = null
    ): LengthAwarePaginator {
        return Category::query()
            ->when(
                isset($webVisibilities),
                fn ($query) => $query->whereIn('web_visibility', $webVisibilities)
            )
            ->when(
                isset($keyword),
                fn ($query) => $query->whereLike('name_en', "%{$keyword}%")->orWhereLike('name_vi', "%{$keyword}%")
            )
            ->orderBy('id', 'desc')
            ->paginate($perPage->value);
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
        ]);
    }

    /**
     * Update a category by ID.
     */
    public function update(
        int $id,
        string $nameEn,
        string $nameVi,
        MediaType $mediaType,
        WebVisibility $webVisibility
    ): int {
        return Category::query()->where('id', $id)->update([
            'name_en' => $nameEn,
            'name_vi' => $nameVi,
            'media_type' => $mediaType,
            'web_visibility' => $webVisibility,
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
