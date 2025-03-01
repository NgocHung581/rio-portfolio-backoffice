<?php

declare(strict_types=1);

namespace App\Services\AlbumMediaItem;

use App\Constants\MediaFolderNamePrefix;
use App\Enums\FileType;
use App\Repositories\AlbumMediaItemRepository;
use App\Traits\MediaHelper;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CreateAlbumMediaItemsService
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
                $folderName = "media/album_{$albumId}/";

                match ($type) {
                    FileType::Image->value => $folderName .= MediaFolderNamePrefix::IMAGES,
                    FileType::Video->value => $folderName .= MediaFolderNamePrefix::VIDEOS,
                };

                // Create album media.
                $albumMediaItem = $this->albumMediaItemRepository->create(
                    $albumId,
                    $columnSpan,
                    $isDisplayedOnBanner
                );

                // Upload album media file.
                $result = Storage::disk('public')->putFileAs($folderName, $file, $fileName);

                if ($result === false) {
                    DB::rollBack();
                    $this->deleteFiles($uploadedFilePaths);

                    return [
                        'is_success' => false,
                        'message' => __('messages')['file_upload_failed'],
                    ];
                }

                $filePath = "/storage/{$result}";

                $uploadedFilePaths[] = $filePath;

                // Create album media item.
                $albumMediaItem->mediaFile()->create([
                    'file_type' => $type,
                    'file_path' => $filePath,
                    'file_name' => $fileName,
                    'file_size' => $file->getSize(),
                ]);
            }

            DB::commit();

            return [
                'is_success' => true,
                'message' => __('messages')['data_uploaded_successfully'],
            ];
        } catch (Exception|QueryException $e) {
            Log::error($e);
            DB::rollBack();
            $this->deleteFiles($uploadedFilePaths);

            return [
                'is_success' => false,
                'message' => __('messages')['internal_server_error'],
            ];
        }
    }

    /**
     * Delete files in the given file paths.
     */
    private function deleteFiles(array $filePaths): void
    {
        foreach ($filePaths as $filePath) {
            unlink(public_path($filePath));
        }
    }
}
