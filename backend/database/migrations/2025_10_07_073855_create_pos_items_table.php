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
        Schema::create('pos_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // foreign key
            $table->string('category');
            $table->string('item_name');
            $table->decimal('price', 10, 2);
            $table->integer('stock');
            $table->boolean('loyality_price')->default(false);
            $table->timestamps();

            // foreign key constraint
            $table->foreign('user_id')
                ->references('id')
                ->on('userroles')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pos_items');
    }
};
