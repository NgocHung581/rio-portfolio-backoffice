<?php

declare(strict_types=1);

namespace App\Http\Requests\BehindTheScene;

use Common\App\Enums\MediaFrame;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

/**
 * The request class for storing behind the scene media items.
 */
class StoreBehindTheScenesRequest extends FormRequest
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
            'items' => [
                'required',
                'array',
            ],
            'items.*' => [
                'required',
                'array',
            ],
            'items.*.file_url' => [
                'required',
                'string',
            ],
            'items.*.frame' => [
                'required',
                'string',
                Rule::enum(MediaFrame::class),
            ],
        ];
    }

    /**
     * Add additional validation logic after the default validation rules are applied.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function(Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $this->validateFiles($validator);
        });
    }

    /**
     * Validate that every file was uploaded, and is an image or a video within the size limit.
     */
    private function validateFiles(Validator $validator): void
    {
        $imageMimeTypes = explode(',', config('app.image_mine_types'));
        $videoMimeTypes = explode(',', config('app.video_mine_types'));
        $imageSizeLimit = config('app.image_size_limit');
        $videoSizeLimit = config('app.video_size_limit');
        $disk = Storage::disk('tmp');

        foreach ($this->items as $key => $item) {
            $errorKey = "items.{$key}.file_url";
            $fileName = basename($item['file_url']);

            if (!$disk->exists($fileName)) {
                $validator->errors()->add($errorKey, __('messages')['file_uploaded_failed']);

                continue;
            }

            $mimeType = $disk->mimeType($fileName);
            $size = $disk->size($fileName);

            if (in_array($mimeType, $imageMimeTypes)) {
                $sizeLimit = $imageSizeLimit;
            } elseif (in_array($mimeType, $videoMimeTypes)) {
                $sizeLimit = $videoSizeLimit;
            } else {
                $validator->errors()->add($errorKey, __('validation.mimetypes', [
                    'values' => implode(', ', [...$imageMimeTypes, ...$videoMimeTypes]),
                ]));

                continue;
            }

            if ($size > $sizeLimit) {
                $validator->errors()->add($errorKey, __('validation.file_size_limit', [
                    'image_size_max' => $imageSizeLimit / (1024 ** 2),
                    'video_size_max' => $videoSizeLimit / (1024 ** 2),
                ]));
            }
        }
    }
}
