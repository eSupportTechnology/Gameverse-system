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
        Schema::table('admin_booking', function (Blueprint $table) {
           // Change 'fees' from decimal to string (payment method)
            $table->string('fees')->change(); 

            // Add 'amount' column after 'fees'
            $table->decimal('amount', 10, 2)->after('fees');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('admin_booking', function (Blueprint $table) {
            // Revert 'fees' back to decimal
            $table->decimal('fees', 10, 2)->change();

            // Drop 'amount' column
            $table->dropColumn('amount');
        });
    }
};
