<?php

declare(strict_types=1);

namespace App\Http\Requests\Category;

use App\Models\Category;
use Closure;
use Common\App\Enums\MediaType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * The common request class for storing and updating a category.
 */
class CategoryFormRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name_en' => [
                'required',
                'string',
                'max:25',
                Rule::unique(Category::class, 'name_en')->ignore($this->category?->id),
            ],
            'name_vi' => [
                'required',
                'string',
                'max:25',
                Rule::unique(Category::class, 'name_vi')->ignore($this->category?->id),
            ],
            'media_type' => [
                'required',
                'integer',
                Rule::enum(MediaType::class),
                function(string $attribute, mixed $value, Closure $fail): void {
                    if ($this?->category->projects->isNotEmpty() && $value !== $this?->category->media_type->value) {
                        $fail(__('messages')['media_type_locked']);
                    }
                },
            ],
        ];
    }
}
