<?php

declare(strict_types=1);

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\WebsiteContentSettingController;
use Illuminate\Support\Facades\Route;

// Set locale.
Route::put('/locale', LocaleController::class)->name('locale.set');

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
    Route::controller(AuthController::class)->group(function(): void {
        Route::put('/profile', 'updateProfile')->name('updateProfile');
        Route::post('/logout', 'logout')->name('logout');
    });

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
        Route::post('/update/{project}', 'update')->name('update');
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

    // File.
    Route::prefix('/files')->controller(FileController::class)->name('files.')->group(function(): void {
        Route::post('/upload', 'upload')->name('upload');
    });
});
