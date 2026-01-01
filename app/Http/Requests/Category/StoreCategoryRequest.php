<?php

declare(strict_types=1);

namespace App\Http\Requests\Category;

/**
 * The request class for storing a new category.
 */
class StoreCategoryRequest extends CategoryFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
