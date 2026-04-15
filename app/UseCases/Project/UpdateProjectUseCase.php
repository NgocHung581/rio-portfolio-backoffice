<?php

declare(strict_types=1);

namespace App\UseCases\Project;

use App\Models\Project;
use App\Repositories\GalleryRepository;
use App\Repositories\MediaItemRepository;
use App\Repositories\ProjectRepository;
use Common\App\Enums\MediaFrame;
use Common\App\Enums\WebVisibility;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * The use case class for updating a project.
 */
class UpdateProjectUseCase
{
    public function __construct(
        private readonly ProjectRepository $projectRepository,
        private readonly GalleryRepository $galleryRepository,
        private readonly MediaItemRepository $mediaItemRepository
    ) {
    }

    public function __invoke(
        Project $project,
        int $categoryId,
        string $titleEn,
        string $titleVi,
        string $descriptionEn,
        string $descriptionVi,
        string $summaryEn,
        string $summaryVi,
        bool $isHighlight,
        WebVisibility $webVisibility,
        array $thumbnail,
        array $galleries
    ): array {
        try {
            DB::beginTransaction();

            // Update project.
            $this->projectRepository->update(
                $project->id,
                $categoryId,
                $titleEn,
                $titleVi,
                $descriptionEn,
                $descriptionVi,
                $summaryEn,
                $summaryVi,
                $isHighlight,
                $thumbnail['file_id'],
                $thumbnail['file_name'],
                $thumbnail['file_mime_type'],
                $webVisibility
            );

            // Case: Add new galleries.
            $newGalleryIds = array_diff(array_column($galleries, 'id'), $project->galleries->pluck('id')->toArray());
            $newGalleries = array_filter($galleries, fn ($gallery) => in_array($gallery['id'], $newGalleryIds));

            foreach ($newGalleries as $gallery) {
                $newGallery = $this->galleryRepository->create($project->id, $gallery['caption']);

                foreach ($gallery['media_items'] as $mediaItem) {
                    $this->mediaItemRepository->create(
                        $newGallery->id,
                        $mediaItem['file_id'],
                        $mediaItem['file_name'],
                        $mediaItem['file_mime_type'],
                        MediaFrame::from($mediaItem['frame']),
                        $mediaItem['is_banner']
                    );
                }
            }

            // Case: Delete galleries.
            $deletedGalleryIds = array_diff($project->galleries->pluck('id')->toArray(), array_column($galleries, 'id'));
            $deletedGalleries = $project->galleries->whereIn('id', $deletedGalleryIds);
            $deletedMediaItems = $deletedGalleries->pluck('mediaItems')->flatten();
            $deletedMediaItemIds = $deletedMediaItems->pluck('id')->toArray();

            $this->mediaItemRepository->bulkDelete($deletedMediaItemIds);
            $this->galleryRepository->bulkDelete($deletedGalleryIds);

            // Case: Update galleries.
            $updatedGalleryIds = array_intersect(
                array_column($galleries, 'id'),
                $project->galleries->pluck('id')->toArray()
            );
            $updatedGalleries = array_filter($galleries, fn ($gallery) => in_array($gallery['id'], $updatedGalleryIds));

            foreach ($updatedGalleries as $gallery) {
                $galleryId = (int) $gallery['id'];
                $originalMediaItems = $project->galleries->firstWhere('id', $galleryId)->mediaItems;

                $this->galleryRepository->update($galleryId, $gallery['caption']);

                // Case: Add new media items.
                $newMediaItemIds = array_diff(
                    array_column($gallery['media_items'], 'id'),
                    $originalMediaItems->pluck('id')->toArray()
                );
                $newMediaItems = array_filter(
                    $gallery['media_items'],
                    fn ($mediaItem) => in_array($mediaItem['id'], $newMediaItemIds)
                );

                foreach ($newMediaItems as $mediaItem) {
                    $this->mediaItemRepository->create(
                        $galleryId,
                        $mediaItem['file_id'],
                        $mediaItem['file_name'],
                        $mediaItem['file_mime_type'],
                        MediaFrame::from($mediaItem['frame']),
                        $mediaItem['is_banner']
                    );
                }

                // Case: Delete media items.
                $deletedMediaItemIds = array_diff(
                    $originalMediaItems->pluck('id')->toArray(),
                    array_column($gallery['media_items'], 'id')
                );
                $deletedMediaItems = $originalMediaItems->whereIn('id', $deletedMediaItemIds);

                $this->mediaItemRepository->bulkDelete($deletedMediaItemIds);

                // Case: Update media items.
                $updatedMediaItemIds = array_intersect(
                    array_column($gallery['media_items'], 'id'),
                    $originalMediaItems->pluck('id')->toArray()
                );
                $updatedMediaItems = array_filter(
                    $gallery['media_items'],
                    fn ($mediaItem) => in_array($mediaItem['id'], $updatedMediaItemIds)
                );

                foreach ($updatedMediaItems as $mediaItem) {
                    $mediaItemId = (int) $mediaItem['id'];

                    $this->mediaItemRepository->update(
                        $mediaItemId,
                        MediaFrame::from($mediaItem['frame']),
                        $mediaItem['is_banner']
                    );
                }
            }

            DB::commit();

            return ['success' => true, 'message' => __('messages')['data_updated_successfully']];
        } catch (Exception $exception) {
            DB::rollBack();
            Log::error($exception);

            return ['success' => false, 'message' => __('messages')['internal_server_error']];
        }
    }
}
