<?php

declare(strict_types=1);

namespace App\Http\Requests\Category;

use App\Enums\PerPage;
use Common\App\Enums\WebVisibility;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'web_visibilities' => [
                'nullable',
                'array',
            ],
            'web_visibilities.*' => [
                'required',
                Rule::enum(WebVisibility::class),
            ],
            'keyword' => [
                'nullable',
                'string',
                'max:25',
            ],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if (isset($this->web_visibilities)) {
            $this->merge([
                'web_visibilities' => array_map(
                    fn ($webVisibility) => filter_var(
                        $webVisibility,
                        FILTER_VALIDATE_INT,
                        ['options' => ['default' => $webVisibility]]
                    ),
                    $this->web_visibilities
                ),
            ]);
        }

        $this->merge([
            'page' => filter_var($this->page, FILTER_VALIDATE_INT, ['options' => ['default' => 1]]),
            'per_page' => PerPage::resolve($this->per_page)->value,
        ]);
    }
}
