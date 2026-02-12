<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Constants\MediaSetting;
use App\Enums\MediaFrame;
use App\Enums\PerPage;
use App\Http\Requests\Project\PaginateProjectsRequest;
use App\Http\Requests\Project\StoreProjectRequest;
use App\UseCases\Category\GetAllCategoryOptionsUseCase;
use App\UseCases\Project\PaginateProjectsUseCase;
use App\UseCases\Project\StoreProjectUseCase;
use Common\App\Enums\WebVisibility;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\ResponseFactory;

/**
 * The controller class for the project.
 */
class ProjectController extends Controller
{
    /**
     * Display the project list view.
     */
    public function index(PaginateProjectsRequest $request, PaginateProjectsUseCase $useCase): Response|ResponseFactory
    {
        $projects = $useCase(
            PerPage::from($request->per_page),
            $request->category_id,
            $request->is_highlight,
            $request->web_visibilities,
            $request->keyword
        );
        $webVisibilityOptions = WebVisibility::toOptions();
        $perPageOptions = PerPage::toOptions();
        $query = $request->query();


        return inertia('Project/List', compact('projects', 'webVisibilityOptions', 'perPageOptions', 'query'));
    }

    /**
     * Display the project create view.
     */
    public function create(GetAllCategoryOptionsUseCase $getAllCategoryOptionsUseCase): Response|ResponseFactory
    {
        $categoryOptions = $getAllCategoryOptionsUseCase();
        $webVisibilityOptions = WebVisibility::toOptions();
        $mediaFrameOptions = MediaFrame::toOptions();
        $maxMediaItemsCountPerGallery = MediaSetting::MAX_MEDIA_COUNT_PER_GALLERY;

        return inertia('Project/Add', compact(
            'categoryOptions',
            'webVisibilityOptions',
            'mediaFrameOptions',
            'maxMediaItemsCountPerGallery'
        ));
    }

    /**
     * Store a new project.
     */
    public function store(StoreProjectRequest $request, StoreProjectUseCase $useCase): RedirectResponse
    {
        $result = $useCase(
            $request->category_id,
            $request->title_en,
            $request->title_vi,
            $request->description_en,
            $request->description_vi,
            $request->summary_en,
            $request->summary_vi,
            $request->is_highlight,
            WebVisibility::from($request->web_visibility),
            $request->thumbnail,
            $request->galleries
        );

        if (!$result['success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return to_route('projects.index')->with('message', $result['message']);
    }

    /**
     * Display the project edit view.
     */
    public function edit(): Response|ResponseFactory
    {
        return inertia('Project/Edit');
    }
}
