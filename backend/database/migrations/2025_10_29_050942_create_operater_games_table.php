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
        Schema::create('operater_games', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('operator_id'); // operator reference
            $table->string('title');
            $table->string('location');
            $table->enum('method', ['Coin', 'Arrow', 'Per Hour']);
            $table->decimal('price', 10, 2);
            $table->timestamps();

            // Optional: Add foreign key constraint to users table
            $table->foreign('operator_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operater_games');
    }
};
