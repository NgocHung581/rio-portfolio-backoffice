<?php

declare(strict_types=1);

namespace App\UseCases\BehindTheScene;

use App\Repositories\MediaItemRepository;
use Common\App\Enums\MediaFrame;
use Common\App\Helpers\FileManager;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * The use case class for storing behind the scene media items.
 */
class StoreBehindTheScenesUseCase
{
    public function __construct(private readonly MediaItemRepository $mediaItemRepository)
    {
    }

    public function __invoke(array $items): array
    {
        try {
            $tmpFileNames = [];

            DB::beginTransaction();

            foreach ($items as $item) {
                $fileName = basename($item['file_url']);
                $filePath = FileManager::moveTmpToPublic($fileName, 'behind-the-scenes');
                $tmpFileNames[] = $fileName;

                // A media item without a gallery belongs to no project, and is always shown on the banner.
                $this->mediaItemRepository->create(null, $filePath, MediaFrame::from($item['frame']), true, 0);
            }

            Storage::disk('tmp')->delete($tmpFileNames);

            DB::commit();

            return ['success' => true, 'message' => __('messages')['data_created_successfully']];
        } catch (Exception $exception) {
            DB::rollBack();
            Log::error($exception);

            return ['success' => false, 'message' => __('messages')['internal_server_error']];
        }
    }
}
