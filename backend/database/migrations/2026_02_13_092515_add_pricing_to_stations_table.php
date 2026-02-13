<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up()
{
    Schema::table('stations', function (Blueprint $table) {
        $table->json('pricing')->nullable()->after('bookings');
        $table->dropColumn(['time', 'price', 'vrTime', 'vrPrice']); // remove old fields
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
