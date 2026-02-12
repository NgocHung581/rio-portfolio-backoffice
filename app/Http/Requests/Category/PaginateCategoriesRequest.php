<?php

declare(strict_types=1);

namespace App\Http\Requests\Category;

use App\Enums\PerPage;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The request class for paginating categories.
 */
class PaginateCategoriesRequest extends FormRequest
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
            'keyword' => [
                'nullable',
                'string',
                'max:50',
            ],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'page' => filter_var($this->page, FILTER_VALIDATE_INT, ['options' => ['default' => 1]]),
            'per_page' => PerPage::resolve($this->per_page)->value,
        ]);
    }
}
