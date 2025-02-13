<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Inertia\Response;
use Inertia\ResponseFactory;

class DashboardController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        return inertia('Dashboard');
    }
}
