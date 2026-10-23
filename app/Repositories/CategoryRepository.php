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
    // The number of project covers to preview for each category in the list.
    private const PREVIEW_PROJECTS_LIMIT = 4;

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
            ->withCount('projects')
            ->with([
                // A few covers per category, without the galleries a project loads by default.
                'projects' => fn ($query) => $query
                    ->setEagerLoads([])
                    ->select(['id', 'category_id', 'title_en', 'title_vi', 'thumbnail_file_path'])
                    ->orderBy('updated_at', 'desc')
                    ->orderBy('id', 'desc')
                    ->limit(self::PREVIEW_PROJECTS_LIMIT),
            ])
            ->orderBy('id', 'desc')
            ->paginate($perPage->value);
    }

    /**
     * Check if any of the given categories has projects.
     */
    public function hasProjects(array $ids): bool
    {
        return Category::query()->whereIn('id', $ids)->has('projects')->exists();
    }

    /**
     * Get all categories.
     */
    public function findAll(): Collection
    {
        return Category::all();
    }

    /**
     * Get all categories with their projects count, the ones with the most projects first.
     */
    public function findAllWithProjectsCount(): Collection
    {
        return Category::query()
            ->withCount('projects')
            ->orderBy('projects_count', 'desc')
            ->orderBy('id')
            ->get();
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
