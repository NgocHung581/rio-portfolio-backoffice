<?php

declare(strict_types=1);

namespace App\UseCases\User;

use App\Models\User;
use App\Repositories\UserRepository;

/**
 * The use case class for finding a user by email.
 */
class FindUserByEmailUseCase
{
    public function __construct(private readonly UserRepository $userRepository)
    {
    }

    public function __invoke(string $email): ?User
    {
        return $this->userRepository->findByEmail($email);
    }
}
