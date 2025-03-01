<?php

declare(strict_types=1);

namespace App\Http\Requests\Album;

use App\Constants\PerPage;
use Illuminate\Foundation\Http\FormRequest;

class ListAlbumsRequest extends FormRequest
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
            'per_page' => [
                'nullable',
                'integer',
                'min:1',
            ],
            'keyword' => [
                'nullable',
                'string',
                'max:50',
            ],
        ];
    }

    /**
     * Handle data after passed validation.
     */
    protected function passedValidation(): void
    {
        $this->merge([
            'per_page' => isset($this->per_page) ? (int) $this->per_page : PerPage::DEFAULT,
        ]);
    }
}
