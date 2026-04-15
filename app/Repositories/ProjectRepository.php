<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Enums\PerPage;
use App\Models\Project;
use Common\App\Enums\WebVisibility;
use Common\App\Repositories\ProjectRepository as CommonProjectRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * The repository class for the project.
 */
class ProjectRepository extends CommonProjectRepository
{
    /**
     * Get a paginated list of projects.
     */
    public function paginate(
        PerPage $perPage,
        ?array $categoryIds = null,
        ?string $keyword = null
    ): LengthAwarePaginator {
        return Project::query()
            ->when(
                filled($categoryIds),
                fn ($query) => $query->whereIn('category_id', $categoryIds)
            )
            ->when(
                isset($keyword),
                fn ($query) => $query->whereLike('title_en', "%{$keyword}%")->orWhereLike('title_vi', "%{$keyword}%")
            )
            ->orderBy('id', 'desc')
            ->paginate($perPage->value);
    }

    /**
     * Find many projects by IDs.
     */
    public function findManyByIds(array $ids): Collection
    {
        return Project::query()->whereIn('id', $ids)->get();
    }

    /**
     * Create a new project.
     */
    public function create(
        int $categoryId,
        string $titleEn,
        string $titleVi,
        string $descriptionEn,
        string $descriptionVi,
        string $summaryEn,
        string $summaryVi,
        bool $isHighlight,
        string $thumbnailFileId,
        string $thumbnailFileName,
        string $thumbnailFileMimeType,
        WebVisibility $webVisibility
    ): Project {
        return Project::query()->create([
            'category_id' => $categoryId,
            'title_en' => $titleEn,
            'title_vi' => $titleVi,
            'description_en' => $descriptionEn,
            'description_vi' => $descriptionVi,
            'summary_en' => $summaryEn,
            'summary_vi' => $summaryVi,
            'is_highlight' => $isHighlight,
            'thumbnail_file_id' => $thumbnailFileId,
            'thumbnail_file_name' => $thumbnailFileName,
            'thumbnail_file_mime_type' => $thumbnailFileMimeType,
            'web_visibility' => $webVisibility,
        ]);
    }

    /**
     * Update a project by ID.
     */
    public function update(
        int $id,
        int $categoryId,
        string $titleEn,
        string $titleVi,
        string $descriptionEn,
        string $descriptionVi,
        string $summaryEn,
        string $summaryVi,
        bool $isHighlight,
        string $thumbnailFileId,
        string $thumbnailFileName,
        string $thumbnailFileMimeType,
        WebVisibility $webVisibility
    ): int {
        return Project::query()->where('id', $id)->update([
            'category_id' => $categoryId,
            'title_en' => $titleEn,
            'title_vi' => $titleVi,
            'description_en' => $descriptionEn,
            'description_vi' => $descriptionVi,
            'summary_en' => $summaryEn,
            'summary_vi' => $summaryVi,
            'is_highlight' => $isHighlight,
            'thumbnail_file_id' => $thumbnailFileId,
            'thumbnail_file_name' => $thumbnailFileName,
            'thumbnail_file_mime_type' => $thumbnailFileMimeType,
            'web_visibility' => $webVisibility,
        ]);
    }

    /**
     * Bulk delete projects by IDs.
     */
    public function bulkDelete(array $ids): int
    {
        return Project::query()->whereIn('id', $ids)->delete();
    }
}
