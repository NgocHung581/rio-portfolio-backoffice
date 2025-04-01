<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\SendResetPasswordLinkRequest;
use App\Http\Requests\Auth\StorePasswordRequest;
use App\Services\User\FindUserByEmailService;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
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

    /**
     * Display the forgot password view.
     */
    public function forgotPassword(): Response|ResponseFactory
    {
        return inertia('Auth/ForgotPassword');
    }

    /**
     * Send a password reset link.
     */
    public function sendResetPasswordLink(SendResetPasswordLinkRequest $request): RedirectResponse
    {
        $status = Password::sendResetLink($request->only('email'));
        $throttle = config('auth.passwords.users.throttle');

        if ($status === Password::RESET_LINK_SENT) {
            return back()->with('message', __($status));
        }

        return back()->withErrors(['message' => __($status, ['seconds' => $throttle])]);
    }

    /**
     * Display the password reset view.
     */
    public function resetPassword(Request $request, FindUserByEmailService $service): Response|ResponseFactory
    {
        $user = $service->execute($request->email ?? '');

        if (is_null($user) || !Password::tokenExists($user, $request->token)) {
            abort(404);
        }

        return inertia('Auth/ResetPassword', ['email' => $request->email, 'token' => $request->token]);
    }

    /**
     * Store the new password.
     */
    public function storePassword(StorePasswordRequest $request): RedirectResponse
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function($user) use ($request): void {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => null,
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return to_route('login')->with('message', __($status));
        }

        return back()->withErrors(['message' => __($status)]);
    }
}
