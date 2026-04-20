<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\WebsiteContentSetting\SaveWebsiteContentSettingRequest;
use App\UseCases\WebsiteContentSetting\SaveWebsiteContentSettingUseCase;
use Common\App\UseCases\WebsiteContentSetting\GetWebsiteContentSettingUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\ResponseFactory;

/**
 * The controller class for the website content setting.
 */
class WebsiteContentSettingController extends Controller
{
    /**
     * Display the website content setting page.
     */
    public function index(GetWebsiteContentSettingUseCase $useCase): Response|ResponseFactory
    {
        $websiteContentSetting = $useCase();

        return inertia('WebsiteContentSetting', compact('websiteContentSetting'));
    }

    /**
     * Get the website content setting for API.
     */
    public function getWebsiteContentSettingApi(GetWebsiteContentSettingUseCase $useCase): JsonResponse
    {
        return response()->json($useCase());
    }

    /**
     * Save the website content setting.
     */
    public function save(
        SaveWebsiteContentSettingRequest $request,
        SaveWebsiteContentSettingUseCase $useCase
    ): RedirectResponse {
        $result = $useCase(
            $request->phone_number,
            $request->email,
            $request->introduction_en,
            $request->introduction_vi,
            $request->avatar,
            $request->partner_logos,
            $request->banner_text_en,
            $request->banner_text_vi
        );

        if (!$result['is_success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        return back()->with('message', $result['message']);
    }
}
