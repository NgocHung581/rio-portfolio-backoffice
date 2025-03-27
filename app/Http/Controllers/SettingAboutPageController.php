<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\SettingAboutPage\SaveAboutPageInfoRequest;
use App\Services\SettingAboutPage\GetAboutPageInfoService;
use App\Services\SettingAboutPage\SaveAboutPageInfoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\ResponseFactory;

class SettingAboutPageController extends Controller
{
    /**
     * Display the setting about page view.
     */
    public function index(GetAboutPageInfoService $service): Response|ResponseFactory
    {
        $aboutPageInfo = $service->execute();

        return inertia('SettingAboutPage', compact('aboutPageInfo'));
    }

    /**
     * Get the about page information for API.
     */
    public function getAboutPageInfoApi(GetAboutPageInfoService $service): JsonResponse
    {
        return response()->json($service->execute());
    }

    /**
     * Save the about page information.
     */
    public function save(SaveAboutPageInfoRequest $request, SaveAboutPageInfoService $service): RedirectResponse
    {
        $result = $service->execute(
            $request->introduction,
            $request->short_introduction,
            $request->partner_logo_images,
            $request->deleted_partner_logo_image_file_paths
        );

        if (!$result['is_success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return back()->with('message', $result['message']);
    }
}
