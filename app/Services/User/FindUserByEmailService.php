<?php

declare(strict_types=1);

namespace App\Services\User;

use App\Models\User;
use App\Repositories\UserRepository;

class FindUserByEmailService
{
    public function __construct(private readonly UserRepository $userRepository)
    {
    }

    public function execute(string $email): ?User
    {
        return $this->userRepository->findByEmail($email);
    }
}
