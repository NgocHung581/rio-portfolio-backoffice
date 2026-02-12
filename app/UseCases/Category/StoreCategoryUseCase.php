<?php

declare(strict_types=1);

namespace App\UseCases\Category;

use App\Repositories\CategoryRepository;
use Common\App\Enums\MediaType;
use Exception;
use Illuminate\Support\Facades\Log;

/**
 * The use case class for storing a new category.
 */
class StoreCategoryUseCase
{
    public function __construct(private readonly CategoryRepository $categoryRepository)
    {
    }

    public function __invoke(string $nameEn, string $nameVi, MediaType $mediaType): array
    {
        try {
            $this->categoryRepository->create($nameEn, $nameVi, $mediaType);

            return ['success' => true, 'message' => __('messages')['data_created_successfully']];
        } catch (Exception $exception) {
            Log::error($exception);

            return ['success' => false, 'message' => __('messages')['internal_server_error']];
        }
    }
}
