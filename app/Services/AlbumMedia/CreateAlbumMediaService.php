<?php

declare(strict_types=1);

namespace App\Services\AlbumMedia;

use App\Constants\MediaFolderNamePrefix;
use App\Enums\MediaType;
use App\Repositories\AlbumMediaRepository;
use App\Traits\MediaHelper;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CreateAlbumMediaService
{
    use MediaHelper;

    public function __construct(private readonly AlbumMediaRepository $albumMediaRepository)
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
                $folderName = 'media/';

                match ($type) {
                    MediaType::Image->value => $folderName .= MediaFolderNamePrefix::IMAGES,
                    MediaType::Video->value => $folderName .= MediaFolderNamePrefix::VIDEOS,
                };

                $folderName .= "/album_{$albumId}";

                // Create album media.
                $albumMedia = $this->albumMediaRepository->create(
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
                $albumMedia->albumMediaFile()->create([
                    'type' => $type,
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
