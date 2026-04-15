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
        Schema::create('game_checkouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->onDelete('cascade');

            $table->json('method'); // 🔥 important

            $table->decimal('balance', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);

            $table->string('nfc_card_number')->nullable();
            $table->string('customer_name')->nullable();
            $table->string('phone_number')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_checkouts');
    }
};
