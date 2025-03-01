<?php

declare(strict_types=1);

namespace App\Services\AlbumMedia;

use App\Repositories\AlbumMediaItemRepository;
use App\Repositories\MediaFileRepository;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DeleteAlbumMediaItemsService
{
    public function __construct(
        private readonly AlbumMediaItemRepository $albumMediaItemRepository,
        private readonly MediaFileRepository $mediaRepository
    ) {
    }

    public function execute(array $ids): array
    {
        try {
            $albumMediaList = $this->albumMediaItemRepository->findByIds($ids, ['albumMediaFile']);
            $mediaIds = [];
            $mediaFilePaths = [];

            foreach ($albumMediaList as $albumMedia) {
                $mediaIds[] = $albumMedia->albumMediaFile->id;
                $mediaFilePaths[] = $albumMedia->albumMediaFile->file_path;
            }

            DB::beginTransaction();

            // Delete album media relation.

            DB::commit();

            return [
                'is_success' => true,
                'message' => __('messages')['data_bulk_deleted_successfully'],
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
