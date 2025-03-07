<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MediaFileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'url' => asset("/storage/{$this->file_path}"),
            'type' => $this->type,
            'file_name' => $this->file_name,
            'file_size' => $this->file_size,
        ];
    }
}
