<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $perPage = $request->input('per_page', 8); // Default to 8 tasks per page, matching Members
        $search = $request->query('search'); // Optional: Add search support like Members
        $status = $request->query('status'); // Add status filter from query parameter

        // Update overdue tasks in bulk
        Task::whereNotNull('due_date_time')
            ->where('due_date_time', '<', now())
            ->where('status', '!=', 'done')
            ->update(['status' => 'overdue']);

        if ($user->role === 'admin') {
            $tasksQuery = Task::query()
                ->when($search, function ($query, $search) {
                    $query->where('title', 'like', "%{$search}%")
                          ->orWhere('description', 'like', "%{$search}%");
                })
                ->when($status, function ($query, $status) {
                    $query->where('status', $status);
                })
                ->orderBy('created_at', 'desc');
            $users = User::all(['id', 'name']);
        } else {
            $tasksQuery = Task::query()
                ->where('assignee_id', $user->id)
                ->when($search, function ($query, $search) {
                    $query->where('title', 'like', "%{$search}%")
                          ->orWhere('description', 'like', "%{$search}%");
                })
                ->when($status, function ($query, $status) {
                    $query->where('status', $status);
                })
                ->orderBy('created_at', 'desc');
            $users = User::where('id', $user->id)->get(['id', 'name']);
        }

        $tasks = $tasksQuery->paginate($perPage)
            ->withQueryString()
            ->through(function ($task) {
                return $this->formatTask($task);
            });

        return Inertia::render('assignee', [
            'tasks' => $tasks,
            'users' => $users,
            'isAdmin' => $user->role === 'admin',
            'search' => $search, // Pass search term to frontend
            'status' => $status, // Pass status filter to frontend
        ]);
    }

    public function store(Request $request)
    {
        // Only admins can create tasks
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('assignee.index')->with('error', 'Only admins can create tasks.');
        }

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
            'created_by' => Auth::id(),
        ]);

        return redirect()->route('assignee.index')->with('success', 'Task created successfully!');
    }

    public function update(Request $request, Task $task)
    {
        $user = Auth::user();
        Log::info('Update request data:', $request->all());

        if ($user->role === 'admin') {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'attached_file' => 'nullable|file|max:10240',
                'assignee_id' => 'required|exists:users,id',
                'due_date_time' => 'required|date',
                'started_date' => 'required|date',
                'status' => 'required|in:pending,on progress,done,overdue',
            ]);

            $filePath = $task->attached_file;
            if ($request->hasFile('attached_file')) {
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
        } else {
            if ($task->assignee_id !== $user->id) {
                return redirect()->route('assignee.index')->with('error', 'Unauthorized action.');
            }

            $validated = $request->validate([
                'status' => 'required|in:pending,on progress,done,overdue',
            ]);

            $task->update([
                'status' => $validated['status'],
            ]);
        }

        return redirect()->route('assignee.index')->with('success', 'Task updated successfully!');
    }

    public function destroy(Task $task)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('assignee.index')->with('error', 'Only admins can delete tasks.');
        }

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