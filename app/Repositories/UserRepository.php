<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

/**
 * The repository class for the user.
 */
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
    public function create(string $email, string $password, string $name): User
    {
        return User::query()->create([
            'email' => $email,
            'password' => Hash::make($password),
            'name' => $name,
        ]);
    }

    /**
     * Update the profile.
     */
    public function updateProfile(string $name, ?string $password): int
    {
        $data = ['name' => $name];

        if (filled($password)) {
            $data['password'] = Hash::make($password);
        }

        return User::query()->where('id', auth()->id())->update($data);
    }
}
