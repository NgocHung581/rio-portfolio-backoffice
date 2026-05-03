<?php

declare(strict_types=1);

namespace App\Http\Requests\Project;

use App\Constants\MediaSetting;
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
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

/**
 * The common request class for storing and updating a project.
 */
class ProjectFormRequest extends FormRequest
{
    use NumberHelper;
    use ValidationHelper;

    private array $validImageMimeTypes;

    private array $validVideoMimeTypes;

    private int $imageSizeLimit;

    private int $videoSizeLimit;

    public function __construct(private readonly CategoryRepository $categoryRepository)
    {
        $this->validImageMimeTypes = explode(',', config('app.image_mine_types'));
        $this->validVideoMimeTypes = explode(',', config('app.video_mine_types'));
        $this->imageSizeLimit = config('app.image_size_limit');
        $this->videoSizeLimit = config('app.video_size_limit');
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
                'max:' . MediaSetting::MAX_MEDIA_COUNT_PER_GALLERY,
            ],
            'galleries.*.media_items.*' => [
                'required',
                'array',
            ],
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
     * Add additional validation logic after the default validation rules are applied.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function(Validator $validator): void {
            $this->validateThumbnailFile($validator);
            $this->validateMediaItemFiles($validator);
        });
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'category_id' => $this->parseInt($this->category_id),
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
     * Validate the thumbnail file.
     */
    private function validateThumbnailFile(Validator $validator): void
    {
        if (str_starts_with($this->thumbnail_file_url, config('filesystems.disks.public.url'))) {
            return;
        }

        if (empty($this->thumbnail_file_url)) {
            $validator->errors()->add('thumbnail_file', __('validation.required'));

            return;
        }

        $disk = Storage::disk('tmp');
        $fileName = basename($this->thumbnail_file_url);

        if (!$disk->exists($fileName)) {
            $validator->errors()->add('thumbnail_file_url', __('messages')['file_uploaded_failed']);

            return;
        }

        $mimeType = $disk->mimeType($fileName);
        $size = $disk->size($fileName);

        // Validate mime.
        if (!in_array($mimeType, $this->validImageMimeTypes)) {
            $validator->errors()->add('thumbnail_file_url', __('validation.mimetypes', [
                'values' => implode(', ', $this->validImageMimeTypes),
            ]));
        }

        // Validate size.
        if ($size > $this->imageSizeLimit) {
            $validator->errors()->add('thumbnail_file_url', __('validation.file_size_limit', [
                'image_size_max' => $this->imageSizeLimit / (1024 ** 2),
                'video_size_max' => $this->videoSizeLimit / (1024 ** 2),
            ]));
        }
    }

    /**
     * Validate the media item files.
     */
    private function validateMediaItemFiles(Validator $validator): void
    {
        if ($validator->errors()->has('category_id')) {
            return;
        }

        $selectedCategory = $this->categoryRepository->findById($this->category_id);
        $rules = $selectedCategory->media_type === MediaType::Image
                ? ['mimes' => $this->validImageMimeTypes, 'size_limit' => $this->imageSizeLimit]
                : ['mimes' => $this->validVideoMimeTypes, 'size_limit' => $this->videoSizeLimit];
        $disk = Storage::disk('tmp');

        foreach ($this->galleries as $galleryKey => $gallery) {
            foreach ($gallery['media_items'] as $mediaItemKey => $mediaItem) {
                $mediaItemFileUrl = $mediaItem['file_url'];

                if (str_starts_with($mediaItemFileUrl, config('filesystems.disks.public.url'))) {
                    continue;
                }

                $errorKey = "galleries.{$galleryKey}.media_items.{$mediaItemKey}.file_url";
                $fileName = basename($mediaItemFileUrl);

                if (!$disk->exists($fileName)) {
                    $validator->errors()->add($errorKey, __('messages')['file_uploaded_failed']);

                    continue;
                }

                $mimeType = $disk->mimeType($fileName);
                $size = $disk->size($fileName);

                // Validate mime.
                if (!in_array($mimeType, $rules['mimes'])) {
                    $validator->errors()->add($errorKey, __('validation.mimetypes', [
                        'values' => implode(', ', $rules['mimes']),
                    ]));
                }

                // Validate size.
                if ($size > $rules['size_limit']) {
                    $validator->errors()->add($errorKey, __('validation.file_size_limit', [
                        'image_size_max' => $this->imageSizeLimit / (1024 ** 2),
                        'video_size_max' => $this->videoSizeLimit / (1024 ** 2),
                    ]));
                }
            }
        }
    }
}
