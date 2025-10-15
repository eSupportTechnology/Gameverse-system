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
        Schema::create('nfc_users', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('card_no')->unique();
            $table->string('phone_no');
            $table->string('nic_number')->unique();
            $table->integer('points')->default(0);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->string('avatar')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nfc_users');
    }
};
