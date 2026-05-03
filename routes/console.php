<?php

declare(strict_types=1);

use App\Console\Commands\PruneTmpFilesCommand;
use Illuminate\Support\Facades\Schedule;

Schedule::command(PruneTmpFilesCommand::class)->dailyAt('5:00');
