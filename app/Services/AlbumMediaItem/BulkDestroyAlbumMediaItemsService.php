<?php

declare(strict_types=1);

namespace App\Services\AlbumMediaItem;

use App\Repositories\AlbumMediaItemRepository;
use App\Repositories\MediaFileRepository;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class BulkDestroyAlbumMediaItemsService
{
    public function __construct(
        private readonly AlbumMediaItemRepository $albumMediaItemRepository,
        private readonly MediaFileRepository $mediaFileRepository
    ) {
    }

    public function execute(array $ids): array
    {
        try {
            $albumMediaItems = $this->albumMediaItemRepository->findByIds($ids, ['mediaFile']);
            $mediaFileIds = [];
            $mediaFilePaths = [];


            foreach ($albumMediaItems as $albumMediaItem) {
                $mediaFileIds[] = $albumMediaItem->mediaFile->id;
                $mediaFilePaths[] = $albumMediaItem->mediaFile->file_path;

                if (isset($albumMediaItem->videoThumbnailFile)) {
                    $mediaFileIds[] = $albumMediaItem->videoThumbnailFile->id;
                    $mediaFilePaths[] = $albumMediaItem->videoThumbnailFile->file_path;
                }
            }

            DB::beginTransaction();

            // Delete media files.
            $isCompletedMediaFiles = $this->mediaFileRepository->bulkDestroyByIds($mediaFileIds);

            if (!$isCompletedMediaFiles) {
                DB::rollBack();

                return [
                    'is_success' => false,
                    'message' => __('messages')['data_deleted_failed'],
                ];
            }

            // Delete album media items.
            $isCompletedAlbumMediaItems = $this->albumMediaItemRepository->bulkDestroyByIds($ids);

            if (!$isCompletedAlbumMediaItems) {
                DB::rollBack();

                return [
                    'is_success' => false,
                    'message' => __('messages')['data_deleted_failed'],
                ];
            }

            // Delete uploaded files.
            Storage::disk('public')->delete($mediaFilePaths);

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
