<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up()
{
    Schema::table('stations', function (Blueprint $table) {
        if (!Schema::hasColumn('stations', 'pricing')) {
            $table->json('pricing')->nullable()->after('bookings');
        }
        
        // Drop old pricing columns if they exist
        if (Schema::hasColumn('stations', 'time')) {
            $table->dropColumn('time');
        }
        if (Schema::hasColumn('stations', 'price')) {
            $table->dropColumn('price');
        }
        if (Schema::hasColumn('stations', 'vrTime')) {
            $table->dropColumn('vrTime');
        }
        if (Schema::hasColumn('stations', 'vrPrice')) {
            $table->dropColumn('vrPrice');
        }
    });
}

public function down()
{
    Schema::table('stations', function (Blueprint $table) {
        $table->integer('time')->nullable();
        $table->decimal('price', 10, 2)->nullable();
        $table->integer('vrTime')->nullable();
        $table->decimal('vrPrice', 10, 2)->nullable();
        $table->dropColumn('pricing');
    });
}

};
