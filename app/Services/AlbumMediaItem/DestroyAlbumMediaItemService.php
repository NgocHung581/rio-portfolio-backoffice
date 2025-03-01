<?php

declare(strict_types=1);

namespace App\Services\AlbumMediaItem;

use App\Models\AlbumMediaItem;
use App\Repositories\AlbumMediaItemRepository;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DestroyAlbumMediaItemService
{
    public function __construct(private readonly AlbumMediaItemRepository $albumMediaItemRepository)
    {
    }

    public function execute(AlbumMediaItem $albumMediaItem): array
    {
        try {
            DB::beginTransaction();

            $albumMediaFilePath = $albumMediaItem->mediaFile->file_path;

            // Delete media file.
            $albumMediaItem->mediaFile()->delete();

            // Delete album media item.
            $isCompleted = $this->albumMediaItemRepository->destroyById($albumMediaItem->id);

            if (!$isCompleted) {
                DB::rollBack();

                return [
                    'is_success' => false,
                    'message' => __('messages')['data_bulk_deleted_failed'],
                ];
            }

            // Delete album media file.
            unlink(public_path($albumMediaFilePath));

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
