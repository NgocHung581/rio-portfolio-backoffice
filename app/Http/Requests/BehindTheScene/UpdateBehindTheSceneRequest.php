<?php

declare(strict_types=1);

namespace App\Http\Requests\BehindTheScene;

use Common\App\Enums\MediaFrame;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * The request class for updating a behind the scene media item.
 */
class UpdateBehindTheSceneRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only media items that do not belong to a project can be updated here.
        return $this->mediaItem?->gallery_id === null;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'frame' => [
                'required',
                'string',
                Rule::enum(MediaFrame::class),
            ],
        ];
    }
}
