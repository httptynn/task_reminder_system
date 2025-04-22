<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStatusLogsTable extends Migration
{
    public function up()
    {
        Schema::create('status_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['enabled', 'disabled']);
            $table->string('reason')->nullable();
            $table->timestamp('changed_at');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('status_logs');
    }
}