<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Console\Command;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

/**
 * The console command for creating a new user.
 */
class CreateUserCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'app:create-user {--email=} {--password=} {--name=}';

    /**
     * The console command description.
     */
    protected $description = 'Create a new user.';

    /**
     * Execute the console command.
     */
    public function handle(UserRepository $userRepository): void
    {
        $data = [
            'email' => $this->option('email'),
            'password' => $this->option('password'),
            'name' => $this->option('name'),
        ];
        $rules = [
            'email' => [
                'required',
                'string',
                'email',
                Rule::unique(User::class, 'email'),
            ],
            'password' => [
                'required',
                'string',
                Password::min(10)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
                    ->uncompromised(),
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ],
        ];
        $validator = validator($data, $rules);

        if ($validator->fails()) {
            foreach ($validator->errors()->messages() as $key => $messages) {
                foreach ($messages as $message) {
                    $this->error("[{$key}]: {$message}");
                }

            }


            exit(1);
        }

        $user = $userRepository->create($data['email'], $data['password'], $data['name']);

        $this->info("User created: {$user->email}");
    }
}
