<?php

declare(strict_types=1);

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\SettingAboutPageController;
use Illuminate\Support\Facades\Route;

// Update locale
Route::put('/locale', [LocaleController::class, 'update'])->name('locale.update');

Route::middleware('guest')->group(function () {
    // Auth
    Route::controller(AuthController::class)->group(function () {
        Route::get('/login', 'login')->name('login');
        Route::post('/login', 'authenticate')->name('authenticate');
    });
});

Route::middleware('auth')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Album
    Route::controller(AlbumController::class)->prefix('/albums')->name('albums.')->group(function () {
        Route::get('/', 'index')->name('index');
    });

    // Setting about page
    Route::controller(SettingAboutPageController::class)->prefix('/setting-about-page')->name('settingAboutPage.')->group(function () {
        Route::get('/', 'index')->name('index');
    });
});
