<?php

declare(strict_types=1);

namespace App\UseCases\Project;

use App\Repositories\ProjectRepository;
use Exception;
use Illuminate\Support\Facades\Log;

/**
 * The use case class for removing the highlight of many projects.
 */
class BulkUnhighlightProjectsUseCase
{
    public function __construct(private readonly ProjectRepository $projectRepository)
    {
    }

    public function __invoke(array $ids): array
    {
        try {
            $this->projectRepository->bulkUnhighlight($ids);

            return ['success' => true, 'message' => __('messages')['data_updated_successfully']];
        } catch (Exception $exception) {
            Log::error($exception);

            return ['success' => false, 'message' => __('messages')['internal_server_error']];
        }
    }
}
