<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminEmails = explode(',', env('ADMIN_EMAILS'));
        $adminPasswords = explode(',', env('ADMIN_PASSWORDS'));
        $adminNames = explode(',', env('ADMIN_NAMES'));

        try {
            DB::beginTransaction();

            for ($i = 0; $i < count($adminEmails); $i++) {
                $email = $adminEmails[$i];
                $password = $adminPasswords[$i];
                $name = $adminNames[$i];

                User::query()->firstOrCreate(
                    [
                        'email' => $email,
                    ],
                    [
                        'password' => Hash::make($password),
                        'name'     => $name,
                    ]
                );
            }

            DB::commit();
        } catch (Exception|QueryException $e) {
            Log::error($e);
            DB::rollBack();
        }
    }
}
