<?php

declare(strict_types=1);

namespace App\UseCases\BehindTheScene;

use App\Models\MediaItem;
use App\Repositories\MediaItemRepository;
use Common\App\Enums\MediaFrame;
use Exception;
use Illuminate\Support\Facades\Log;

/**
 * The use case class for updating the frame of a behind the scene media item.
 */
class UpdateBehindTheSceneUseCase
{
    public function __construct(private readonly MediaItemRepository $mediaItemRepository)
    {
    }

    public function __invoke(MediaItem $mediaItem, MediaFrame $frame): array
    {
        try {
            $this->mediaItemRepository->update($mediaItem->id, $frame, true, $mediaItem->display_order);

            return ['success' => true, 'message' => __('messages')['data_updated_successfully']];
        } catch (Exception $exception) {
            Log::error($exception);

            return ['success' => false, 'message' => __('messages')['internal_server_error']];
        }
    }
}
