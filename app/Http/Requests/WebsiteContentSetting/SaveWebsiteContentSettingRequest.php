<?php

declare(strict_types=1);

namespace App\Http\Requests\WebsiteContentSetting;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

/**
 * The request class for saving the website content setting.
 */
class SaveWebsiteContentSettingRequest extends FormRequest
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
            'phone_number' => [
                'required',
                'string',
                'digits_between:10,11',
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:100',
            ],
            'avatar' => [
                'required',
                'array',
            ],
            'avatar.file' => [
                'nullable',
                File::image()->types(config('app.image_mine_types'))->max(config('app.image_size_limit') / 1024),
            ],
            'introduction_en' => [
                'required',
                'string',
            ],
            'introduction_vi' => [
                'required',
                'string',
            ],
            'partner_logos' => [
                'array',
            ],
            'partner_logos.*.file' => [
                'nullable',
                File::image()->types(config('app.image_mine_types'))->max(config('app.image_size_limit') / 1024),
            ],
            'banner_text_en' => [
                'required',
                'string',
            ],
            'banner_text_vi' => [
                'required',
                'string',
            ],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'partner_logos' => !isset($this->partner_logos) ? [] : $this->partner_logos,
        ]);
    }
}
