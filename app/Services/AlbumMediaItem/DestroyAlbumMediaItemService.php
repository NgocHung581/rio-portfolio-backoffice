<?php

declare(strict_types=1);

namespace App\Services\AlbumMediaItem;

use App\Models\AlbumMediaItem;
use App\Repositories\AlbumMediaItemRepository;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DestroyAlbumMediaItemService
{
    public function __construct(private readonly AlbumMediaItemRepository $albumMediaItemRepository)
    {
    }

    public function execute(AlbumMediaItem $albumMediaItem): array
    {
        try {
            DB::beginTransaction();


            // Delete media file.
            $uploadedFilePaths[] = $albumMediaItem->mediaFile->file_path;

            $albumMediaItem->mediaFile()->delete();

            // Delete video thumbnail file.
            if (isset($albumMediaItem->videoThumbnailFile)) {
                $uploadedFilePaths[] = $albumMediaItem->videoThumbnailFile->file_path;

                $albumMediaItem->videoThumbnailFile()->delete();
            }

            // Delete album media item.
            $isCompleted = $this->albumMediaItemRepository->destroyById($albumMediaItem->id);

            if (!$isCompleted) {
                DB::rollBack();

                return [
                    'is_success' => false,
                    'message' => __('messages')['data_deleted_failed'],
                ];
            }

            // Delete uploaded file.
            Storage::disk('public')->delete($uploadedFilePaths);

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
