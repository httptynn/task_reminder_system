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
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
