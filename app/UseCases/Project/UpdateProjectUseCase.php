<?php

declare(strict_types=1);

namespace App\UseCases\Project;

use App\Helpers\FileManager;
use App\Models\Project;
use App\Repositories\GalleryRepository;
use App\Repositories\MediaItemRepository;
use App\Repositories\ProjectRepository;
use Common\App\Enums\MediaFrame;
use Common\App\Enums\WebVisibility;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
        string $thumbnailFileUrl,
        array $galleries
    ): array {
        try {
            $deletedTmpFilePaths = [];
            $deletedPublicFilePaths = [];

            DB::beginTransaction();

            $originalThumbnailFilePath = $project->thumbnail_file_path;
            $newThumbnailFilePath = $originalThumbnailFilePath;
            $originalGalleryIds = $project->galleries->pluck('id')->all();

            // Case: Change thumbnail.
            if (str_starts_with($thumbnailFileUrl, config('filesystems.disks.tmp.url'))) {
                $thumbnailFileName = basename($thumbnailFileUrl);
                $newThumbnailFilePath = FileManager::moveTmpToPublic($thumbnailFileName, 'projects/thumbnails');
                $deletedTmpFilePaths[] = $thumbnailFileName;
                $deletedPublicFilePaths[] = $originalThumbnailFilePath;
            }

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
                $newThumbnailFilePath,
                $webVisibility
            );

            // Case: Add new galleries.
            $newGalleryIds = array_diff(array_column($galleries, 'id'), $originalGalleryIds);
            $newGalleries = array_filter($galleries, fn ($gallery) => in_array($gallery['id'], $newGalleryIds));

            foreach ($newGalleries as $gallery) {
                $newGallery = $this->galleryRepository->create($project->id, $gallery['caption']);

                foreach ($gallery['media_items'] as $mediaItem) {
                    $mediaItemFileUrl = $mediaItem['file_url'];
                    $mediaItemFileName = basename($mediaItemFileUrl);
                    $mediaItemFilePath = FileManager::moveTmpToPublic(
                        $mediaItemFileName,
                        "projects/{$project->id}/{$newGallery->id}"
                    );
                    $deletedTmpFilePaths[] = $mediaItemFileName;

                    $this->mediaItemRepository->create(
                        $newGallery->id,
                        $mediaItemFilePath,
                        MediaFrame::from($mediaItem['frame']),
                        $mediaItem['is_banner']
                    );
                }
            }

            // Case: Delete galleries.
            $deletedGalleryIds = array_diff($originalGalleryIds, array_column($galleries, 'id'));
            $deletedGalleries = $project->galleries->whereIn('id', $deletedGalleryIds);

            if (filled($deletedGalleries)) {
                $deletedMediaItems = $deletedGalleries->pluck('mediaItems')->flatten();
                $deletedMediaItemFilePaths = $deletedMediaItems->pluck('file_path')->toArray();
                $deletedMediaItemIds = $deletedMediaItems->pluck('id')->toArray();

                array_push($deletedPublicFilePaths, ...$deletedMediaItemFilePaths);

                $this->mediaItemRepository->bulkDelete($deletedMediaItemIds);
                $this->galleryRepository->bulkDelete($deletedGalleryIds);
            }

            // Case: Update galleries.
            $updatedGalleryIds = array_intersect(array_column($galleries, 'id'), $originalGalleryIds);
            $updatedGalleries = array_filter($galleries, fn ($gallery) => in_array($gallery['id'], $updatedGalleryIds));

            foreach ($updatedGalleries as $gallery) {
                $galleryId = (int) $gallery['id'];
                $originalMediaItems = $project->galleries->firstWhere('id', $galleryId)->mediaItems;
                $originalMediaItemIds = $originalMediaItems->pluck('id')->all();

                $this->galleryRepository->update($galleryId, $gallery['caption']);

                // Case: Add new media items.
                $newMediaItemIds = array_diff(array_column($gallery['media_items'], 'id'), $originalMediaItemIds);
                $newMediaItems = array_filter(
                    $gallery['media_items'],
                    fn ($mediaItem) => in_array($mediaItem['id'], $newMediaItemIds)
                );

                foreach ($newMediaItems as $mediaItem) {
                    $mediaItemFileUrl = $mediaItem['file_url'];
                    $mediaItemFileName = basename($mediaItemFileUrl);
                    $mediaItemFilePath = FileManager::moveTmpToPublic(
                        $mediaItemFileName,
                        "projects/{$project->id}/{$galleryId}"
                    );
                    $deletedTmpFilePaths[] = $mediaItemFileName;

                    $this->mediaItemRepository->create(
                        $galleryId,
                        $mediaItemFilePath,
                        MediaFrame::from($mediaItem['frame']),
                        $mediaItem['is_banner']
                    );
                }

                // Case: Delete media items.
                $deletedMediaItemIds = array_diff($originalMediaItemIds, array_column($gallery['media_items'], 'id'));
                $deletedMediaItems = $originalMediaItems->whereIn('id', $deletedMediaItemIds);
                $deletedMediaItemFilePaths = $deletedMediaItems->pluck('file_path')->toArray();

                array_push($deletedPublicFilePaths, ...$deletedMediaItemFilePaths);

                $this->mediaItemRepository->bulkDelete($deletedMediaItemIds);

                // Case: Update media items.
                $updatedMediaItemIds = array_intersect(array_column($gallery['media_items'], 'id'), $originalMediaItemIds);
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

            Storage::disk('tmp')->delete($deletedTmpFilePaths);
            Storage::disk('public')->delete($deletedPublicFilePaths);

            DB::commit();

            return ['success' => true, 'message' => __('messages')['data_updated_successfully']];
        } catch (Exception $exception) {
            DB::rollBack();
            Log::error($exception);

            return ['success' => false, 'message' => __('messages')['internal_server_error']];
        }
    }
}
