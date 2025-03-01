<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Constants\AlbumMediaSetting;
use App\Enums\AlbumMediaColumnSpan;
use App\Enums\MediaType;
use App\Http\Requests\AlbumMedia\CreateAlbumMediaRequest;
use App\Http\Resources\AlbumResource;
use App\Models\Album;
use App\Services\AlbumMedia\CreateAlbumMediaService;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\ResponseFactory;

class AlbumMediaController extends Controller
{
    /**
     * Display the album media upload view.
     */
    public function create(Album $album): Response|ResponseFactory
    {
        return inertia('AlbumMedia/Create', [
            'album' => new AlbumResource($album),
            'mediaTypeOptions' => MediaType::toArray(),
            'imagesCountLimitPerUpload' => AlbumMediaSetting::IMAGES_COUNT_LIMIT_PER_UPLOAD,
            'videosCountLimitPerUpload' => AlbumMediaSetting::VIDEOS_COUNT_LIMIT_PER_UPLOAD,
            'columnSpanOptions' => AlbumMediaColumnSpan::toArray(),
        ]);
    }

    /**
     * Store list of new album media.
     */
    public function store(
        Album $album,
        CreateAlbumMediaRequest $request,
        CreateAlbumMediaService $service
    ): RedirectResponse {
        $result = $service->execute($album->id, $request->all()['media']);

        if (!$result['is_success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return to_route('albums.edit', $album)->with('message', $result['message']);
    }
}
