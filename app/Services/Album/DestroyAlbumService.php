<?php

declare(strict_types=1);

namespace App\Services\Album;

use App\Constants\PublicStorageFolderPathPrefix;
use App\Models\Album;
use App\Repositories\AlbumRepository;
use App\Repositories\MediaFileRepository;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DestroyAlbumService
{
    public function __construct(
        private readonly AlbumRepository $albumRepository,
        private readonly MediaFileRepository $mediaFileRepository
    ) {
    }

    public function execute(Album $album): array
    {
        try {
            $albumMediaFolderPath = PublicStorageFolderPathPrefix::ALBUM_MEDIA . $album->id;
            $mediaFileIds = $album->mediaItems->map(fn($mediaItem) => $mediaItem->mediaFile->id)->toArray();

            DB::beginTransaction();

            // Delete album's relations.
            $album->thumbnail()->delete();
            $album->mediaItems()->delete();
            $this->mediaFileRepository->bulkDestroyByIds($mediaFileIds);

            // Delete album.
            $isCompleted = $this->albumRepository->destroyAlbumById($album->id);

            if (!$isCompleted) {
                DB::rollBack();

                return [
                    'is_success' => false,
                    'message' => __('messages')['data_deleted_failed'],
                ];
            }

            // Delete album media's folder.
            Storage::disk('public')->deleteDirectory($albumMediaFolderPath);

            DB::commit();

            return [
                'is_success' => true,
                'message' => __('messages')['data_deleted_successfully'],
            ];
        } catch (Exception|QueryException $e) {
            Log::error($e);
            DB::rollBack();

            return [
                'is_success' => false,
                'message' => __('messages')['internal_server_error'],
            ];
        }
    }
}
