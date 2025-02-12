<?php

declare(strict_types=1);

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->controller(AuthController::class)->name('auth.')->group(function () {
    Route::get('/login', 'login')->name('login');
});
