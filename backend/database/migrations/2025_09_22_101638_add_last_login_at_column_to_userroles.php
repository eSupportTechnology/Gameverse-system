<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('userroles', function (Blueprint $table) {
        if (!Schema::hasColumn('userroles', 'last_login_at')) {
            $table->timestamp('last_login_at')->nullable()->after('active_status');
        }
    });
    }

    public function down(): void
    {
        Schema::table('userroles', function (Blueprint $table) {
            $table->dropColumn('last_login_at');
        });
    }
};
