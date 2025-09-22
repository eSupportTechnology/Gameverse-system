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
         Schema::create('userroles', function (Blueprint $table) {
        $table->id();
        $table->string('fullname');
        $table->string('username')->unique();
        $table->string('email')->unique();
        $table->string('password');
        $table->enum('role', ['admin', 'operator'])->default('operator');
        $table->boolean('active_status')->default(true);
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('userroles');
    }
};
