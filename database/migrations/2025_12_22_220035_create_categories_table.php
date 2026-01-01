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
        Schema::create('categories', function(Blueprint $table): void {
            $table->id();
            $table->string('name_en', 25)->unique();
            $table->string('name_vi', 25)->unique();
            $table->unsignedTinyInteger('media_type');
            $table->unsignedTinyInteger('web_visibility')->default(WebVisibility::Private);
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
