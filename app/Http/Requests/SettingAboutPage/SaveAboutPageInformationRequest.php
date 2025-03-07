<?php

declare(strict_types=1);

namespace App\Http\Requests\SettingAboutPage;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class SaveAboutPageInformationRequest extends FormRequest
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
            'description' => ['required', 'string'],
            'partner_logos' => ['array', 'max:10'],
            'partner_logos.*.file' => ['required', File::image()->types(['jpg', 'jpeg', 'png', 'webp'])->max('30mb')],
            'deleted_partner_logo_urls' => ['array'],
            'deleted_partner_logo_urls.*' => ['required', 'string', 'distinct:strict'],
        ];
    }

    /**
     * Get the validation attributes that apply to the request.
     */
    public function attributes()
    {
        return [
            'description' => __('description'),
            'partner_logos' => __('partner_logos'),
        ];
    }

    /**
     * Handle data after passed validation.
     */
    protected function passedValidation(): void
    {
        $deletedPartnerLogoPaths = [];

        if (isset($this->deleted_partner_logo_urls)) {
            $deletedPartnerLogoPaths = array_map(
                fn($url) => ltrim(str_replace(asset('/storage'), '', $url), '/'),
                $this->deleted_partner_logo_urls
            );
        }

        $this->merge([
            'deleted_partner_logo_paths' => $deletedPartnerLogoPaths,
        ]);
    }
}
