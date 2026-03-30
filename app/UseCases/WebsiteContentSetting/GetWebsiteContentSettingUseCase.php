<?php

declare(strict_types=1);

namespace App\UseCases\WebsiteContentSetting;

use Illuminate\Support\Facades\Storage;

/**
 * The use case class for getting the website content setting.
 */
class GetWebsiteContentSettingUseCase
{
    public function __invoke(): array
    {
        if (Storage::exists('data/website_content_setting.json')) {
            $websiteContentSetting = json_decode(Storage::get('data/website_content_setting.json'), true);
            $websiteContentSetting['avatar']['url'] = config('app.storage_host') . Storage::url($websiteContentSetting['avatar']['file_path']);

            if (!isset($websiteContentSetting['partner_logos'])) {
                $websiteContentSetting['partner_logos'] = [];
            } else {
                foreach ($websiteContentSetting['partner_logos'] as &$partnerLogo) {
                    $partnerLogo['url'] = config('app.storage_host') . Storage::url($partnerLogo['file_path']);
                }
            }
        } else {
            $websiteContentSetting = [
                'phone_number' => '',
                'email' => '',
                'introduction_en' => '',
                'introduction_vi' => '',
                'avatar' => null,
                'partner_logos' => [],
                'banner_text_en' => '',
                'banner_text_vi' => '',
            ];
        }

        return $websiteContentSetting;
    }
}
