<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use App\Http\Controllers\MemberController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/members', [MemberController::class, 'index'])->middleware('role:admin')->name('members');
    Route::post('/members', [MemberController::class, 'store'])->middleware('role:admin')->name('members.store');
    Route::patch('/members/{user}', [MemberController::class, 'update'])->middleware('role:admin')->name('members.update');
    Route::delete('/members/{user}', [MemberController::class, 'destroy'])->middleware('role:admin')->name('members.destroy');

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
