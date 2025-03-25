<?php

declare(strict_types=1);

namespace App\Http\Requests\Album;

use App\Enums\AspectRatio;
use App\Models\Album;
use App\Repositories\AlbumRepository;
use Common\App\Constants\AlbumSetting;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;
use Illuminate\Validation\Validator;

class CommonAlbumRequest extends FormRequest
{
    public function __construct(private readonly AlbumRepository $albumRepository)
    {
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title_en' => [
                'required',
                'string',
                'max:100',
            ],
            'title_vi' => [
                'required',
                'string',
                'max:100',
            ],
            'name_en' => [
                'required',
                'string',
                'max:50',
                Rule::unique(Album::class, 'name_en')
                    ->withoutTrashed()
                    ->ignore($this->album?->id),
            ],
            'name_vi' => [
                'required',
                'string',
                'max:50',
                Rule::unique(Album::class, 'name_vi')
                    ->withoutTrashed()
                    ->ignore($this->album?->id),
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
            'thumbnail_file' => [
                Rule::requiredIf(is_null($this->album) || (isset($this->album) && $this->is_thumbnail_deleted && is_null($this->thumbnail_file))),
                File::image()->types(['jpg', 'jpeg', 'png', 'webp'])->max('30mb'),
            ],
            'thumbnail_frame' => [
                'required',
                'string',
                Rule::in(AspectRatio::cases()),
            ],
            'is_highlight' => [
                'required',
                'boolean',
            ],
        ];
    }

    /**
     * Add additional validation logic after the default validation rules are applied.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function(Validator $validator): void {
            // Check if the album has already reached the maximum number of highlighted albums.
            $hasEnoughHighlightedAlbums = $this->albumRepository->countHighlightAlbums() >= AlbumSetting::MAX_HIGHLIGHT_ALBUMS;

            if ($hasEnoughHighlightedAlbums && $this->is_highlight) {
                $validator->errors()->add(
                    'is_highlight',
                    str_replace(
                        '{{max}}',
                        (string) AlbumSetting::MAX_HIGHLIGHT_ALBUMS,
                        __('messages')['exceed_max_highlight_albums']
                    )
                );
            }
        });
    }

    /**
     * Get the validation attributes that apply to the request.
     */
    public function attributes()
    {
        return [
            'title_en' => __('title_en'),
            'title_vi' => __('title_vi'),
            'name_en' => __('name_en'),
            'name_vi' => __('name_vi'),
            'description_en' => __('description_en'),
            'description_vi' => __('description_vi'),
            'summary_en' => __('summary_en'),
            'summary_vi' => __('summary_vi'),
            'thumbnail_file' => __('thumbnail'),
            'thumbnail_frame' => __('frame'),
            'is_highlight' => __('highlight'),
        ];
    }

    /**
     * Handle data after passed validation.
     */
    protected function passedValidation(): void
    {
        $this->merge([
            'is_highlight' => is_bool($this->is_highlight) ? $this->is_highlight : (bool) $this->is_highlight,
        ]);
    }
}
