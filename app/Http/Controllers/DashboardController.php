<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $tasks = Task::whereJsonContains('assignee_emails', auth()->user()->email)
            ->with('admin')
            ->get();

        return Inertia::render('Dashboard', [
            'auth' => auth()->user(),
            'tasks' => $tasks,
        ]);
    }
}