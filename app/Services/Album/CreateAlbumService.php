<?php

declare(strict_types=1);

namespace App\Services\Album;

use App\Constants\MediaFolderName;
use App\Constants\PublicStorageFolderPathPrefix;
use App\Repositories\AlbumRepository;
use App\Traits\MediaHelper;
use Common\App\Enums\MediaType;
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
        $albumMediaFolderPath = '';

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

            $albumMediaFolderPath = PublicStorageFolderPathPrefix::ALBUM_MEDIA . $album->id;
            $thumbnailFile = $data['thumbnail_file'];
            $thumbnailFileName = $this->generateMediaFileName($thumbnailFile);
            $thumbnailFolderPath = $albumMediaFolderPath . DIRECTORY_SEPARATOR . MediaFolderName::THUMBNAILS;

            // Upload album thumbnail file.
            $result = Storage::disk('common_public')->putFileAs($thumbnailFolderPath, $thumbnailFile, $thumbnailFileName);

            if ($result === false) {
                DB::rollBack();

                return [
                    'is_success' => false,
                    'message' => __('messages')['file_upload_failed'],
                ];
            }

            // Create album thumbnail.
            $album->thumbnail()->create([
                'type' => MediaType::Thumbnail->value,
                'file_path' => $result,
                'file_name' => $thumbnailFileName,
                'file_size' => $thumbnailFile->getSize(),
            ]);

            DB::commit();

            return [
                'is_success' => true,
                'message' => __('messages')['data_created_successfully'],
                'album' => $album,
            ];
        } catch (Exception|QueryException $e) {
            Log::error($e);
            DB::rollBack();
            Storage::disk('common_public')->deleteDirectory($albumMediaFolderPath);

            return [
                'is_success' => false,
                'message' => __('messages')['internal_server_error'],
            ];
        }
    }
}
