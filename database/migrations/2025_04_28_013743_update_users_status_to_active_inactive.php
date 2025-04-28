<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Step 1: Change status column to VARCHAR to allow temporary values
        Schema::table('users', function (Blueprint $table) {
            $table->string('status', 50)->default('enabled')->change();
        });

        // Step 2: Update existing data
        DB::table('users')
            ->where('status', 'enabled')
            ->update(['status' => 'active']);

        DB::table('users')
            ->where('status', 'disabled')
            ->update(['status' => 'inactive']);

        // Step 3: Change status column back to ENUM with new values
        Schema::table('users', function (Blueprint $table) {
            $table->enum('status', ['active', 'inactive'])->default('active')->change();
        });
    }

    public function down(): void
    {
        // Step 1: Change status column to VARCHAR to allow temporary values
        Schema::table('users', function (Blueprint $table) {
            $table->string('status', 50)->default('active')->change();
        });

        // Step 2: Revert data
        DB::table('users')
            ->where('status', 'active')
            ->update(['status' => 'enabled']);

        DB::table('users')
            ->where('status', 'inactive')
            ->update(['status' => 'disabled']);

        // Step 3: Revert column to original ENUM
        Schema::table('users', function (Blueprint $table) {
            $table->enum('status', ['enabled', 'disabled'])->default('enabled')->change();
        });
    }
};