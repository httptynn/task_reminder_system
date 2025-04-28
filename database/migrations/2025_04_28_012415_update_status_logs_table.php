<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Step 1: Modify the enum column to include new values
        Schema::table('status_logs', function (Blueprint $table) {
            $table->enum('status', ['enabled', 'disabled', 'active', 'inactive'])->change();
        });

        // Step 2: Update existing records
        DB::table('status_logs')
            ->where('status', 'enabled')
            ->update(['status' => 'active']);

        DB::table('status_logs')
            ->where('status', 'disabled')
            ->update(['status' => 'inactive']);

        // Step 3: Modify the enum column to only include new values
        Schema::table('status_logs', function (Blueprint $table) {
            $table->enum('status', ['active', 'inactive'])->change();
        });
    }

    public function down(): void
    {
        // Step 1: Modify the enum column to include old values
        Schema::table('status_logs', function (Blueprint $table) {
            $table->enum('status', ['enabled', 'disabled', 'active', 'inactive'])->change();
        });

        // Step 2: Revert records
        DB::table('status_logs')
            ->where('status', 'active')
            ->update(['status' => 'enabled']);

        DB::table('status_logs')
            ->where('status', 'inactive')
            ->update(['status' => 'disabled']);

        // Step 3: Modify the enum column to only include old values
        Schema::table('status_logs', function (Blueprint $table) {
            $table->enum('status', ['enabled', 'disabled'])->change();
        });
    }
};