<?php

declare(strict_types=1);

namespace App\Http\Requests\SettingAboutPage;

use App\Constants\MediaSetting;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class SaveAboutPageInfoRequest extends FormRequest
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
            'introduction' => ['required', 'string'],
            'short_introduction' => ['required', 'string', 'max:255'],
            'partner_logo_images' => ['array', 'max:10'],
            'partner_logo_images.*.file' => [
                'required',
                File::image()->types(MediaSetting::VALID_IMAGE_TYPES)->max(MediaSetting::MAX_IMAGE_SIZE_STRING),
            ],
            'deleted_partner_logo_image_urls' => ['array'],
            'deleted_partner_logo_image_urls.*' => ['required', 'string', 'distinct:strict'],
        ];
    }

    /**
     * Get the validation attributes that apply to the request.
     */
    public function attributes()
    {
        return [
            'introduction' => __('introduction'),
            'short_introduction' => __('short_introduction'),
            'partner_logos' => __('partner_logos'),
        ];
    }

    /**
     * Handle data after passed validation.
     */
    protected function passedValidation(): void
    {
        $deletedPartnerLogoImageFilePaths = [];

        if (!empty($this->deleted_partner_logo_image_urls)) {
            $deletedPartnerLogoImageFilePaths = array_map(
                fn($url) => ltrim(str_replace(asset('/storage'), '', $url), '/'),
                $this->deleted_partner_logo_image_urls
            );
        }

        $this->merge([
            'deleted_partner_logo_image_file_paths' => $deletedPartnerLogoImageFilePaths,
        ]);
    }
}
