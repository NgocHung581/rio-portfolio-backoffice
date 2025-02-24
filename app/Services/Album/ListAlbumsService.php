<?php

declare(strict_types=1);

namespace App\Services\Album;

use App\Repositories\AlbumRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListAlbumsService
{
    public function __construct(private readonly AlbumRepository $albumRepository)
    {
    }

    public function execute(int $perPage, ?string $keyword): LengthAwarePaginator
    {
        return $this->albumRepository->findAlbums($perPage, $keyword, ['thumbnail']);
    }
}
