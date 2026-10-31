<?php

declare(strict_types=1);

namespace App\UseCases\BehindTheScene;

use App\Repositories\MediaItemRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * The use case class for getting the behind the scene media items.
 */
class GetBehindTheScenesUseCase
{
    public function __construct(private readonly MediaItemRepository $mediaItemRepository)
    {
    }

    public function __invoke(): Collection
    {
        return $this->mediaItemRepository->getBehindTheScenes();
    }
}
