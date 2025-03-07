<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlbumMediaItemResource extends JsonResource
{
    public static $wrap;

    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'album_id' => $this->album_id,
            'type' => $this->mediaFile->type,
            'url' => asset("/storage/{$this->mediaFile->file_path}"),
            'file_size' => $this->mediaFile->file_size,
            'file_name' => $this->mediaFile->file_name,
            'column_span' => $this->column_span,
            'is_displayed_on_banner' => $this->is_displayed_on_banner,
        ];

        if (isset($this->videoThumbnailFile)) {
            $data['video_thumbnail_url'] = asset("/storage/{$this->videoThumbnailFile->file_path}");
        }

        return $data;
    }
}
