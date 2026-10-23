<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\UseCases\Dashboard\GetDashboardDataUseCase;
use Inertia\Response;
use Inertia\ResponseFactory;

class DashboardController extends Controller
{
    public function index(GetDashboardDataUseCase $useCase): Response|ResponseFactory
    {
        return inertia('Dashboard', $useCase());
    }
}
