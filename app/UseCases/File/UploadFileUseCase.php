<?php

declare(strict_types=1);

namespace App\UseCases\File;

use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * The use case class for uploading a file.
 */
class UploadFileUseCase
{
    public function __invoke(UploadedFile $file): array
    {
        try {
            $path = $file->store('', 'tmp');
            $url = Storage::disk('tmp')->url($path);

            return ['success' => true, 'file_url' => $url];
        } catch (Exception $e) {
            Log::error($e);

            return ['success' => false, 'message' => __('messages')['file_uploaded_failed']];
        }
    }
}
