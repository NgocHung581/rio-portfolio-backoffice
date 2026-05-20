<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Carbon\Carbon;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * The command class for pruning up temporary files.
 */
class PruneTmpFilesCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'app:prune-tmp-files {--datetime=}';

    /**
     * The console command description.
     */
    protected $description = 'Prune temporary files.';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $executionDatetime = $this->parseExecutionDatetime();
        $threshold = $executionDatetime->subDay();
        $tmpDisk = Storage::disk('tmp');
        $filePaths = $tmpDisk->allFiles();

        foreach ($filePaths as $filePath) {
            $lastModified = $tmpDisk->lastModified($filePath);

            if ($lastModified < $threshold->timestamp) {
                $tmpDisk->delete($filePath);
            }
        }
    }

    private function parseExecutionDatetime(): Carbon
    {
        $executionDatetime = $this->option('datetime');

        if (is_null($executionDatetime)) {
            return now();
        }

        try {
            return Carbon::createFromFormat('Y-m-d H:i:s', $executionDatetime);
        } catch (Exception $e) {
            Log::error($e);

            exit(1);
        }
    }
}
