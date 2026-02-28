<?php

declare(strict_types=1);

namespace App\Http\Requests\Project;

/**
 * The request class for updating a project.
 */
class UpdateProjectRequest extends ProjectFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
