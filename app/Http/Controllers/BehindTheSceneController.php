<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\BehindTheScene\BulkDeleteBehindTheScenesRequest;
use App\Http\Requests\BehindTheScene\StoreBehindTheScenesRequest;
use App\Http\Requests\BehindTheScene\UpdateBehindTheSceneRequest;
use App\Models\MediaItem;
use App\UseCases\BehindTheScene\BulkDeleteBehindTheScenesUseCase;
use App\UseCases\BehindTheScene\GetBehindTheScenesUseCase;
use App\UseCases\BehindTheScene\StoreBehindTheScenesUseCase;
use App\UseCases\BehindTheScene\UpdateBehindTheSceneUseCase;
use Common\App\Enums\MediaFrame;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\ResponseFactory;

/**
 * The controller class for the behind the scene media items, which do not belong to any project.
 */
class BehindTheSceneController extends Controller
{
    /**
     * Display the behind the scene list view.
     */
    public function index(GetBehindTheScenesUseCase $useCase): Response|ResponseFactory
    {
        $mediaItems = $useCase();
        $mediaFrameOptions = MediaFrame::toOptions();

        return inertia('BehindTheScene/List', compact('mediaItems', 'mediaFrameOptions'));
    }

    /**
     * Store new behind the scene media items.
     */
    public function store(StoreBehindTheScenesRequest $request, StoreBehindTheScenesUseCase $useCase): RedirectResponse
    {
        $result = $useCase($request->items);

        if (!$result['success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return back()->with('message', $result['message']);
    }

    /**
     * Update the frame of a behind the scene media item.
     */
    public function update(
        MediaItem $mediaItem,
        UpdateBehindTheSceneRequest $request,
        UpdateBehindTheSceneUseCase $useCase
    ): RedirectResponse {
        $result = $useCase($mediaItem, MediaFrame::from($request->frame));

        if (!$result['success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return back()->with('message', $result['message']);
    }

    /**
     * Bulk delete behind the scene media items.
     */
    public function bulkDelete(BulkDeleteBehindTheScenesRequest $request, BulkDeleteBehindTheScenesUseCase $useCase): RedirectResponse
    {
        $result = $useCase($request->ids);

        if (!$result['success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return back()->with('message', $result['message']);
    }
}
