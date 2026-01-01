<?php

declare(strict_types=1);

namespace App\Http\UseCases\Category;

use App\Repositories\CategoryRepository;
use Common\App\Enums\MediaType;
use Common\App\Enums\WebVisibility;
use Exception;
use Illuminate\Support\Facades\Log;

/**
 * The use case class for updating a category.
 */
class UpdateCategoryUseCase
{
    public function __construct(private readonly CategoryRepository $categoryRepository)
    {
    }

    public function __invoke(
        int $id,
        string $nameEn,
        string $nameVi,
        MediaType $mediaType,
        WebVisibility $webVisibility
    ): array {
        try {
            $this->categoryRepository->update($id, $nameEn, $nameVi, $mediaType, $webVisibility);

            return ['success' => true, 'message' => __('messages')['data_updated_successfully']];
        } catch (Exception $exception) {
            Log::error($exception);

            return ['success' => false, 'message' => __('messages')['internal_server_error']];
        }
    }
}
