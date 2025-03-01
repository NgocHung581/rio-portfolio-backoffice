<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\AlbumMedia;

class AlbumMediaRepository
{
    /**
     * Create a new album media.
     */
    public function create(
        int $albumId,
        int $columnSpan,
        bool $isDisplayedOnBanner
    ): AlbumMedia {
        return AlbumMedia::query()->create([
            'album_id' => $albumId,
            'column_span' => $columnSpan,
            'is_displayed_on_banner' => $isDisplayedOnBanner,
        ]);
    }
}
