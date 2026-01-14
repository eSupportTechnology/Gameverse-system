<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('games', function (Blueprint $table) {
            // First, migrate existing paid_amount data to balance before dropping the column
            // This will be done via raw SQL to ensure data integrity
        });
        
        // Update balance to include paid_amount
        DB::statement('UPDATE games SET balance = balance + COALESCE(paid_amount, 0)');
        
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn('paid_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->decimal('paid_amount', 10, 2)->default(0)->after('price');
        });
    }
};
