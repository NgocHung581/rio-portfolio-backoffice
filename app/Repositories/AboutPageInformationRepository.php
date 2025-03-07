<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\AboutPageInformation;

class AboutPageInformationRepository
{
    /**
     * Get the about page information.
     */
    public function getAboutPageInformation(): ?AboutPageInformation
    {
        return AboutPageInformation::query()->first();
    }

    /**
     * Create a new about page information.
     */
    public function create(string $description): AboutPageInformation
    {
        return AboutPageInformation::query()->create([
            'description' => $description,
        ]);
    }

    /**
    * Update the about page information.
    */
    public function update(int $id, string $description): bool
    {
        $updatedCount = AboutPageInformation::query()
            ->where('id', $id)
            ->update(['description' => $description]);

        return $updatedCount === 1;
    }
}
