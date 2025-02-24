<?php

declare(strict_types=1);

namespace App\Services\Album;

use App\Models\Album;
use App\Repositories\AlbumRepository;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DestroyAlbumService
{
    public function __construct(private readonly AlbumRepository $albumRepository)
    {
    }

    public function execute(Album $album): array
    {
        try {
            DB::beginTransaction();


            // TODO: Destroy media of album

            // Delete album thumbnail.
            $albumThumbnailFilePath = $album->thumbnail->file_path;
            $album->thumbnail()->delete();

            // Delete album.
            $isCompleted = $this->albumRepository->destroyAlbumById($album->id);

            if (!$isCompleted) {
                DB::rollBack();

                return [
                    'is_success' => false,
                    'message'    => __('messages')['data_deleted_failed'],
                ];
            }

            // Delete album thumbnail file.
            unlink(public_path($albumThumbnailFilePath));

            DB::commit();

            return [
                'is_success' => true,
                'message'    => __('messages')['data_deleted_successfully'],
            ];
        } catch (Exception|QueryException $e) {
            Log::error($e);
            DB::rollBack();

            return [
                'is_success' => false,
                'message'    => __('messages')['internal_server_error'],
            ];
        }
    }
}
