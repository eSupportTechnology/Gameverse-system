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
         Schema::table('stations', function (Blueprint $table) {
        if (Schema::hasColumn('stations', 'price')) {
            $table->dropColumn('price');
        }
        if (Schema::hasColumn('stations', 'time')) {
            $table->dropColumn('time');
        }

        if (!Schema::hasColumn('stations', 'price_30')) {
            $table->decimal('price_30', 8, 2);
        }
        if (!Schema::hasColumn('stations', 'price_60')) {
            $table->decimal('price_60', 8, 2);
        }
         });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::table('stations', function (Blueprint $table) {

        $table->dropColumn(['price_30', 'price_60']);

        $table->decimal('price', 8, 2);
        $table->integer('time');
    });
    }
};
