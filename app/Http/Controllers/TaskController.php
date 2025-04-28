<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Task;
use App\Models\Notification; // Add this import for Notification model
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 9);
        $search = $request->query('search');
        $status = $request->query('status');

        // Update overdue tasks in bulk
        Task::whereNotNull('due_date_time')
            ->where('due_date_time', '<', now())
            ->where('status', '!=', 'done')
            ->update(['status' => 'overdue']);

        $tasksQuery = Task::query()
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc');

        $tasks = $tasksQuery->paginate($perPage)
            ->withQueryString()
            ->through(function ($task) {
                return $this->formatTask($task);
            });

        $users = User::all(['id', 'name']);

        return Inertia::render('assignee', [
            'tasks' => $tasks,
            'users' => $users,
            'isAdmin' => true,
            'search' => $search,
            'status' => $status,
        ]);
    }

    public function store(Request $request)
    {
        Log::info('Full request data:', $request->all());
        Log::info('Files in request:', $request->allFiles());
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'attached_file' => 'nullable|file|max:10240',
            'assignee_id' => 'required|exists:users,id',
            'due_date_time' => 'required|date',
            'started_date' => 'required|date',
            'status' => 'required|in:pending,on progress,done,overdue',
        ]);

        $filePath = null;
        if ($request->hasFile('attached_file')) {
            $filePath = $request->file('attached_file')->store('task_files', 'public');
        }

        $task = Task::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'attached_file' => $filePath,
            'assignee_id' => $validated['assignee_id'],
            'due_date_time' => $validated['due_date_time'],
            'started_date' => $validated['started_date'],
            'status' => $validated['status'],
            'created_by' => auth()->id(),
        ]);

        // Notify assignee
        Notification::create([
            'user_id' => auth()->id(),
            'recipient_id' => $task->assignee_id,
            'message' => "New task assigned: '{$task->title}' due on {$task->due_date_time->format('Y-m-d H:i')}.",
            'is_read' => false,
        ]);

        // Notify admins
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => auth()->id(),
                'recipient_id' => $admin->id,
                'message' => "system: New task '{$task->title}' assigned to " . User::find($task->assignee_id)->name . ".",
                'is_read' => false,
            ]);
        }

        return redirect()->route('assignee.index')->with('success', 'Task created successfully!');
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'attached_file' => 'nullable|file|max:10240',
            'assignee_id' => 'required|exists:users,id',
            'due_date_time' => 'required|date',
            'started_date' => 'required|date',
            'status' => 'required|in:pending,on progress,done,overdue',
            'remove_file' => 'nullable|in:1',
        ]);

        $filePath = $task->attached_file;
        if ($request->input('remove_file') == '1') {
            if ($filePath) {
                Storage::disk('public')->delete($filePath);
                $filePath = null;
            }
        } elseif ($request->hasFile('attached_file')) {
            if ($filePath) {
                Storage::disk('public')->delete($filePath);
            }
            $filePath = $request->file('attached_file')->store('task_files', 'public');
        }

        $task->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'attached_file' => $filePath,
            'assignee_id' => $validated['assignee_id'],
            'due_date_time' => $validated['due_date_time'],
            'started_date' => $validated['started_date'],
            'status' => $validated['status'],
        ]);

        // Notify assignee if reassigned
        if ($task->wasChanged('assignee_id')) {
            Notification::create([
                'user_id' => auth()->id(),
                'recipient_id' => $task->assignee_id,
                'message' => "Task reassigned to you: '{$task->title}' due on {$task->due_date_time->format('Y-m-d H:i')}.",
                'is_read' => false,
            ]);
        }

        // Notify if status changed
        if ($task->wasChanged('status')) {
            Notification::create([
                'user_id' => auth()->id(),
                'recipient_id' => $task->assignee_id,
                'message' => "Task '{$task->title}' status updated to {$task->status}.",
                'is_read' => false,
            ]);

            // Notify admins
            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                Notification::create([
                    'user_id' => auth()->id(),
                    'recipient_id' => $admin->id,
                    'message' => "system: Task '{$task->title}' status updated to {$task->status} for " . User::find($task->assignee_id)->name . ".",
                    'is_read' => false,
                ]);
            }
        }

        return redirect()->route('assignee.index')->with('success', 'Task updated successfully!');
    }

    public function destroy(Task $task)
    {
        if ($task->attached_file) {
            Storage::disk('public')->delete($task->attached_file);
        }

        $task->delete();
        return redirect()->route('assignee.index')->with('success', 'Task deleted successfully!');
    }

    protected function formatTask($task)
    {
        return [
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description,
            'attached_file' => $task->attached_file ? Storage::url($task->attached_file) : null,
            'assignee_id' => $task->assignee_id,
            'assignee' => User::find($task->assignee_id)?->name ?? 'Unknown',
            'due_date_time' => $task->due_date_time?->toISOString() ?? null,
            'started_date_time' => $task->started_date?->toISOString() ?? null,
            'status' => $task->status,
        ];
    }
}