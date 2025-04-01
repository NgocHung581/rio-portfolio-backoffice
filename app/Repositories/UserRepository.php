<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    /**
     * Find a user by email.
     */
    public function findByEmail(string $email): ?User
    {
        return User::query()->firstWhere('email', $email);
    }
}
