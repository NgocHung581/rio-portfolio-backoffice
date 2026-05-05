<?php

declare(strict_types=1);

namespace App\Http\Requests\WebsiteContentSetting;

use App\Traits\ValidationHelper;
use Common\App\Helpers\FileManager;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Storage;

/**
 * The request class for saving the website content setting.
 */
class SaveWebsiteContentSettingRequest extends FormRequest
{
    use ValidationHelper;

    private array $validImageMimeTypes;

    private int $imageSizeLimit;

    private int $videoSizeLimit;

    private Filesystem $tmpDisk;

    public function __construct()
    {
        $this->validImageMimeTypes = explode(',', config('app.image_mine_types'));
        $this->imageSizeLimit = config('app.image_size_limit');
        $this->videoSizeLimit = config('app.video_size_limit');
        $this->tmpDisk = Storage::disk('tmp');
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
            'introduction_en' => [
                'required',
                'string',
            ],
            'introduction_vi' => [
                'required',
                'string',
            ],
            'partner_logos' => [
                'nullable',
                'array',
            ],
            'partner_logos.*' => [
                'required',
                'array',
            ],
            'banner_text_en' => [
                'required',
                'string',
                'max:200',
            ],
            'banner_text_vi' => [
                'required',
                'string',
                'max:200',
            ],
        ];
    }

    /**
     * Add additional validation logic after the default validation rules are applied.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function(Validator $validator): void {
            $this->validateAvatarFile($validator);
            $this->validatePartnerLogoFiles($validator);
        });
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

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator)
    {
        $this->replaceIndexWithIdInErrors($validator);

        return parent::failedValidation($validator);
    }

    /**
     * Validate the avatar file.
     */
    private function validateAvatarFile(Validator $validator): void
    {
        if (empty($this->avatar_file_url)) {
            $validator->errors()->add('avatar_file', __('validation.required'));

            return;
        }

        $this->validateTmpImageFile($validator, $this->avatar_file_url, 'avatar_file_url');
    }

    /**
     * Validate the partner logo files.
     */
    private function validatePartnerLogoFiles(Validator $validator): void
    {
        foreach ($this->partner_logos as $key => $partnerLogo) {
            $this->validateTmpImageFile($validator, $partnerLogo['file_url'], "partner_logos.{$key}.file_url");
        }
    }

    /**
     * Validate a single temporary file.
     */
    private function validateTmpImageFile(Validator $validator, string $fileUrl, string $errorKey): void
    {
        if (str_starts_with($fileUrl, FileManager::getPublicStorageUrl(''))) {
            return;
        }

        $fileName = basename($fileUrl);

        if (!$this->tmpDisk->exists($fileName)) {
            $validator->errors()->add($errorKey, __('messages')['file_uploaded_failed']);

            return;
        }

        $mimeType = $this->tmpDisk->mimeType($fileName);
        $size = $this->tmpDisk->size($fileName);

        // Validate mime
        if (!in_array($mimeType, $this->validImageMimeTypes)) {
            $validator->errors()->add($errorKey, __('validation.mimetypes', [
                'values' => implode(', ', $this->validImageMimeTypes),
            ]));
        }

        // Validate size
        if ($size > $this->imageSizeLimit) {
            $validator->errors()->add($errorKey, __('validation.file_size_limit', [
                'image_size_max' => $this->imageSizeLimit / (1024 ** 2),
                'video_size_max' => $this->videoSizeLimit / (1024 ** 2),
            ]));
        }
    }
}
