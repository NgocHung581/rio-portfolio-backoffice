<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Constants\AlbumMediaItemSetting;
use App\Enums\ColumnSpan;
use App\Enums\MediaType;
use App\Http\Requests\AlbumMediaItem\BulkCreateAlbumMediaItemsRequest;
use App\Http\Requests\AlbumMediaItem\BulkDestroyAlbumMediaItemsRequest;
use App\Http\Requests\AlbumMediaItem\BulkUpdateAlbumMediaItemsRequest;
use App\Http\Resources\AlbumResource;
use App\Models\Album;
use App\Models\AlbumMediaItem;
use App\Services\AlbumMediaItem\BulkCreateAlbumMediaItemsService;
use App\Services\AlbumMediaItem\BulkDestroyAlbumMediaItemsService;
use App\Services\AlbumMediaItem\BulkUpdateAlbumMediaItemsService;
use App\Services\AlbumMediaItem\DestroyAlbumMediaItemService;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\ResponseFactory;

class AlbumMediaItemController extends Controller
{
    /**
     * Display the album media items upload view.
     */
    public function bulkCreate(Album $album): Response|ResponseFactory
    {
        return inertia('AlbumMediaItem/Create', [
            'album' => new AlbumResource($album),
            'fileTypeOptions' => MediaType::toFileTypeOptions(),
            'imagesCountLimitPerUpload' => AlbumMediaItemSetting::IMAGES_COUNT_LIMIT_PER_UPLOAD,
            'videosCountLimitPerUpload' => AlbumMediaItemSetting::VIDEOS_COUNT_LIMIT_PER_UPLOAD,
            'columnSpanOptions' => ColumnSpan::toArray(),
            'fileType' => MediaType::toFileTypeArray(),
        ]);
    }

    /**
     * Bulk store list of new album media items.
     */
    public function bulkStore(
        Album $album,
        BulkCreateAlbumMediaItemsRequest $request,
        BulkCreateAlbumMediaItemsService $service
    ): RedirectResponse {
        $result = $service->execute($album->id, $request->media);

        if (!$result['is_success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return to_route('albums.edit', $album)->with('message', $result['message']);
    }

    /**
     * Bulk update album media items.
     */
    public function bulkUpdate(
        BulkUpdateAlbumMediaItemsRequest $request,
        BulkUpdateAlbumMediaItemsService $service
    ): RedirectResponse {
        $result = $service->execute($request->album_media_items);

        if (!$result['is_success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return back()->with('message', $result['message']);
    }

    /**
     * Bulk destroy album media items.
     */
    public function bulkDestroy(
        BulkDestroyAlbumMediaItemsRequest $request,
        BulkDestroyAlbumMediaItemsService $service
    ): RedirectResponse {
        $result = $service->execute($request->ids);

        if (!$result['is_success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return back()->with('message', $result['message']);
    }

    /**
     * Destroy a album media item.
     */
    public function destroy(
        Album $album,
        AlbumMediaItem $albumMediaItem,
        DestroyAlbumMediaItemService $service
    ): RedirectResponse {
        $result = $service->execute($albumMediaItem);

        if (!$result['is_success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return back()->with('message', $result['message']);
    }
}
