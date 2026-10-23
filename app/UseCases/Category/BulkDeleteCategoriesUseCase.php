<?php

declare(strict_types=1);

namespace App\UseCases\Category;

use App\Repositories\CategoryRepository;
use Exception;
use Illuminate\Support\Facades\Log;

/**
 * The use case class for bulk deleting categories.
 */
class BulkDeleteCategoriesUseCase
{
    public function __construct(private readonly CategoryRepository $categoryRepository)
    {
    }

    public function __invoke(array $ids): array
    {
        // Projects keep a reference to their category, so a category in use cannot be deleted.
        if ($this->categoryRepository->hasProjects($ids)) {
            return ['success' => false, 'message' => __('messages')['cannot_delete_categories_with_projects']];
        }

        try {
            $this->categoryRepository->bulkDelete($ids);

            return ['success' => true, 'message' => __('messages')['data_deleted_successfully']];
        } catch (Exception $exception) {
            Log::error($exception);

            return ['success' => false, 'message' => __('messages')['internal_server_error']];
        }
    }
}
