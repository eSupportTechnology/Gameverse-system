<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('nfc_users', function (Blueprint $table) {
            $table->string('email')->unique()->after('full_name');
                        $table->timestamp('last_written_at')->nullable()->after('updated_at');

        });
    }

    public function down()
    {
        Schema::table('nfc_users', function (Blueprint $table) {
            $table->dropColumn('email');
                        $table->dropColumn('last_written_at');

        });
    }
};
