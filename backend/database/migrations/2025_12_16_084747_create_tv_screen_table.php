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
        Schema::create('tv_screen', function (Blueprint $table) {
            $table->id();
            $table->string('file_path');
            $table->enum('file_type', ['image', 'video']);
            $table->enum('status', ['posted', 'hold'])->default('posted');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tv_screen');
    }
};
