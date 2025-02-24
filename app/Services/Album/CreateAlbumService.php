<?php

declare(strict_types=1);

namespace App\Services\Album;

use App\Constants\MediaFolderNamePrefix;
use App\Enums\MediaType;
use App\Repositories\AlbumRepository;
use App\Traits\MediaHelper;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CreateAlbumService
{
    use MediaHelper;

    public function __construct(private readonly AlbumRepository $albumRepository)
    {
    }

    public function execute(array $data): array
    {
        try {
            DB::beginTransaction();

            // Create album.
            $album = $this->albumRepository->create(
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

            // Create album thumbnail.
            $thumbnailFile = $data['thumbnail_file'];
            $thumbnailFileName = $this->generateMediaFileName($thumbnailFile);
            $thumbnailFolderName = 'media/' . MediaFolderNamePrefix::THUMBNAILS;

            $album->thumbnail()->create([
                'type'      => MediaType::Image->value,
                'file_path' => "/storage/{$thumbnailFolderName}/{$thumbnailFileName}",
                'file_name' => $thumbnailFileName,
                'file_size' => $thumbnailFile->getSize(),
            ]);

            // Upload album thumbnail file.
            $result = Storage::disk('public')->putFileAs($thumbnailFolderName, $thumbnailFile, $thumbnailFileName);

            if ($result === false) {
                DB::rollBack();

                return [
                    'is_success' => false,
                    'message'    => __('messages')['file_upload_failed'],
                ];
            }

            DB::commit();

            return [
                'is_success' => true,
                'message'    => __('messages')['data_created_successfully'],
                'album'      => $album,
            ];
        } catch (Exception|QueryException $e) {
            Log::error($e);
            DB::rollBack();

            return [
                'is_success' => false,
                'message'    => __('messages')['internal_server_error'],
            ];
        }
    }
}
