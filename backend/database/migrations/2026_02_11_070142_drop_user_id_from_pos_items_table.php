<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('pos_items', function (Blueprint $table) {
            // Drop the foreign key first
            $table->dropForeign(['user_id']); // <--- drop foreign key constraint
            $table->dropColumn('user_id');    // then drop the column
        });
    }

    public function down(): void
    {
        Schema::table('pos_items', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
};
