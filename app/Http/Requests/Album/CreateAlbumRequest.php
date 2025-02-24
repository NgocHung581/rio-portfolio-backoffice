<?php

declare(strict_types=1);

namespace App\Http\Requests\Album;

class CreateAlbumRequest extends CommonAlbumRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
