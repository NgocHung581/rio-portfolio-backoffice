<?php

declare(strict_types=1);

use App\Console\Commands\PruneTmpFilesCommand;
use Carbon\Carbon;
use Illuminate\Support\Facades\Schedule;

Schedule::command(PruneTmpFilesCommand::class)->weeklyOn(Carbon::SUNDAY, '5:00');
