<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('media_files', function(Blueprint $table): void {
            $table->id();
            $table->unsignedTinyInteger('file_type');
            $table->string('file_path')->unique();
            $table->string('file_name', 50)->unique();
            $table->unsignedBigInteger('file_size');
            $table->unsignedBigInteger('media_fileable_id');
            $table->string('media_fileable_type', 50);
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_files');
    }
};
