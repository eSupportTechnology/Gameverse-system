<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stations', function (Blueprint $table) {
            $table->id();
            $table->string('name', 191);          // Station name
            $table->string('type', 50);           // PlayStation / Pool / Simulator
            $table->string('location', 100);      // Location text
            $table->decimal('price', 10, 2);      // Price per session
            $table->string('status', 20)->default('Available'); // Available / Occupied
            $table->integer('bookings')->default(0);            // Total bookings
            $table->integer('time');               // Total minutes per session
            $table->timestamps();                  // created_at / updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stations');
    }
};
