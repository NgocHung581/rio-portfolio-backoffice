<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocaleController extends Controller
{
    /**
     * Set application locale.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $request->session()->put('locale', $request->locale);

        return back();
    }
}
