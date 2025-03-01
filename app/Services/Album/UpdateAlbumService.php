<?php

declare(strict_types=1);

namespace App\Services\Album;

use App\Constants\MediaFolderNamePrefix;
use App\Models\Album;
use App\Repositories\AlbumRepository;
use App\Traits\MediaHelper;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UpdateAlbumService
{
    use MediaHelper;

    public function __construct(private readonly AlbumRepository $albumRepository)
    {
    }

    public function execute(Album $album, array $data): array
    {
        $uploadedFilePath = '';

        try {
            DB::beginTransaction();

            // Update album.
            $isCompleted = $this->albumRepository->update(
                $album->id,
                $data['title_en'],
                $data['title_vi'],
                $data['name_en'],
                $data['name_vi'],
                $data['description_en'],
                $data['description_vi'],
                $data['summary_en'],
                $data['summary_vi'],
                $data['is_highlight']
            );

            if (!$isCompleted) {
                DB::rollBack();

                return [
                    'is_success' => false,
                    'message' => __('messages')['data_updated_failed'],
                ];
            }

            // Update album thumbnail.
            $newThumbnailFile = $data['thumbnail_file'];

            if (isset($newThumbnailFile)) {
                $oldThumbnailFilePath = $album->thumbnail->file_path;
                $thumbnailFolderName = 'media/' . MediaFolderNamePrefix::THUMBNAILS . '/album';
                $newThumbnailFileName = $this->generateMediaFileName($newThumbnailFile);

                // Upload new album thumbnail.
                $result = Storage::disk('public')->putFileAs($thumbnailFolderName, $newThumbnailFile, $newThumbnailFileName);

                if ($result === false) {
                    DB::rollBack();

                    return [
                        'is_success' => false,
                        'message' => __('messages')['file_upload_failed'],
                    ];
                }

                $newThumbnailFilePath = "/storage/{$result}";
                $uploadedFilePath = $newThumbnailFilePath;

                // Save new album thumbnail.
                $updatedCount = $album->thumbnail()->update([
                    'file_path' => $newThumbnailFilePath,
                    'file_name' => $newThumbnailFileName,
                    'file_size' => $newThumbnailFile->getSize(),
                ]);

                if ($updatedCount !== 1) {
                    DB::rollBack();
                    unlink(public_path($uploadedFilePath));

                    return [
                        'is_success' => false,
                        'message' => __('messages')['data_updated_failed'],
                    ];
                }

                // Delete old album thumbnail.
                unlink(public_path($oldThumbnailFilePath));
            }

            DB::commit();

            return [
                'is_success' => true,
                'message' => __('messages')['data_updated_successfully'],
            ];
        } catch (Exception|QueryException $e) {
            Log::error($e);
            DB::rollBack();
            unlink(public_path($uploadedFilePath));

            return [
                'is_success' => false,
                'message' => __('messages')['internal_server_error'],
            ];
        }
    }
}
