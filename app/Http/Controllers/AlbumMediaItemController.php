<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Constants\AlbumMediaItemSetting;
use App\Enums\ColumnSpan;
use App\Enums\FileType;
use App\Http\Requests\AlbumMediaItem\CreateAlbumMediaItemRequest;
use App\Http\Resources\AlbumResource;
use App\Models\Album;
use App\Services\AlbumMedia\CreateAlbumMediaItemService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\ResponseFactory;

class AlbumMediaItemController extends Controller
{
    /**
     * Display the album media items upload view.
     */
    public function create(Album $album): Response|ResponseFactory
    {
        return inertia('AlbumMediaItem/Create', [
            'album' => new AlbumResource($album),
            'fileTypeOptions' => FileType::toArray(),
            'imagesCountLimitPerUpload' => AlbumMediaItemSetting::IMAGES_COUNT_LIMIT_PER_UPLOAD,
            'videosCountLimitPerUpload' => AlbumMediaItemSetting::VIDEOS_COUNT_LIMIT_PER_UPLOAD,
            'columnSpanOptions' => ColumnSpan::toArray(),
        ]);
    }

    /**
     * Store list of new album media items.
     */
    public function store(
        Album $album,
        CreateAlbumMediaItemRequest $request,
        CreateAlbumMediaItemService $service
    ): RedirectResponse {
        $result = $service->execute($album->id, $request->all()['media']);

        if (!$result['is_success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return to_route('albums.edit', $album)->with('message', $result['message']);
    }

    /**
     * Delete a album media item.
     */
    public function deleteAlbumMediaItem(Request $request): void
    {
    }

    /**
     * Delete album media items.
     */
    public function deleteAlbumMediaItems(): void
    {
    }
}
