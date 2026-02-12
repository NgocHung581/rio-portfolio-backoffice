<?php

declare(strict_types=1);

namespace App\Http\Requests\Project;

use App\Enums\MediaFrame;
use App\Models\Category;
use App\Repositories\CategoryRepository;
use App\Traits\ReplaceIndexWithKeyInErrors;
use Common\App\Enums\MediaType;
use Common\App\Enums\WebVisibility;
use Common\App\Models\Project;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

/**
 * The request class for storing a project.
 */
class StoreProjectRequest extends FormRequest
{
    use ReplaceIndexWithKeyInErrors;

    public function __construct(private readonly CategoryRepository $categoryRepository)
    {
    }

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
                Rule::unique(Project::class, 'title_en'),
            ],
            'title_vi' => [
                'required',
                'string',
                'max:100',
                Rule::unique(Project::class, 'title_vi'),
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
            'thumbnail.file' => [
                'required',
                File::image()->types(config('app.image_mine_types'))->max(config('app.image_size_limit') / 1024),
            ],
            'thumbnail.frame' => [
                'nullable',
                Rule::requiredIf(filled($this->thumbnail['file'] ?? null)),
                'string',
                Rule::enum(MediaFrame::class),
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
            'galleries.*.media_items.*.file' => $this->getMediaItemFileRules(),
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
        $parsedCategoryId = filter_var($this->category_id, FILTER_VALIDATE_INT, FILTER_NULL_ON_FAILURE);
        $parsedWebVisibility = filter_var($this->web_visibility, FILTER_VALIDATE_INT, FILTER_NULL_ON_FAILURE);
        $galleries = [];

        if (isset($this->galleries)) {
            foreach ($this->galleries as $gallery) {
                $mediaItems = [];

                foreach (($gallery['media_items'] ?? []) as $mediaItem) {
                    $mediaItem['is_banner'] = filter_var($mediaItem['is_banner'], FILTER_VALIDATE_BOOLEAN);
                    $mediaItems[] = $mediaItem;
                }

                $gallery['media_items'] = $mediaItems;
                $galleries[] = $gallery;
            }
        }

        $this->merge([
            'category_id' => $parsedCategoryId ?? $this->category_id,
            'is_highlight' => filter_var($this->is_highlight, FILTER_VALIDATE_BOOLEAN),
            'web_visibility' => $parsedWebVisibility ?? $this->web_visibility,
            'galleries' => $galleries,
        ]);
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator)
    {
        $this->replaceIndexWithKey($validator);

        return parent::failedValidation($validator);
    }

    /**
     * Returns an array of validation rules for the media item file.
     */
    private function getMediaItemFileRules(): array
    {
        $rules = ['required'];
        $foundCategory = $this->categoryRepository->findById((int) $this->category_id);

        if (isset($foundCategory)) {
            if ($foundCategory->media_type === MediaType::Image) {
                $rules[] = File::image()->types(config('app.image_mine_types'))->max(config('app.image_size_limit') / 1024);
            } else {
                $rules[] = 'mimetypes:' . config('app.video_mine_types');
                $rules[] = 'max:' . (config('app.video_size_limit') / 1024);
            }
        }

        return $rules;
    }
}
