<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlbumResource extends JsonResource
{
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id'             => $this->id,
            'title_en'       => $this->title_en,
            'title_vi'       => $this->title_vi,
            'name_en'        => $this->name_en,
            'name_vi'        => $this->name_vi,
            'description_en' => $this->description_en,
            'description_vi' => $this->description_vi,
            'summary_en'     => $this->summary_en,
            'summary_vi'     => $this->summary_vi,
            'is_highlight'   => $this->is_highlight,
            'thumbnail'      => new MediaResource($this->thumbnail),
            'created_at'     => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at'     => $this->updated_at->format('Y-m-d H:i:s'),
            'deleted_at'     => $this->deleted_at?->format('Y-m-d H:i:s'),
        ];

        return $data;
    }
}
