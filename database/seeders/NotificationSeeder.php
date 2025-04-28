<?php

namespace Database\Seeders;

use App\Models\Notification;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        // User-specific notification (e.g., for Stephanie Lucero, ID 1)
        Notification::create([
            'recipient_id' => 1, // Stephanie Lucero
            'user_id' => 1, // Same user as the trigger
            'message' => 'Test notification for Stephanie Lucero',
            'is_read' => false,
        ]);

        // Another user-specific notification (e.g., for Alyssa M. Reyes, ID 19)
        Notification::create([
            'recipient_id' => 19, // Alyssa M. Reyes
            'user_id' => 1, // Triggered by Stephanie Lucero
            'message' => 'Test notification for Alyssa M. Reyes',
            'is_read' => false,
        ]);

        // System-wide notification
        Notification::create([
            'recipient_id' => null,
            'user_id' => null,
            'message' => 'system: System-wide announcement',
            'is_read' => false,
        ]);
    }
}