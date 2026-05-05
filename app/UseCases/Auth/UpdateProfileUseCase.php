<?php

declare(strict_types=1);

namespace App\UseCases\Auth;

use App\Repositories\UserRepository;
use Exception;
use Illuminate\Support\Facades\Log;

/**
 * The use case class for updating the profile.
 */
class UpdateProfileUseCase
{
    /**
     * Create a new class instance.
     */
    public function __construct(private readonly UserRepository $userRepository)
    {
    }

    public function __invoke(string $name, ?string $password): array
    {
        try {
            $this->userRepository->updateProfile($name, $password);

            return ['success' => true, 'message' => __('messages')['data_updated_successfully']];

        } catch (Exception $e) {
            Log::error($e);

            return ['success' => false, 'message' => __('messages')['internal_server_error']];
        }
    }
}
