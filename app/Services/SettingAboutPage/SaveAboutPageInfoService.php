<?php

declare(strict_types=1);

namespace App\Services\SettingAboutPage;

use App\Constants\MediaFolderName;
use App\Constants\PublicStorageFolderPathPrefix;
use App\Traits\MediaHelper;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SaveAboutPageInfoService
{
    use MediaHelper;

    public function __construct(private readonly GetAboutPageInfoService $getAboutPageInfoService)
    {
    }

    public function execute(
        string $introduction,
        string $shortIntroduction,
        array $newPartnerLogoImages,
        array $deletedPartnerLogoImageFilePaths
    ): array {
        $folderPath = PublicStorageFolderPathPrefix::PARTNER_LOGOS . '/' . MediaFolderName::IMAGES;
        $aboutPageInfo = $this->getAboutPageInfoService->execute();
        $uploadedFilePaths = [];

        try {
            // Save partner logos.
            if (!empty($newPartnerLogoImages)) {
                $newPartnerLogoImageFiles = array_map(fn($image) => $image['file'], $newPartnerLogoImages);

                foreach ($newPartnerLogoImageFiles as $newPartnerLogoImageFile) {
                    $fileName = $this->generateMediaFileName($newPartnerLogoImageFile);
                    $fileSize = $newPartnerLogoImageFile->getSize();
                    $filePath = Storage::disk('public')->putFileAs($folderPath, $newPartnerLogoImageFile, $fileName);

                    if (!is_string($filePath)) {
                        Storage::disk('public')->delete($uploadedFilePaths);

                        return [
                            'is_success' => false,
                            'message' => __('messages')['data_saved_failed'],
                        ];
                    }

                    $uploadedFilePaths[] = $filePath;
                    $aboutPageInfo['partner_logo_images'][] = [
                        'url' => asset("/storage/{$filePath}"),
                        'file_path' => $filePath,
                        'file_name' => $fileName,
                        'file_size' => $fileSize,
                    ];
                }
            }

            // Delete partner logos.
            if (!empty($deletedPartnerLogoImageFilePaths)) {
                $aboutPageInfo['partner_logo_images'] = array_filter(
                    $aboutPageInfo['partner_logo_images'],
                    fn($partnerLogoImages) => !in_array($partnerLogoImages['file_path'], $deletedPartnerLogoImageFilePaths)
                );
                Storage::disk('public')->delete($deletedPartnerLogoImageFilePaths);
            }

            // Save about page information.
            $aboutPageInfo['introduction'] = $introduction;
            $aboutPageInfo['short_introduction'] = $shortIntroduction;
            Storage::put('data/about_page_information.json', json_encode($aboutPageInfo, JSON_PRETTY_PRINT));

            return [
                'is_success' => true,
                'message' => __('messages')['data_saved_successfully'],
            ];
        } catch (Exception|QueryException $e) {
            Log::error($e);
            Storage::disk('public')->delete($uploadedFilePaths);

            return [
                'is_success' => false,
                'message' => __('messages')['internal_server_error'],
            ];
        }
    }
}
