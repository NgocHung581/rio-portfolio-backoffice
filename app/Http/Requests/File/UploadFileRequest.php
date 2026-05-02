<?php

declare(strict_types=1);

namespace App\Http\Requests\File;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The request class for uploading file.
 */
class UploadFileRequest extends FormRequest
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
            'file' => [
                'required',
                'file',
                'mimetypes:' . config('app.image_mine_types') . ',' . config('app.video_mine_types'),
            ],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function(Validator $validator): void {
            $file = $this->file('file');

            if (isset($file)) {
                $mime = $file->getMimeType();
                $size = $file->getSize();
                $imageSizeLimit = config('app.image_size_limit');
                $videoSizeLimit = config('app.video_size_limit');

                if (str_starts_with($mime, 'image/') && $size > $imageSizeLimit) {
                    $validator->errors()->add('file', __('validation.file_size_limit', [
                        'image_size_max' => $imageSizeLimit / (1024 ** 2),
                        'video_size_max' => $videoSizeLimit / (1024 ** 2),
                    ]));
                }

                if (str_starts_with($mime, 'video/') && $size > $videoSizeLimit) {
                    $validator->errors()->add('file', __('validation.file_size_limit', [
                        'image_size_max' => $imageSizeLimit / (1024 ** 2),
                        'video_size_max' => $videoSizeLimit / (1024 ** 2),
                    ]));
                }
            }
        });
    }
}
