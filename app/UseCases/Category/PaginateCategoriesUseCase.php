<?php

declare(strict_types=1);

namespace App\UseCases\Category;

use App\Enums\PerPage;
use App\Repositories\CategoryRepository;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * The use case class for paginating categories.
 */
class PaginateCategoriesUseCase
{
    public function __construct(private readonly CategoryRepository $categoryRepository)
    {
    }

    public function __invoke(PerPage $perPage, ?string $keyword = null): LengthAwarePaginator
    {
        return $this->categoryRepository->paginate($perPage, $keyword);
    }
}
