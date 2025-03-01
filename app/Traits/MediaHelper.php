<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Http\UploadedFile;

trait MediaHelper
{
    /**
     * Generate a random file name for media.
     */
    public function generateMediaFileName(UploadedFile $file): string
    {
        return 'media_' . str_replace('.', '', (string) microtime(true)) . '.' . $file->extension();
    }
}
