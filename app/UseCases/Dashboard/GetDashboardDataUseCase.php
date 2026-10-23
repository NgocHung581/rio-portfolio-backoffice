<?php

declare(strict_types=1);

namespace App\UseCases\Dashboard;

use App\Models\Category;
use App\Models\Project;
use App\Repositories\CategoryRepository;
use App\Repositories\ProjectRepository;
use Common\App\Enums\WebVisibility;
use Common\App\UseCases\WebsiteContentSetting\GetWebsiteContentSettingUseCase;

/**
 * The use case class for getting the data of the dashboard.
 */
class GetDashboardDataUseCase
{
    // The number of recently edited projects to show.
    private const RECENT_PROJECTS_LIMIT = 6;

    // The number of private projects to show in the to-do list.
    private const PRIVATE_PROJECTS_LIMIT = 5;

    public function __construct(
        private readonly ProjectRepository $projectRepository,
        private readonly CategoryRepository $categoryRepository,
        private readonly GetWebsiteContentSettingUseCase $getWebsiteContentSettingUseCase
    ) {
    }

    public function __invoke(): array
    {
        $projectsCountByWebVisibility = $this->projectRepository->countByWebVisibility();
        $publicProjectsCount = (int) ($projectsCountByWebVisibility[WebVisibility::Public->value] ?? 0);
        $privateProjectsCount = (int) ($projectsCountByWebVisibility[WebVisibility::Private->value] ?? 0);
        $websiteContentSetting = ($this->getWebsiteContentSettingUseCase)();

        return [
            'projectStatistics' => [
                'total' => $publicProjectsCount + $privateProjectsCount,
                'public' => $publicProjectsCount,
                'private' => $privateProjectsCount,
                'highlighted' => $this->projectRepository->countHighlighted(),
            ],
            'categories' => $this->categoryRepository->findAllWithProjectsCount()
                ->map(fn (Category $category) => [
                    'id' => $category->id,
                    'name_en' => $category->name_en,
                    'name_vi' => $category->name_vi,
                    'media_type' => $category->media_type->value,
                    'projects_count' => $category->projects_count,
                ])
                ->all(),
            'recentProjects' => $this->projectRepository->findLatestUpdated(self::RECENT_PROJECTS_LIMIT)
                ->map(fn (Project $project) => $this->toProjectSummary($project))
                ->all(),
            'privateProjects' => $this->projectRepository
                ->findLatestUpdated(self::PRIVATE_PROJECTS_LIMIT, WebVisibility::Private)
                ->map(fn (Project $project) => $this->toProjectSummary($project))
                ->all(),
            'websiteContent' => [
                'has_avatar' => filled($websiteContentSetting['avatar']['file_path'] ?? null),
                'has_introduction' => filled($websiteContentSetting['introduction_en'])
                                    && filled($websiteContentSetting['introduction_vi']),
                'partner_logos_count' => count($websiteContentSetting['partner_logos']),
            ],
        ];
    }

    /**
     * Get the fields of a project that the dashboard shows.
     */
    private function toProjectSummary(Project $project): array
    {
        return [
            'id' => $project->id,
            'title_en' => $project->title_en,
            'title_vi' => $project->title_vi,
            'thumbnail_file_url' => $project->thumbnail_file_url,
            'web_visibility' => $project->web_visibility->value,
            'is_highlight' => $project->is_highlight,
            'updated_at' => $project->updated_at->toIso8601String(),
            'category_name_en' => $project->category->name_en,
            'category_name_vi' => $project->category->name_vi,
            'category_media_type' => $project->category->media_type->value,
            'media_items_count' => $project->galleries->sum(fn ($gallery) => $gallery->mediaItems->count()),
        ];
    }
}
