<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlbumMediaResource extends JsonResource
{
    public static $wrap;

    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $this->loadMissing('albumMediaFile');

        return [
            'id' => $this->id,
            'album_id' => $this->album_id,
            'type' => $this->albumMediaFile->type,
            'file_path' => asset($this->albumMediaFile->file_path),
            'file_size' => $this->albumMediaFile->file_size,
            'file_name' => $this->albumMediaFile->file_name,
            'column_span' => $this->column_span,
            'is_displayed_on_banner' => $this->is_displayed_on_banner,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
