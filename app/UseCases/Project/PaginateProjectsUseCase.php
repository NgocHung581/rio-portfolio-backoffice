<?php

declare(strict_types=1);

namespace App\UseCases\Project;

use App\Enums\PerPage;
use App\Repositories\ProjectRepository;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * The use case class for paginating projects.
 */
class PaginateProjectsUseCase
{
    public function __construct(private readonly ProjectRepository $projectRepository)
    {
    }

    public function __invoke(PerPage $perPage, ?array $categoryIds = null, ?string $keyword = null): LengthAwarePaginator
    {
        return $this->projectRepository->paginate($perPage, $categoryIds, $keyword);
    }
}
