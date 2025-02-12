<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Inertia\Response;
use Inertia\ResponseFactory;

/**
 * Controller class for auth routes.
 */
class AuthController extends Controller
{
    /**
     * Display the login view.
     */
    public function login(): Response|ResponseFactory
    {
        return inertia('Auth/Login');
    }
}
