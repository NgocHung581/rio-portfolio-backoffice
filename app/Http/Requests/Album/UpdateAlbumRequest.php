<?php

declare(strict_types=1);

namespace App\Http\Requests\Album;

use App\Repositories\AlbumRepository;

class UpdateAlbumRequest extends CommonAlbumRequest
{
    public function __construct(private readonly AlbumRepository $albumRepository)
    {
        parent::__construct($this->albumRepository);
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
