<?php

declare(strict_types=1);

namespace App\UseCases\Project;

use App\Repositories\GalleryRepository;
use App\Repositories\MediaItemRepository;
use App\Repositories\ProjectRepository;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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

            $deletedFilePaths = [];
            $deletedFolderPaths = [];

            $projects = $this->projectRepository->findManyByIds($ids);

            foreach ($projects as $project) {
                $deletedFilePaths[] = $project->thumbnail_file_path;
                $deletedFolderPaths[] = "projects/{$project->id}";
            }

            $deletedGalleries = $project->galleries;
            $deletedGalleryIds = $deletedGalleries->pluck('id')->toArray();
            $deletedMediaItemIds = $deletedGalleries->pluck('mediaItems')->flatten()->pluck('id')->toArray();


            $this->mediaItemRepository->bulkDelete($deletedMediaItemIds);
            $this->galleryRepository->bulkDelete($deletedGalleryIds);
            $this->projectRepository->bulkDelete($ids);

            DB::commit();

            Storage::disk('public')->delete($deletedFilePaths);

            foreach ($deletedFolderPaths as $deletedFolderPath) {
                Storage::disk('public')->deleteDirectory($deletedFolderPath);
            }

            return ['success' => true, 'message' => __('messages')['data_deleted_successfully']];
        } catch (Exception $exception) {
            DB::rollBack();
            Log::error($exception);

            return ['success' => false, 'message' => __('messages')['internal_server_error']];
        }
    }
}
