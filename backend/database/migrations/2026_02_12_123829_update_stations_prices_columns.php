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
        
            if (Schema::hasColumn('stations', 'price_30')) {
                $table->dropColumn('price_30');
            }
            if (Schema::hasColumn('stations', 'price_60')) {
                $table->dropColumn('price_60');
            }
            if (Schema::hasColumn('stations', 'vr_price_30')) {
                $table->dropColumn('vr_price_30');
            }
            if (Schema::hasColumn('stations', 'vr_price_60')) {
                $table->dropColumn('vr_price_60');
            }

            if (!Schema::hasColumn('stations', 'price')) {
                $table->decimal('price', 10, 2)->default(0);
            }
            if (!Schema::hasColumn('stations', 'time')) {
                $table->string('time', 5)->nullable(); // e.g., "00:30"
            }
            if (!Schema::hasColumn('stations', 'vrPrice')) {
                $table->decimal('vrPrice', 10, 2)->nullable();
            }
            if (!Schema::hasColumn('stations', 'vrTime')) {
                $table->string('vrTime', 5)->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stations', function (Blueprint $table) {
           
            $table->dropColumn(['price', 'time', 'vrPrice', 'vrTime']);

            $table->decimal('price_30', 10, 2)->default(0);
            $table->decimal('price_60', 10, 2)->default(0);
            $table->decimal('vr_price_30', 10, 2)->nullable();
            $table->decimal('vr_price_60', 10, 2)->nullable();
        });
    }
};
