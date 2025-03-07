<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\SettingAboutPage\SaveAboutPageInformationRequest;
use App\Http\Resources\AboutPageInformationResource;
use App\Services\SettingAboutPage\GetAboutPageInformationService;
use App\Services\SettingAboutPage\SaveAboutPageInformationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\ResponseFactory;

class SettingAboutPageController extends Controller
{
    /**
     * Display the setting about page view.
     */
    public function index(GetAboutPageInformationService $service): Response|ResponseFactory
    {
        $aboutPageInformation = new AboutPageInformationResource($service->execute());

        return inertia('SettingAboutPage', compact('aboutPageInformation'));
    }

    /**
     * Save the about page information.
     */
    public function save(
        SaveAboutPageInformationRequest $request,
        SaveAboutPageInformationService $service
    ): RedirectResponse {
        $result = $service->execute(
            $request->description,
            $request->partner_logos,
            $request->deleted_partner_logo_paths
        );

        if (!$result['is_success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return back()->with('message', $result['message']);
    }
}
