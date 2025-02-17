<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Inertia\Response;
use Inertia\ResponseFactory;

class SettingAboutPageController extends Controller
{
    public function index(): Response|ResponseFactory
    {
        return inertia('SettingAboutPage');
    }
}
