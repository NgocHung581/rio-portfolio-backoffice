<?php

declare(strict_types=1);

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\AlbumMediaItemController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\SettingAboutPageController;
use Illuminate\Support\Facades\Route;

// Update locale.
Route::put('/locale', [LocaleController::class, 'update'])->name('locale.update');

Route::middleware('guest')->group(function(): void {
    // Auth.
    Route::controller(AuthController::class)->group(function(): void {
        Route::get('/login', 'login')->name('login');
        Route::post('/login', 'authenticate')->name('authenticate');
    });
});

Route::middleware('auth')->group(function(): void {
    // Auth.
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Dashboard.
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Album.
    Route::prefix('/albums')->name('albums.')->group(function(): void {
        Route::controller(AlbumController::class)->group(function(): void {
            Route::get('/', 'index')->name('index');
            Route::get('/create', 'create')->name('create');
            Route::post('/store', 'store')->name('store');
            Route::get('/{album}/edit', 'edit')->name('edit')->withTrashed();
            Route::post('/{album}/update', 'update')->name('update');
            Route::patch('/{album}/delete', 'deleteAlbum')->name('deleteAlbum');
            Route::patch('/{album}/restore', 'restoreAlbum')->name('restoreAlbum')->withTrashed();
            Route::delete('/{album}/destroy', 'destroyAlbum')->name('destroyAlbum')->withTrashed();
        });

        // Album media.
        Route::prefix('/{album}/media')->controller(AlbumMediaItemController::class)->name('media.')
            ->group(function(): void {
                Route::get('/upload', 'create')->name('create');
                Route::post('/upload', 'store')->name('store');
                Route::patch('/{albumMedia}/bulk-delete', 'deleteAlbumMediaItems')->name('deleteAlbumMediaItems');
                Route::delete('/{albumMedia}/delete', 'deleteAlbumMediaItem')->name('deleteAlbumMediaItem');
            });
    });

    // Setting about page.
    Route::controller(SettingAboutPageController::class)->prefix('/setting-about-page')->name('settingAboutPage.')
        ->group(function(): void {
            Route::get('/', 'index')->name('index');
        });
});
