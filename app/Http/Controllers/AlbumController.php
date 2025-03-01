<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\ColumnSpan;
use App\Enums\FileType;
use App\Http\Requests\Album\CreateAlbumRequest;
use App\Http\Requests\Album\ListAlbumsRequest;
use App\Http\Requests\Album\UpdateAlbumRequest;
use App\Http\Resources\AlbumResource;
use App\Models\Album;
use App\Services\Album\CreateAlbumService;
use App\Services\Album\DeleteAlbumService;
use App\Services\Album\DestroyAlbumService;
use App\Services\Album\ListAlbumsService;
use App\Services\Album\RestoreAlbumService;
use App\Services\Album\UpdateAlbumService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\URL;
use Inertia\Response;
use Inertia\ResponseFactory;

class AlbumController extends Controller
{
    /**
     * Display the album list view.
     */
    public function index(
        ListAlbumsRequest $request,
        ListAlbumsService $service
    ): Response|ResponseFactory {
        $albums = $service->execute($request->per_page, $request->keyword);

        return inertia('Album/List', [
            'albums' => AlbumResource::collection($albums),
            'initSearchForm' => ['keyword' => $request->keyword ?? ''],
        ]);
    }

    /**
     * Display the album create view.
     */
    public function create(): Response|ResponseFactory
    {
        return inertia('Album/Create');
    }

    /**
     * Store a new album.
     */
    public function store(
        CreateAlbumRequest $request,
        CreateAlbumService $service
    ): RedirectResponse {
        $result = $service->execute([
            ...$request->input(),
            'thumbnail_file' => $request->thumbnail_file,
        ]);

        if (!$result['is_success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return to_route('albums.edit', $result['album'])->with('message', $result['message']);
    }

    public function edit(Album $album): Response|ResponseFactory
    {
        return inertia('Album/Edit', [
            'album' => new AlbumResource($album),
            'columnSpanOptions' => ColumnSpan::toArray(),
            'fileTypeOptions' => FileType::toArray(),
        ]);
    }

    /**
     * Update the album.
     */
    public function update(
        Album $album,
        UpdateAlbumRequest $request,
        UpdateAlbumService $service
    ): RedirectResponse {
        $result = $service->execute(
            $album,
            [
                ...$request->input(),
                'thumbnail_file' => $request->thumbnail_file,
            ]
        );

        if (!$result['is_success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return back()->with('message', $result['message']);
    }

    /**
     * Delete (soft) the album.
     */
    public function deleteAlbum(
        Album $album,
        DeleteAlbumService $service
    ): RedirectResponse {
        $result = $service->execute($album);

        if (!$result['is_success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return back()->with('message', $result['message']);
    }

    /**
     * Restore the album.
     */
    public function restoreAlbum(
        Album $album,
        RestoreAlbumService $service
    ): RedirectResponse {
        $result = $service->execute($album);

        if (!$result['is_success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return back()->with('message', $result['message']);
    }

    /**
     * Delete (force) the album.
     */
    public function destroyAlbum(
        Album $album,
        DestroyAlbumService $service
    ): RedirectResponse {
        $result = $service->execute($album);

        if (!$result['is_success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        if (URL::previousPath() === route('albums.index', absolute: false)) {
            $redirect = back();
        } else {
            $redirect = to_route('albums.index');
        }

        return $redirect->with('message', $result['message']);
    }
}
