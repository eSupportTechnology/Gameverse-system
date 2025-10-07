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
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('location');
            $table->string('playing_method');
            $table->decimal('price', 10, 2);
            $table->integer('quantity')->nullable(); // For Arcade Machine, Archery
            $table->integer('players')->nullable(); // For Carrom
            $table->enum('category', ['Arcade Machine', 'Archery', 'Carrom']);
            $table->decimal('full_amount', 10, 2)->default(0);
            $table->decimal('discount_price', 10, 2)->default(0);
            $table->decimal('balance_payment', 10, 2)->default(0);
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
