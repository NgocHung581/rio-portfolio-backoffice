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
        Schema::create('media_items', function(Blueprint $table): void {
            $table->id();
            $table->foreignId('gallery_id')->constrained('galleries');
            $table->string('file_id');
            $table->string('file_name');
            $table->string('file_mime_type');
            $table->string('frame', 5);
            $table->boolean('is_banner')->default(false);
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
