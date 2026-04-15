<?php

declare(strict_types=1);

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\WebsiteContentSettingController;
use Common\App\Http\Controllers\GetGoogleDriveFileController;
use Illuminate\Support\Facades\Route;

// Set locale.
Route::put('/locale', LocaleController::class)->name('locale.set');

// Get files.
Route::get('/files/{fileName}', GetGoogleDriveFileController::class)->name('file');

Route::middleware('guest')->group(function(): void {
    // Auth.
    Route::controller(AuthController::class)->group(function(): void {
        Route::get('/login', 'login')->name('login');
        Route::post('/login', 'authenticate')->name('authenticate');
        Route::name('password.')->group(function(): void {
            Route::get('/forgot-password', 'forgotPassword')->name('request');
            Route::post('/forgot-password', 'sendResetPasswordLink')->name('sendResetLink');
            Route::get('/reset-password', 'resetPassword')->name('reset');
            Route::post('/reset-password', 'storePassword')->name('store');
        });
    });
});


Route::middleware('auth')->group(function(): void {
    // Auth.
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Dashboard.
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Category.
    Route::prefix('/categories')->name('categories.')->controller(CategoryController::class)->group(function(): void {
        Route::get('/', 'index')->name('index');
        Route::post('/store', 'store')->name('store');
        Route::put('/update/{category}', 'update')->name('update');
        Route::post('/bulk-delete', 'bulkDelete')->name('bulkDelete');
    });

    // Project.
    Route::prefix('/projects')->name('projects.')->controller(ProjectController::class)->group(function(): void {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::post('/store', 'store')->name('store');
        Route::get('/edit/{project}', 'edit')->name('edit');
        Route::put('/update/{project}', 'update')->name('update');
        Route::post('/bulk-delete', 'bulkDelete')->name('bulkDelete');
    });

    // Setting.
    Route::prefix('/settings')->name('settings.')->group(function(): void {
        Route::prefix('website-content')->name('websiteContent.')->controller(WebsiteContentSettingController::class)
            ->group(function(): void {
                Route::get('/', 'index')->name('index');
                Route::post('/', 'save')->name('save');
            });
    });
});

// Public API.
Route::prefix('/api')->name('api.')->group(function(): void {
    Route::get('/website-content-setting', [WebsiteContentSettingController::class, 'getWebsiteContentSettingApi'])
        ->name('WebsiteContentSetting');
});
