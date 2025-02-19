<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;
use Inertia\ResponseFactory;

class AuthController extends Controller
{
    /**
     * Display the login view.
     */
    public function login(): Response|ResponseFactory
    {
        return inertia('Auth/Login');
    }

    /**
     * Login the user.
     */
    public function authenticate(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        return redirect()->intended();
    }

    /**
     * Logout the user.
     */
    public function logout(Request $request): RedirectResponse
    {
        $locale = session('locale');

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();
        $request->session()->put('locale', $locale);

        return to_route('login');
    }
}
