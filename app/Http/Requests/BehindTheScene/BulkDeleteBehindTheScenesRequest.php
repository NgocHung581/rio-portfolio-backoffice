<?php

declare(strict_types=1);

namespace App\Http\Requests\BehindTheScene;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * The request class for bulk deleting behind the scene media items.
 */
class BulkDeleteBehindTheScenesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'ids' => [
                'required',
                'array',
            ],
            'ids.*' => [
                'required',
                'integer',
                Rule::exists('media_items', 'id')->whereNull('gallery_id'),
            ],
        ];
    }
}
