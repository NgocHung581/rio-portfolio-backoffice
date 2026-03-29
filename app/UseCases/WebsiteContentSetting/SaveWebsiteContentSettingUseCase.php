<?php

declare(strict_types=1);

namespace App\UseCases\WebsiteContentSetting;

use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * The use case class for saving the website content setting.
 */
class SaveWebsiteContentSettingUseCase
{
    // The folder to store the uploaded files.
    private const UPLOAD_FOLDER = 'images';

    public function __construct(private readonly GetWebsiteContentSettingUseCase $getWebsiteContentSettingUseCase)
    {
    }

    public function __invoke(
        string $fullName,
        string $phoneNumber,
        string $email,
        string $introductionEn,
        string $introductionVi,
        array $avatar,
        array $partnerLogos,
        string $bannerTextEn,
        string $bannerTextVi
    ): array {
        $uploadedFilePaths = [];
        $websiteContentSetting = ($this->getWebsiteContentSettingUseCase)();

        unset($websiteContentSetting['avatar']['url']);

        foreach (array_keys($websiteContentSetting['partner_logos']) as $key) {
            unset($websiteContentSetting['partner_logos'][$key]['url']);
        }

        try {
            // Save avatar.
            $avatarFile = $avatar['file'];
            $avatarFilePath = $avatar['file_path'];

            if (isset($avatarFile)) {
                $avatarFilePath = $avatarFile->store(self::UPLOAD_FOLDER, 'public');
                $uploadedFilePaths[] = $avatarFilePath;
                $websiteContentSetting['avatar'] = ['file_path' => $avatarFilePath, 'file' => null];
            }

            // Delete partner logos.
            $deletedFilePaths = array_diff(
                array_column($websiteContentSetting['partner_logos'], 'file_path'),
                array_column($partnerLogos, 'file_path')
            );

            foreach (array_keys($deletedFilePaths) as $key) {
                unset($websiteContentSetting['partner_logos'][$key]);
            }

            // Save partner logos.
            foreach ($partnerLogos as $partnerLogo) {
                $partnerLogoFile = $partnerLogo['file'];
                $partnerLogoFilePath = $partnerLogo['file_path'];

                if (isset($partnerLogoFile)) {
                    $partnerLogoFilePath = $partnerLogoFile->store(self::UPLOAD_FOLDER, 'public');
                    $uploadedFilePaths[] = $partnerLogoFilePath;
                    $websiteContentSetting['partner_logos'][] = ['file_path' => $partnerLogoFilePath, 'file' => null];
                }
            }

            // Save other fields.
            $websiteContentSetting['full_name'] = $fullName;
            $websiteContentSetting['phone_number'] = $phoneNumber;
            $websiteContentSetting['email'] = $email;
            $websiteContentSetting['introduction_en'] = $introductionEn;
            $websiteContentSetting['introduction_vi'] = $introductionVi;
            $websiteContentSetting['banner_text_en'] = $bannerTextEn;
            $websiteContentSetting['banner_text_vi'] = $bannerTextVi;
            $websiteContentSetting['partner_logos'] = array_values($websiteContentSetting['partner_logos']);

            Storage::put('data/website_content_setting.json', json_encode($websiteContentSetting, JSON_PRETTY_PRINT));
            Storage::disk('public')->delete($deletedFilePaths);

            return [
                'is_success' => true,
                'message' => __('messages')['data_saved_successfully'],
            ];
        } catch (Exception $exception) {
            Log::error($exception);
            Storage::disk('public')->delete($uploadedFilePaths);

            return [
                'is_success' => false,
                'message' => __('messages')['internal_server_error'],
            ];
        }
    }
}
