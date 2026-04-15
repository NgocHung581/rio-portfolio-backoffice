<?php

declare(strict_types=1);

namespace App\UseCases\Project;

use App\Repositories\GalleryRepository;
use App\Repositories\MediaItemRepository;
use App\Repositories\ProjectRepository;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * The use case class for bulk deleting projects.
 */
class BulkDeleteProjectsUseCase
{
    public function __construct(
        private readonly ProjectRepository $projectRepository,
        private readonly GalleryRepository $galleryRepository,
        private readonly MediaItemRepository $mediaItemRepository
    ) {
    }

    public function __invoke(array $ids): array
    {
        try {
            DB::beginTransaction();

            $projects = $this->projectRepository->findManyByIds($ids);
            $galleries = $projects->pluck('galleries')->flatten();
            $galleryIds = $galleries->pluck('id')->toArray();
            $mediaItemIds = $galleries->pluck('mediaItems')->flatten()->pluck('id')->toArray();


            $this->mediaItemRepository->bulkDelete($mediaItemIds);
            $this->galleryRepository->bulkDelete($galleryIds);
            $this->projectRepository->bulkDelete($ids);

            DB::commit();

            return ['success' => true, 'message' => __('messages')['data_deleted_successfully']];
        } catch (Exception $exception) {
            DB::rollBack();
            Log::error($exception);

            return ['success' => false, 'message' => __('messages')['internal_server_error']];
        }
    }
}
