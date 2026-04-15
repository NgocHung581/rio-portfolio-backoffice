<?php

declare(strict_types=1);

use Common\App\Enums\WebVisibility;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function(Blueprint $table): void {
            $table->id();
            $table->foreignId('category_id')->constrained('categories');
            $table->string('title_en', 100)->unique();
            $table->string('title_vi', 100)->unique();
            $table->text('description_en');
            $table->text('description_vi');
            $table->text('summary_en');
            $table->text('summary_vi');
            $table->boolean('is_highlight');
            $table->string('thumbnail_file_id');
            $table->string('thumbnail_file_name');
            $table->string('thumbnail_file_mime_type');
            $table->unsignedTinyInteger('web_visibility')->default(WebVisibility::Private);
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
