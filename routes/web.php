<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('Task', function () {
        return Inertia::render('Task');
    })->name('Task');

    Route::get('members', function () {
        $members = User::all(); // Fetch all users
        return Inertia::render('members', ['members' => $members]);
    })->middleware('role:admin')->name('members');

    Route::get('Notification', function () {
        return Inertia::render('Notification');
    })->name('Notification');

    Route::get('assignee', function () {
        return Inertia::render('assignee');
    })->name('assignee');

    Route::get('user/profile', function () {
        $user = auth()->user();
        return Inertia::render('UserProfile', [
            'auth' => [
                'user' => [
                    'avatar' => $user->avatar ? Storage::url($user->avatar) : null,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'description' => $user->description,
                ],
            ],
        ]);
    })->name('user.profile');

    Route::get('user/profile/edit', function () {
        $user = auth()->user();
        return Inertia::render('UserProfileEdit', [
            'auth' => [
                'user' => [
                    'avatar' => $user->avatar ? Storage::url($user->avatar) : null,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'description' => $user->description,
                ],
            ],
        ]);
    })->name('user.profile.edit');

    Route::post('user/profile', function (Request $request) {
        $user = auth()->user();

        $validated = $request->validate([
            'avatar' => ['nullable', 'file', 'mimetypes:image/*', 'max:2048'], // 2MB max, any image type
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'role' => ['required', 'in:user,admin,manager'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        // Handle avatar upload
        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            // Delete old avatar if it exists
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            // Store new avatar
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = $path;
        } else {
            // Preserve existing avatar if no new file is uploaded
            $validated['avatar'] = $user->avatar;
        }

        $user->update($validated);

        return redirect()->route('user.profile')->with('success', 'Profile updated successfully.');
    })->name('user.profile.update');

    Route::get('task/{id}', function ($id, Request $request) {
    $cards = [
        [
            'title' => 'Project Alpha',
            'dateAdded' => '2025-04-01',
            'dateEnd' => '2025-06-30',
        ],
        [
            'title' => 'Website Redesign',
            'dateAdded' => '2025-03-15',
            'dateEnd' => '2025-05-15',
        ],
        [
            'title' => 'Mobile App Dev',
            'dateAdded' => '2025-04-10',
            'dateEnd' => '2025-07-20',
        ],
        [
            'title' => 'Marketing Campaign',
            'dateAdded' => '2025-04-20',
            'dateEnd' => '2025-08-01',
        ],
    ];

    $index = (int) $id;
    $card = $cards[$index] ?? null;

    if (!$card) {
        abort(404, 'Card not found');
    }

    $user = auth()->user();

    return Inertia::render('TaskDetail', [
        'card' => $card,
        'auth' => [
            'user' => [
                'avatar' => $user->avatar ? Storage::url($user->avatar) : null,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ],
    ]);
})->name('task.view');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';