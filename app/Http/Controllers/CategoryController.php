<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\PerPage;
use App\Http\Requests\Category\PaginateCategoriesRequest;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Models\Category;
use App\UseCases\Category\BulkDeleteCategoriesUseCase;
use App\UseCases\Category\PaginateCategoriesUseCase;
use App\UseCases\Category\StoreCategoryUseCase;
use App\UseCases\Category\UpdateCategoryUseCase;
use Common\App\Enums\MediaType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\ResponseFactory;

/**
 * The controller class for the category.
 */
class CategoryController extends Controller
{
    /**
     * Display the category list view.
     */
    public function index(
        PaginateCategoriesRequest $request,
        PaginateCategoriesUseCase $useCase
    ): Response|ResponseFactory {
        $categories = $useCase(PerPage::from($request->per_page), $request->keyword);
        $mediaTypeOptions = MediaType::toOptions();
        $perPageOptions = PerPage::toOptions();
        $query = $request->query();

        return inertia('Category/List', compact(
            'categories',
            'mediaTypeOptions',
            'perPageOptions',
            'query',
        ));
    }

    /**
     * Store a new category.
     */
    public function store(StoreCategoryRequest $request, StoreCategoryUseCase $useCase): RedirectResponse
    {
        $result = $useCase($request->name_en, $request->name_vi, MediaType::from($request->media_type));

        if (!$result['success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return back()->with('message', $result['message']);
    }

    /**
     * Update a category.
     */
    public function update(
        Category $category,
        UpdateCategoryRequest $request,
        UpdateCategoryUseCase $useCase
    ): RedirectResponse {
        $result = $useCase(
            $category->id,
            $request->name_en,
            $request->name_vi,
            MediaType::from($request->media_type)
        );

        if (!$result['success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return back()->with('message', $result['message']);
    }

    /**
     * Bulk delete categories.
     */
    public function bulkDelete(Request $request, BulkDeleteCategoriesUseCase $useCase): RedirectResponse
    {
        $result = $useCase($request->ids);

        if (!$result['success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return back()->with('message', $result['message']);
    }
}
