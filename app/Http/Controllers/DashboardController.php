<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // Update overdue tasks (consistent with TaskController)
        Task::whereNotNull('due_date_time')
            ->where('due_date_time', '<', now())
            ->where('status', '!=', 'done')
            ->update(['status' => 'overdue']);

        // Determine tasks based on user role
        $tasksQuery = $user->role === 'admin'
            ? Task::query()
            : Task::query()->where('assignee_id', $user->id);

        $tasks = $tasksQuery->get();

        // Compute task statistics
        $stats = [
            'pending' => $tasks->where('status', 'pending')->count(),
            'done' => $tasks->where('status', 'done')->count(),
            'overdue' => $tasks->where('status', 'overdue')->count(),
            'on_progress' => $tasks->where('status', 'on progress')->count(),
        ];

        // Fetch recent tasks (latest 5, with assignee names)
        $recentTasks = $tasksQuery
            ->with('assignee')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'description' => $task->description, // Add description
                    'status' => $task->status,
                    'due_date_time' => $task->due_date_time?->toISOString() ?? null,
                    'assignee' => $task->assignee ? $task->assignee->name : 'Unknown',
                ];
            });

        // Breadcrumbs consistent with other components
        $breadcrumbs = [
            ['title' => 'Dashboard', 'href' => '/dashboard'],
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentTasks' => $recentTasks,
            'breadcrumbs' => $breadcrumbs,
            'isAdmin' => $user->role === 'admin',
        ]);
    }
}