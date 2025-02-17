<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Inertia\Response;
use Inertia\ResponseFactory;

class AlbumController extends Controller
{
    /**
     * Display the album list view.
     */
    public function index(): Response|ResponseFactory
    {
        return inertia('Album/List');
    }
}
