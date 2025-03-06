<?php

declare(strict_types=1);

namespace App\Services\SettingAboutPage;

use App\Models\AboutPageInformation;
use App\Repositories\AboutPageInformationRepository;

class GetAboutPageInformationService
{
    public function __construct(private readonly AboutPageInformationRepository $aboutPageInformationRepository)
    {
    }

    public function execute(): ?AboutPageInformation
    {
        return $this->aboutPageInformationRepository->getAboutPageInformation();
    }
}
