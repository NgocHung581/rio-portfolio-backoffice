<?php

declare(strict_types=1);

namespace App\Http\Requests\Project;

use App\Models\Category;
use App\Models\Project;
use App\Repositories\CategoryRepository;
use App\Traits\ValidationHelper;
use Common\App\Enums\MediaFrame;
use Common\App\Enums\MediaType;
use Common\App\Enums\WebVisibility;
use Common\App\Traits\NumberHelper;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

/**
 * The common request class for storing and updating a project.
 */
class ProjectFormRequest extends FormRequest
{
    use NumberHelper;
    use ValidationHelper;

    public function __construct(private readonly CategoryRepository $categoryRepository)
    {
    }

    /**
    * Get the validation rules that apply to the request.
    */
    public function rules(): array
    {
        return [
            'category_id' => [
                'required',
                'integer',
                Rule::exists(Category::class, 'id'),
            ],
            'web_visibility' => [
                'required',
                'integer',
                Rule::enum(WebVisibility::class),
                function($attr, $value, $fail): void {
                    $hasMedia = array_any($this->galleries, fn ($gallery) => filled($gallery['media_items']));

                    if ($value === WebVisibility::Public->value && !$hasMedia) {
                        $fail(__('messages')['cannot_publish_project_without_media']);
                    }
                },
            ],
            'is_highlight' => [
                'required',
                'boolean',
            ],
            'title_en' => [
                'required',
                'string',
                'max:100',
                Rule::unique(Project::class, 'title_en')->ignore($this->project?->id),
            ],
            'title_vi' => [
                'required',
                'string',
                'max:100',
                Rule::unique(Project::class, 'title_vi')->ignore($this->project?->id),
            ],
            'description_en' => [
                'required',
                'string',
            ],
            'description_vi' => [
                'required',
                'string',
            ],
            'summary_en' => [
                'required',
                'string',
            ],
            'summary_vi' => [
                'required',
                'string',
            ],
            'thumbnail' => [
                'required',
                'array',
            ],
            'thumbnail.file_id' => [
                'required',
                'string',
            ],
            'thumbnail.file_name' => [
                'required',
                'string',
            ],
            'thumbnail.file_mime_type' => [
                'required',
                'string',
                Rule::in(explode(',', config('app.image_mine_types'))),
            ],
            'galleries' => [
                'nullable',
                'array',
            ],
            'galleries.*' => [
                'required',
                'array',
            ],
            'galleries.*.media_items' => [
                'required',
                'array',
                'max:5',
            ],
            'galleries.*.media_items.*' => [
                'required',
                'array',
            ],
            'galleries.*.media_items.*.file_id' => [
                'required',
                'string',
            ],
            'galleries.*.media_items.*.file_name' => [
                'required',
                'string',
            ],
            'galleries.*.media_items.*.file_mime_type' => $this->getMediaItemFileMimeTypeRules(),
            'galleries.*.media_items.*.frame' => [
                'required',
                'string',
                Rule::enum(MediaFrame::class),
            ],
            'galleries.*.media_items.*.is_banner' => [
                'required',
                'boolean',
            ],
            'galleries.*.caption' => [
                'nullable',
                'string',
                'max:255',
            ],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'category_id' => $this->parseInt($this->category_id),
            'is_highlight' => filter_var($this->is_highlight, FILTER_VALIDATE_BOOLEAN),
            'web_visibility' => $this->parseInt($this->web_visibility),
        ]);
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator)
    {
        $this->replaceIndexWithIdInErrors($validator);

        return parent::failedValidation($validator);
    }

    /**
     * Returns an array of validation rules for the media item file.
     */
    private function getMediaItemFileMimeTypeRules(): array
    {
        $rules = ['required', 'string'];
        $foundCategory = $this->categoryRepository->findById((int) $this->category_id);

        if (isset($foundCategory)) {
            if ($foundCategory->media_type === MediaType::Image) {
                $rules[] = Rule::in(explode(',', config('app.image_mine_types')));
            } else {
                $rules[] = Rule::in(explode(',', config('app.video_mine_types')));
            }
        }

        return $rules;
    }
}
