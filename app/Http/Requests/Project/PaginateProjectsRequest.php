<?php

declare(strict_types=1);

namespace App\Http\Requests\Project;

use App\Enums\PerPage;
use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

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
            'category_ids' => [
                'nullable',
                'array',
            ],
            'category_ids.*' => [
                'required',
                'integer',
                Rule::exists(Category::class, 'id'),
            ],
            'keyword' => [
                'nullable',
                'string',
                'max:50',
            ],
        ];
    }

    /**
     * Add additional validation logic after the default validation rules are applied.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function(Validator $validator): void {
            if ($validator->errors()->hasAny('category_ids.*')) {
                $validator->errors()->add('category_ids', __('validation.exists'));
            }
        });
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
