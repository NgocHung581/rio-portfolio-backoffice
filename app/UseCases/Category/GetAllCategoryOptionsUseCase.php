<?php

declare(strict_types=1);

namespace App\UseCases\Category;

use App\Repositories\CategoryRepository;

/**
 * The use case class for getting all category options.
 */
class GetAllCategoryOptionsUseCase
{
    public function __construct(private readonly CategoryRepository $categoryRepository)
    {
    }

    public function __invoke(): array
    {
        $categories = $this->categoryRepository->findAll();
        $locale = app()->getLocale();

        return $categories
            ->map(fn ($category) => [
                'value' => $category->id,
                'label' => $category->{"name_{$locale}"},
                'media_type' => $category->media_type,
            ])
            ->toArray();
    }
}
