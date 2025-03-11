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
        Schema::create('albums', function(Blueprint $table): void {
            $table->id();
            $table->string('title_en', 100);
            $table->string('title_vi', 100);
            $table->string('name_en', 50)->unique();
            $table->string('name_vi', 50)->unique();
            $table->text('description_en');
            $table->text('description_vi');
            $table->text('summary_en');
            $table->text('summary_vi');
            $table->string('slug', 100)->unique();
            $table->boolean('is_highlight')->nullable()->default(0);
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->softDeletesDatetime();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('albums');
    }
};
