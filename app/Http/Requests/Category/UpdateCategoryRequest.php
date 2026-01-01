<?php

declare(strict_types=1);

namespace App\Http\Requests\Category;

/**
 * The request class for updating a category.
 */
class UpdateCategoryRequest extends CategoryFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
