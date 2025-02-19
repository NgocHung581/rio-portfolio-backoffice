<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocaleController extends Controller
{
    /**
     * Update application locale.
     */
    public function update(Request $request): RedirectResponse
    {
        $request->session()->put('locale', $request->locale);

        return back();
    }
}
