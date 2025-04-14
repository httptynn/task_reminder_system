<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('members', function () {
        $members = User::all(); // Fetch all users
        return Inertia::render('members', ['members' => $members]);
    })->middleware('role:admin')->name('members');

    Route::get('calendar', function () {
        return Inertia::render('calendar'); // Note: Use 'Calendar' (capitalized, no .tsx extension)
    })->name('calendar');

    Route::get('notifications', function () {
        $notifications = User::all();
        return Inertia::render('notifications', ['notifications' => $notifications]);
    })->middleware('role:admin')->name('notifications');

    Route::get('assignee', function () {
        return Inertia::render('assignee');
    })->name('assignee');

});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
