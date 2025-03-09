<?php

declare(strict_types=1);

namespace App\Services\SettingAboutPage;

use App\Constants\MediaFolderName;
use App\Constants\PublicStorageFolderPathPrefix;
use App\Repositories\AboutPageInformationRepository;
use App\Traits\MediaHelper;
use Common\App\Enums\MediaType;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SaveAboutPageInformationService
{
    use MediaHelper;

    public function __construct(private readonly AboutPageInformationRepository $aboutPageInformationRepository)
    {
    }

    public function execute(string $description, array $newPartnerLogos, array $deletedPartnerLogoPaths): array
    {
        $folderPath = PublicStorageFolderPathPrefix::PARTNER_LOGOS . DIRECTORY_SEPARATOR . MediaFolderName::IMAGES;
        $aboutPageInfo = $this->aboutPageInformationRepository->getAboutPageInformation();
        $uploadedFilePaths = [];

        try {
            DB::beginTransaction();

            // Save about page information.
            if (is_null($aboutPageInfo)) {
                $aboutPageInfo = $this->aboutPageInformationRepository->create($description);
            } else {
                $isCompleted = $this->aboutPageInformationRepository->update($aboutPageInfo->id, $description);

                if (!$isCompleted) {
                    DB::rollBack();

                    return [
                        'is_success' => false,
                        'message' => __('messages')['data_saved_failed'],
                    ];
                }
            }

            // Save partner logos.
            if (!empty($newPartnerLogos)) {
                $partnerLogoFiles = array_map(fn($image) => $image['file'], $newPartnerLogos);

                foreach ($partnerLogoFiles as $partnerLogoFile) {
                    $fileName = $this->generateMediaFileName($partnerLogoFile);
                    $fileSize = $partnerLogoFile->getSize();
                    $filePath = Storage::disk('public')->putFileAs($folderPath, $partnerLogoFile, $fileName);

                    if ($filePath === false) {
                        DB::rollBack();
                        Storage::disk('public')->delete($uploadedFilePaths);

                        return [
                            'is_success' => false,
                            'message' => __('messages')['data_saved_failed'],
                        ];
                    }

                    $uploadedFilePaths[] = $filePath;

                    $aboutPageInfo->partnerLogos()->create([
                        'type' => MediaType::Image->value,
                        'file_path' => $filePath,
                        'file_name' => $fileName,
                        'file_size' => $fileSize,
                    ]);
                }
            }

            // Delete partner logos.
            if (!empty($deletedPartnerLogoPaths)) {
                $aboutPageInfo->partnerLogos()->whereIn('file_path', $deletedPartnerLogoPaths)->delete();
                Storage::disk('public')->delete($deletedPartnerLogoPaths);
            }

            DB::commit();

            return [
                'is_success' => true,
                'message' => __('messages')['data_saved_successfully'],
            ];
        } catch (Exception|QueryException $e) {
            Log::error($e);
            DB::rollBack();
            Storage::disk('public')->delete($uploadedFilePaths);

            return [
                'is_success' => false,
                'message' => __('messages')['internal_server_error'],
            ];
        }
    }
}
