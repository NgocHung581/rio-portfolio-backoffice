<?php

declare(strict_types=1);

namespace App\UseCases\Project;

use App\Repositories\GalleryRepository;
use App\Repositories\MediaItemRepository;
use App\Repositories\ProjectRepository;
use Common\App\Enums\MediaFrame;
use Common\App\Enums\WebVisibility;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * The use case class for storing a new project.
 */
class StoreProjectUseCase
{
    public function __construct(
        private readonly ProjectRepository $projectRepository,
        private readonly GalleryRepository $galleryRepository,
        private readonly MediaItemRepository $mediaItemRepository
    ) {
    }

    public function __invoke(
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

            $newProject = $this->projectRepository->create(
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

            foreach ($galleries as $gallery) {
                $newGallery = $this->galleryRepository->create($newProject->id, $gallery['caption']);

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

            DB::commit();

            return ['success' => true, 'message' => __('messages')['data_created_successfully']];
        } catch (Exception $exception) {
            DB::rollBack();
            Log::error($exception);

            return ['success' => false, 'message' => __('messages')['internal_server_error']];
        }
    }
}
