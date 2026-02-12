<?php

declare(strict_types=1);

namespace App\Http\Requests\Project;

use App\Enums\PerPage;
use App\Models\Category;
use Common\App\Enums\WebVisibility;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * The request class for paginating projects.
 */
class PaginateProjectsRequest extends FormRequest
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
            'category_id' => [
                'nullable',
                'integer',
                Rule::exists(Category::class, 'id'),
            ],
            'is_highlight' => [
                'nullable',
                'boolean',
            ],
            'web_visibilities' => [
                'nullable',
                'array',
                function($attr, $value, $fail): void {
                    foreach ($value as $webVisibility) {
                        if (!in_array($webVisibility, WebVisibility::cases())) {
                            $fail(__('validation.enum'));
                        }
                    }
                },
            ],
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
