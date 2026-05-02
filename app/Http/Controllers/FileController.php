<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\File\UploadFileRequest;
use App\UseCases\File\UploadFileUseCase;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Session;

/**
 * The controller class for the file.
 */
class FileController extends Controller
{
    /**
     * Upload a file.
     */
    public function upload(UploadFileRequest $request, UploadFileUseCase $useCase): RedirectResponse
    {
        $result = $useCase($request->file('file'));

        if (!$result['success']) {
            return back()->withErrors(['message' => $result['message']]);
        }

        Session::flash('file_url', $result['file_url']);

        return back();
    }
}
