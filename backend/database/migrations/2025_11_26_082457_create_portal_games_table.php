<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('portal_games', function (Blueprint $table) {
            $table->id();
            $table->string('title');  // Game title
            $table->text('desc')->nullable();   // Game description
            $table->string('thumbnail')->nullable(); // Thumbnail image path
            $table->timestamps();               // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portal_games');
    }
};
