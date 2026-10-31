<?php

declare(strict_types=1);

namespace App\UseCases\BehindTheScene;

use App\Repositories\MediaItemRepository;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * The use case class for bulk deleting behind the scene media items.
 */
class BulkDeleteBehindTheScenesUseCase
{
    public function __construct(private readonly MediaItemRepository $mediaItemRepository)
    {
    }

    public function __invoke(array $ids): array
    {
        try {
            DB::beginTransaction();

            $filePaths = $this->mediaItemRepository->findBehindTheScenesByIds($ids)->pluck('file_path')->all();

            $this->mediaItemRepository->bulkDelete($ids);

            DB::commit();

            Storage::disk('public')->delete($filePaths);

            return ['success' => true, 'message' => __('messages')['data_deleted_successfully']];
        } catch (Exception $exception) {
            DB::rollBack();
            Log::error($exception);

            return ['success' => false, 'message' => __('messages')['internal_server_error']];
        }
    }
}
