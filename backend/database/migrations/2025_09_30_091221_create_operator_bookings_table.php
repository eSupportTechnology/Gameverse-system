<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
     
    public function up()
{
    Schema::create('operator_bookings', function (Blueprint $table) {
        $table->id();
        $table->string('customer_name');
        $table->string('phone_number');
        $table->string('station');
        $table->date('date');
        $table->time('start_time');
        $table->string('duration');
        $table->string('payment_method');
        $table->decimal('amount', 10, 2);
        $table->string('status')->default('pending'); // optional: track booking status
        $table->timestamps();
    });
}
    public function down(): void
    {
        Schema::dropIfExists('operator_bookings');
    }
};
