<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AboutPageInformationResource extends JsonResource
{
    public static $wrap;

    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        if (is_null($this->resource)) {
            return ['description' => '', 'partner_logos' => []];
        }

        $partnerLogos = $this->partnerLogos
            ->map(fn($file) => [
                'url' => asset("/storage/{$file->file_path}"),
                'file_name' => $file->file_name,
                'file_size' => $file->file_size,
                'file_path' => $file->file_path,
            ])
            ->toArray();

        return [
            'description' => $this->description,
            'partner_logos' => $partnerLogos,
        ];
    }
}
