<?php

declare(strict_types=1);

namespace App\UseCases\WebsiteContentSetting;

use App\Helpers\FileManager;
use Common\App\UseCases\WebsiteContentSetting\GetWebsiteContentSettingUseCase;
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
        string $phoneNumber,
        string $email,
        string $introductionEn,
        string $introductionVi,
        string $avatarFileUrl,
        array $partnerLogos,
        string $bannerTextEn,
        string $bannerTextVi
    ): array {
        $deletedTmpFilePaths = [];
        $deletedPublicFilePaths = [];
        $websiteContentSetting = ($this->getWebsiteContentSettingUseCase)();

        unset($websiteContentSetting['avatar']['file_url']);

        foreach (array_keys($websiteContentSetting['partner_logos']) as $key) {
            unset($websiteContentSetting['partner_logos'][$key]['file_url']);
        }

        try {
            // Save avatar.
            if (str_starts_with($avatarFileUrl, config('filesystems.disks.tmp.url'))) {
                $avatarFileName = basename($avatarFileUrl);
                $avatarFilePath = FileManager::moveTmpToPublic($avatarFileName, self::UPLOAD_FOLDER);
                $deletedTmpFilePaths[] = $avatarFileName;
                $deletedPublicFilePaths[] = $websiteContentSetting['avatar']['file_path'];
                $websiteContentSetting['avatar']['file_path'] = $avatarFilePath;
            }

            // Delete partner logos.
            $deletedFilePaths = array_diff(
                array_column($websiteContentSetting['partner_logos'], 'file_path'),
                array_column($partnerLogos, 'file_path')
            );

            foreach (array_keys($deletedFilePaths) as $key) {
                $deletedPublicFilePaths[] = $websiteContentSetting['partner_logos'][$key]['file_path'];

                unset($websiteContentSetting['partner_logos'][$key]);
            }

            // Save partner logos.
            foreach ($partnerLogos as $partnerLogo) {
                $partnerLogoFileUrl = $partnerLogo['file_url'];

                if (str_starts_with($partnerLogoFileUrl, config('filesystems.disks.tmp.url'))) {
                    $partnerLogoFileName = basename($partnerLogoFileUrl);
                    $partnerLogoFilePath = FileManager::moveTmpToPublic($partnerLogoFileName, self::UPLOAD_FOLDER);
                    $deletedTmpFilePaths[] = $partnerLogoFileName;
                    $websiteContentSetting['partner_logos'][] = [
                        'id' => $partnerLogo['id'],
                        'file_path' => $partnerLogoFilePath,
                    ];
                }
            }

            // Save other fields.
            $websiteContentSetting['phone_number'] = $phoneNumber;
            $websiteContentSetting['email'] = $email;
            $websiteContentSetting['introduction_en'] = $introductionEn;
            $websiteContentSetting['introduction_vi'] = $introductionVi;
            $websiteContentSetting['banner_text_en'] = $bannerTextEn;
            $websiteContentSetting['banner_text_vi'] = $bannerTextVi;
            $websiteContentSetting['partner_logos'] = array_values($websiteContentSetting['partner_logos']);

            Storage::put('data/website_content_setting.json', json_encode($websiteContentSetting, JSON_PRETTY_PRINT));
            Storage::disk('tmp')->delete($deletedTmpFilePaths);
            Storage::disk('public')->delete($deletedPublicFilePaths);

            return [
                'is_success' => true,
                'message' => __('messages')['data_saved_successfully'],
            ];
        } catch (Exception $exception) {
            Log::error($exception);

            return [
                'is_success' => false,
                'message' => __('messages')['internal_server_error'],
            ];
        }
    }
}
