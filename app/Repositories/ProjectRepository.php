<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Enums\PerPage;
use App\Models\Project;
use Common\App\Enums\WebVisibility;
use Common\App\Repositories\ProjectRepository as CommonProjectRepository;
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
        ?int $categoryId = null,
        ?bool $isHighlight = null,
        ?array $webVisibilities = null,
        ?string $keyword = null
    ): LengthAwarePaginator {
        return Project::query()
            ->when(
                isset($categoryId),
                fn ($query) => $query->where('category_id', $categoryId)
            )
            ->when(
                isset($isHighlight),
                fn ($query) => $query->where('is_highlight', $isHighlight)
            )
            ->when(
                filled($webVisibilities),
                fn ($query) => $query->whereIn('web_visibility', $webVisibilities)
            )
            ->when(
                isset($keyword),
                fn ($query) => $query->whereLike('title_en', "%{$keyword}%")->orWhereLike('title_vi', "%{$keyword}%")
            )
            ->orderBy('id', 'desc')
            ->paginate($perPage->value);
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
        string $thumbnailFilePath,
        string $thumbnailFrame,
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
            'thumbnail_file_path' => $thumbnailFilePath,
            'thumbnail_frame' => $thumbnailFrame,
            'web_visibility' => $webVisibility,
        ]);
    }
}
