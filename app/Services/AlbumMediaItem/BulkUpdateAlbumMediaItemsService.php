<?php

declare(strict_types=1);

namespace App\Services\AlbumMediaItem;

use App\Repositories\AlbumMediaItemRepository;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BulkUpdateAlbumMediaItemsService
{
    public function __construct(private readonly AlbumMediaItemRepository $albumMediaItemRepository)
    {
    }

    public function execute(array $data): array
    {
        try {
            DB::beginTransaction();

            foreach ($data as $value) {
                $isCompleted = $this->albumMediaItemRepository->update(
                    $value['id'],
                    $value['column_span'],
                    $value['is_displayed_on_banner']
                );

                if (!$isCompleted) {
                    DB::rollBack();

                    return [
                        'is_success' => false,
                        'message' => __('messages')['data_updated_failed'],
                    ];
                }
            }

            DB::commit();

            return [
                'is_success' => true,
                'message' => __('messages')['data_updated_successfully'],
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
