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
        $table->decimal('vr_price_30', 8, 2)->nullable();
        $table->decimal('vr_price_60', 8, 2)->nullable();

        $table->dropColumn(['vrTime', 'vrPrice']);
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stations', function (Blueprint $table) {
        $table->integer('vrTime')->nullable();
        $table->decimal('vrPrice', 8, 2)->nullable();

        $table->dropColumn(['vr_price_30', 'vr_price_60']);
    });
    }
};
