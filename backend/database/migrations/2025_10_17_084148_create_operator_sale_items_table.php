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
        Schema::create('operator_sale_items', function (Blueprint $table) {
            $table->id();
            // Link to operator_pos_sales table
            $table->foreignId('sale_id')->constrained('operator_pos_sales')->onDelete('cascade');
            // Link to operator_pos_items table
            $table->foreignId('item_id')->constrained('operator_pos_items')->onDelete('cascade');
            $table->integer('quantity');
            $table->decimal('unit_price', 10, 2);
            $table->decimal('subtotal', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operator_sale_items');
    }
};
