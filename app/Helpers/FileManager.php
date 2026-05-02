<?php

declare(strict_types=1);

namespace App\Helpers;

use Exception;
use Illuminate\Support\Facades\Storage;

/**
 * The helper class for file manager.
 */
class FileManager
{
    /**
     * Move a temporary file to a public directory.
     */
    public static function moveTmpToPublic(string $tmpFileName, string $publicDestination): string
    {
        $tmpDisk = Storage::disk('tmp');
        $publicDisk = Storage::disk('public');
        $fileContent = $tmpDisk->get($tmpFileName);
        $filePath = "{$publicDestination}/{$tmpFileName}";

        $isSuccessful = $publicDisk->put($filePath, $fileContent);

        if (!$isSuccessful) {
            throw new Exception('Failed to move temporary file to public directory.');
        }

        return $filePath;
    }
}
