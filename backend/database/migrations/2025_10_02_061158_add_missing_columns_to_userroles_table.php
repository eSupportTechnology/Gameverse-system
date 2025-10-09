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
        if (!Schema::hasColumn('userroles', 'avatar')) {
            $table->string('avatar')->nullable()->after('role');
        }
        if (!Schema::hasColumn('userroles', 'must_reset_password')) {
            $table->boolean('must_reset_password')->default(false)->after('active_status');
        }
        if (!Schema::hasColumn('userroles', 'temp_password_created_at')) {
            $table->timestamp('temp_password_created_at')->nullable()->after('must_reset_password');
        }
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('userroles', function (Blueprint $table) {
           $table->dropColumn(['avatar', 'must_reset_password', 'temp_password_created_at']);
        });
    }
};
