<?php

declare(strict_types=1);

namespace App\Http\Requests\AlbumMediaItem;

use App\Constants\AlbumMediaItemSetting;
use App\Enums\ColumnSpan;
use App\Enums\FileType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class CreateAlbumMediaItemRequest extends FormRequest
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
        $mediaCountLimitPerUpload = 0;

        match ($this->media_type) {
            FileType::Image->value => $mediaCountLimitPerUpload = AlbumMediaItemSetting::IMAGES_COUNT_LIMIT_PER_UPLOAD,
            FileType::Video->value => $mediaCountLimitPerUpload = AlbumMediaItemSetting::VIDEOS_COUNT_LIMIT_PER_UPLOAD,
        };

        return [
            'media_type' => ['required', 'integer', Rule::in(FileType::cases())],
            'media' => ['required', 'array', "max:{$mediaCountLimitPerUpload}"],
            'media.*' => ['required', 'array', 'size:3'],
            'media.*.column_span' => ['required', 'integer', Rule::in(ColumnSpan::cases())],
            'media.*.is_displayed_on_banner' => ['required', 'boolean'],
            'media.*.file' => [
                'required',
                Rule::when(
                    $this->media_type === FileType::Image->value,
                    [File::image()->types(['jpg', 'jpeg', 'png'])->max('30mb')]
                ),
                Rule::when(
                    $this->media_type === FileType::Video->value,
                    ['file', 'mimetypes:video/mp4', 'max:2097152'] // 2GB
                ),
            ],
        ];
    }

    /**
     * Get the validation attributes that apply to the request.
     */
    public function attributes(): array
    {
        return [
            'media_type' => __('media_type'),
            'media.*.column_span' => __('column_width'),
            'media.*.is_displayed_on_banner' => __('display_on_banner'),
            'media.*.file' => FileType::tryFrom($this->media_type)?->label(),
        ];
    }

    /**
     * Handle data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'media_type' => (int) $this->media_type,
        ]);
    }

    /**
     * Handle data after passed validation.
     */
    protected function passedValidation(): void
    {
        $parsedMedia = array_map(
            function($media) {
                $media['column_span'] = (int) $media['column_span'];
                $media['type'] = $this->media_type;

                if (!is_bool($media['is_displayed_on_banner'])) {
                    $media['is_displayed_on_banner'] = (bool) $media['is_displayed_on_banner'];
                }

                return $media;
            },
            $this->media
        );

        $this->merge([
            'media' => $parsedMedia,
        ]);
    }
}
