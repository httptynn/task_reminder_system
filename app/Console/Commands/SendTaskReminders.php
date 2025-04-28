<?php

namespace App\Console\Commands;

use App\Models\Task;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendTaskReminders extends Command
{
    protected $signature = 'tasks:send-reminders';
    protected $description = 'Send reminders for upcoming, overdue, and progress check-in tasks';

    public function handle()
    {
        $this->sendUpcomingDueDateReminders();
        $this->sendOverdueTaskReminders();
        $this->sendProgressCheckInReminders();

        $this->info('Task reminders sent successfully.');
    }

    protected function sendUpcomingDueDateReminders()
    {
        $now = now();
        $tasks = Task::where('status', '!=', 'done')
            ->whereBetween('due_date_time', [
                $now->copy()->addHours(24),
                $now->copy()->addHours(48),
            ])
            ->get();

        foreach ($tasks as $task) {
            $assignee = User::find($task->assignee_id);
            if ($assignee) {
                // Notification for the assignee
                Notification::create([
                    'user_id' => null, // System-generated
                    'recipient_id' => $assignee->id,
                    'message' => "Reminder: Task '{$task->title}' is due on {$task->due_date_time->format('Y-m-d H:i')}.",
                    'is_read' => false,
                ]);

                // Notify admins
                $admins = User::where('role', 'admin')->get();
                foreach ($admins as $admin) {
                    Notification::create([
                        'user_id' => null,
                        'recipient_id' => $admin->id,
                        'message' => "system: Task '{$task->title}' assigned to {$assignee->name} is due soon on {$task->due_date_time->format('Y-m-d H:i')}.",
                        'is_read' => false,
                    ]);
                }
            }
        }
    }

    protected function sendOverdueTaskReminders()
    {
        $tasks = Task::where('status', '!=', 'done')
            ->where('due_date_time', '<', now())
            ->get();

        foreach ($tasks as $task) {
            $assignee = User::find($task->assignee_id);
            if ($assignee) {
                // Notification for the assignee
                Notification::create([
                    'user_id' => null,
                    'recipient_id' => $assignee->id,
                    'message' => "Urgent: Task '{$task->title}' is overdue since {$task->due_date_time->format('Y-m-d H:i')}. Please update its status.",
                    'is_read' => false,
                ]);

                // Notify admins
                $admins = User::where('role', 'admin')->get();
                foreach ($admins as $admin) {
                    Notification::create([
                        'user_id' => null,
                        'recipient_id' => $admin->id,
                        'message' => "system: Task '{$task->title}' assigned to {$assignee->name} is overdue since {$task->due_date_time->format('Y-m-d H:i')}.",
                        'is_read' => false,
                    ]);
                }
            }
        }
    }

    protected function sendProgressCheckInReminders()
    {
        $tasks = Task::where('status', '!=', 'done')
            ->where('updated_at', '<', now()->subDays(3))
            ->get();

        foreach ($tasks as $task) {
            $assignee = User::find($task->assignee_id);
            if ($assignee) {
                // Notify admins only
                $admins = User::where('role', 'admin')->get();
                foreach ($admins as $admin) {
                    Notification::create([
                        'user_id' => null,
                        'recipient_id' => $admin->id,
                        'message' => "system: Task '{$task->title}' assigned to {$assignee->name} has not been updated since {$task->updated_at->format('Y-m-d H:i')}. Please check in.",
                        'is_read' => false,
                    ]);
                }
            }
        }
    }
}