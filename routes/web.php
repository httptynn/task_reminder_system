<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/members', [MemberController::class, 'index'])->middleware('role:admin')->name('members');
    Route::post('/members', [MemberController::class, 'store'])->middleware('role:admin')->name('members.store');
    Route::patch('/members/{user}', [MemberController::class, 'update'])->middleware('role:admin')->name('members.update');
    Route::delete('/members/{user}', [MemberController::class, 'destroy'])->middleware('role:admin')->name('members.destroy');

    Route::get('calendar', function () {
        return Inertia::render('calendar'); // Note: Use 'Calendar' (capitalized, no .tsx extension)
    })->name('calendar');

    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications');
Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllRead'])->name('notifications.markAllRead');
Route::post('notifications/{notification}/mark-read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');

    Route::get('assignee', [TaskController::class, 'index'])->name('assignee.index');
    Route::post('assignee', [TaskController::class, 'store'])->name('assignee.store');
    Route::patch('assignee/{task}', [TaskController::class, 'update'])->name('assignee.update');
    Route::delete('assignee/{task}', [TaskController::class, 'destroy'])->name('assignee.destroy');

});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
