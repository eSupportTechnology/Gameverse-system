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
        Schema::table('userroles', function (Blueprint $table) {
            $table->boolean('must_reset_password')->default(false);
            $table->timestamp('temp_password_created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::table('userroles', function (Blueprint $table) {
            $table->dropColumn(['must_reset_password', 'temp_password_created_at']);
        });
    }
};
