<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserRepository
{
    /**
     * Find a user by email.
     */
    public function findByEmail(string $email): ?User
    {
        return User::query()->firstWhere('email', $email);
    }

    /**
     * Create a new user.
     */
    public function create(string $email, string $password, string $name)
    {
        return User::query()->create([
            'email' => $email,
            'password' => Hash::make($password),
            'name' => $name,
        ]);
    }
}
