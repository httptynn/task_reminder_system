<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('attached_file')->nullable();
            $table->foreignId('assignee_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('due_date_time');
            $table->timestamp('started_date');
            $table->enum('status', ['pending', 'on progress', 'done', 'overdue'])->default('pending');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};