<?php

declare(strict_types=1);

use App\Models\Album;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('album_media', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Album::class)->constrained();
            $table->unsignedTinyInteger('column_span');
            $table->boolean('is_displayed_on_banner')->nullable()->default(0);
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('album_media');
    }
};
