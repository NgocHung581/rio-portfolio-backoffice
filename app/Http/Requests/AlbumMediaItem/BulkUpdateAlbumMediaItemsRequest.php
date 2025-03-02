<?php

declare(strict_types=1);

namespace App\Http\Requests\AlbumMediaItem;

use App\Enums\ColumnSpan;
use App\Models\AlbumMediaItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BulkUpdateAlbumMediaItemsRequest extends FormRequest
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
            'album_media_items' => ['required', 'array'],
            'album_media_items.*.id' => ['required', 'integer', 'distinct:strict', Rule::exists(AlbumMediaItem::class, 'id')],
            'album_media_items.*.column_span' => ['required', 'integer', Rule::in(ColumnSpan::cases())],
            'album_media_items.*.is_displayed_on_banner' => ['required', 'boolean'],
        ];
    }

    /**
     * Get the validation attributes that apply to the request.
     */
    public function attributes(): array
    {
        return [
            'album_media_items' => __('media_type'),
            'album_media_items.*.column_span' => __('column_width'),
            'album_media_items.*.is_displayed_on_banner' => __('display_on_banner'),
        ];
    }

    /**
     * Handle data for validation.
     */
    protected function prepareForValidation(): void
    {
        $albumMediaItems = [];

        foreach ($this->album_media_items as $albumMediaItemId => $albumMediaItem) {
            $albumMediaItems[$albumMediaItemId] = [...$albumMediaItem, 'id' => $albumMediaItemId];
        }


        $this->merge([
            'album_media_items' => $albumMediaItems,
        ]);
    }
}
