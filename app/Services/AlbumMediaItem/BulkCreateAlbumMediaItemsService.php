<?php

declare(strict_types=1);

namespace App\Services\AlbumMediaItem;

use App\Constants\MediaFolderName;
use App\Constants\PublicStorageFolderPathPrefix;
use App\Enums\MediaType;
use App\Repositories\AlbumMediaItemRepository;
use App\Traits\MediaHelper;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class BulkCreateAlbumMediaItemsService
{
    use MediaHelper;

    public function __construct(private readonly AlbumMediaItemRepository $albumMediaItemRepository)
    {
    }

    public function execute(int $albumId, array $data): array
    {
        $uploadedFilePaths = [];

        try {
            DB::beginTransaction();

            foreach ($data as $item) {
                $type = $item['type'];
                $columnSpan = $item['column_span'];
                $isDisplayedOnBanner = $item['is_displayed_on_banner'];
                $file = $item['file'];
                $fileName = $this->generateMediaFileName($file);
                $folderPath = PublicStorageFolderPathPrefix::ALBUM_MEDIA . $albumId . DIRECTORY_SEPARATOR;

                match ($type) {
                    MediaType::Image->value => $folderPath .= MediaFolderName::IMAGES,
                    MediaType::Video->value => $folderPath .= MediaFolderName::VIDEOS,
                };

                // Create album media.
                $albumMediaItem = $this->albumMediaItemRepository->create(
                    $albumId,
                    $columnSpan,
                    $isDisplayedOnBanner
                );

                // Upload album media file.
                $mediaFilePath = Storage::disk('common_public')->putFileAs($folderPath, $file, $fileName);

                if ($mediaFilePath === false) {
                    DB::rollBack();
                    Storage::disk('common_public')->delete($uploadedFilePaths);

                    return [
                        'is_success' => false,
                        'message' => __('messages')['file_upload_failed'],
                    ];
                }

                $uploadedFilePaths[] = $mediaFilePath;

                // Create album media item.
                $albumMediaItem->mediaFile()->create([
                    'type' => $type,
                    'file_path' => $mediaFilePath,
                    'file_name' => $fileName,
                    'file_size' => $file->getSize(),
                ]);

                // Create and upload video thumbnail.
                if ($type === MediaType::Video->value) {
                    $videoThumbnailFile = $item['video_thumbnail_file'];
                    $videoThumbnailFileName = $this->generateMediaFileName($videoThumbnailFile);
                    $videoThumbnailFolderPath = PublicStorageFolderPathPrefix::ALBUM_MEDIA . $albumId . DIRECTORY_SEPARATOR . MediaFolderName::THUMBNAILS;

                    $videoThumbnailFilePath = Storage::disk('common_public')
                        ->putFileAs($videoThumbnailFolderPath, $videoThumbnailFile, $videoThumbnailFileName);

                    if ($videoThumbnailFilePath === false) {
                        DB::rollBack();
                        Storage::disk('common_public')->delete($uploadedFilePaths);

                        return [
                            'is_success' => false,
                            'message' => __('messages')['file_upload_failed'],
                        ];
                    }

                    $uploadedFilePaths[] = $videoThumbnailFilePath;

                    $albumMediaItem->videoThumbnailFile()->create([
                        'type' => MediaType::Thumbnail->value,
                        'file_path' => $videoThumbnailFilePath,
                        'file_name' => $videoThumbnailFileName,
                        'file_size' => $videoThumbnailFile->getSize(),
                    ]);
                }
            }

            DB::commit();

            return [
                'is_success' => true,
                'message' => __('messages')['data_uploaded_successfully'],
            ];
        } catch (Exception|QueryException $e) {
            Log::error($e);
            DB::rollBack();
            Storage::disk('common_public')->delete($uploadedFilePaths);

            return [
                'is_success' => false,
                'message' => __('messages')['internal_server_error'],
            ];
        }
    }
}
