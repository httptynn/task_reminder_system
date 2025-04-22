<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // The user who triggered the notification (e.g., admin who made a change)
            $table->foreignId('recipient_id')->constrained('users')->onDelete('cascade'); // The user receiving the notification
            $table->string('message'); // Notification message (e.g., "Task overdue: Complete Project X")
            $table->boolean('read')->default(false); // Read status
            $table->timestamp('created_at')->useCurrent(); // When the notification was created
            $table->timestamp('updated_at')->nullable(); // When the notification was last updated
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}