<?php

declare(strict_types=1);

namespace App\Services\Album;

use App\Models\Album;
use App\Repositories\AlbumRepository;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DeleteAlbumService
{
    public function __construct(private readonly AlbumRepository $albumRepository)
    {
    }

    public function execute(Album $album): array
    {
        try {
            DB::beginTransaction();

            // TODO: Delete media of album
            $isCompleted = $this->albumRepository->deleteAlbumById($album->id);

            if (!$isCompleted) {
                DB::rollBack();

                return [
                    'is_success' => false,
                    'message'    => __('messages')['data_disabled_failed'],
                ];
            }

            DB::commit();

            return [
                'is_success' => true,
                'message'    => __('messages')['data_disabled_successfully'],
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
