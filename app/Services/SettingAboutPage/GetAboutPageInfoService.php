<?php

declare(strict_types=1);

namespace App\Services\SettingAboutPage;

use Illuminate\Support\Facades\Storage;

class GetAboutPageInfoService
{
    public function execute(): array
    {
        if (Storage::exists('data/about_page_information.json')) {
            $fileContent = file_get_contents(storage_path('app/private/data/about_page_information.json'));
            $aboutPageInfo = json_decode($fileContent, true);
        } else {
            $aboutPageInfo = [
                'introduction' => '',
                'short_introduction' => '',
                'partner_logo_images' => [],
            ];
        }

        return $aboutPageInfo;
    }
}
