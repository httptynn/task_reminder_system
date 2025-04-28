<?php

// namespace App\Http\Controllers;

// use App\Models\User;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Hash;
// use Inertia\Inertia;
// use Illuminate\Support\Facades\Redirect;

// class MemberController extends Controller
// {
//     // MemberController.php
// public function index(Request $request)
// {
//     $perPage = $request->input('per_page', 8);
//     $search = $request->query('search');

//     $members = User::query()
//         ->when($search, function ($query, $search) {
//             $query->where('name', 'like', "%{$search}%")
//                   ->orWhere('email', 'like', "%{$search}%");
//         })
//         ->whereIn('role', ['user', 'admin'])
//         ->orderBy('created_at', 'desc')
//         ->paginate($perPage)
//         ->withQueryString()
//         ->through(function ($user) {
//             return [
//                 'id' => $user->id,
//                 'name' => $user->name,
//                 'email' => $user->email,
//                 'role' => $user->role ?? 'user',
//                 'created_at' => $user->created_at->toDateTimeString(), // Include created_at
//             ];
//         });

//     $staticReasons = [
//         'leave' => 'Member is on leave',
//         'security' => 'Security concern',
//         'offboarding' => 'Offboarding',
//         'transition' => 'Role/project transition',
//         'other' => 'Other',
//     ];

//     $customReasons = \App\Models\StatusLog::whereNotNull('reason')
//         ->distinct()
//         ->pluck('reason')
//         ->toArray();

//     $statusReasons = array_unique(array_merge(array_values($staticReasons), $customReasons));

//     return Inertia::render('members', [
//         'members' => $members,
//         'search' => $search,
//         'statusReasons' => $statusReasons,
//     ]);
// }

//     public function store(Request $request)
//     {
//         $validated = $request->validate([
//             'name' => 'required|string|max:255',
//             'email' => 'required|email|max:255|unique:users,email',
//             'role' => 'required|in:user,admin',
//             'status' => 'required|in:active,inactive',
//             'password' => 'required|string|min:8|confirmed',
//         ]);

//         $user = User::create([
//             'name' => $validated['name'],
//             'email' => $validated['email'],
//             'role' => $validated['role'],
//             'status' => $validated['status'],
//             'password' => Hash::make($validated['password']),
//         ]);

//         if ($validated['status'] === 'inactive' && $request->has('reason')) {
//             $reason = $request->input('reason');
//             $reasonMap = [
//                 'leave' => 'Member is on leave',
//                 'security' => 'Security concern',
//                 'offboarding' => 'Offboarding',
//                 'transition' => 'Role/project transition',
//                 'other' => 'Other',
//             ];
//             $reason = $reasonMap[$reason] ?? $reason;

//             \App\Models\StatusLog::create([
//                 'user_id' => $user->id,
//                 'status' => $validated['status'],
//                 'reason' => $reason,
//                 'changed_at' => now(),
//             ]);
//         }

//         return redirect()->route('members')->with('success', 'Member added successfully!');
//     }

//     public function update(Request $request, User $user)
//     {
//         $rules = [];

//         // Validation for name, email, and role if any are provided
//         if ($request->hasAny(['name', 'email', 'role'])) {
//             $rules = array_merge($rules, [
//                 'name' => 'required|string|max:255',
//                 'email' => 'required|email|max:255|unique:users,email,' . $user->id,
//                 'role' => 'required|in:user,admin',
//             ]);
//         }

//         // Validation for status and reason if status is provided
//         if ($request->has('status')) {
//             $rules['status'] = 'required|in:active,inactive';
//             $rules['reason'] = 'nullable|string|max:255';
//         }

//         // Validation for password fields only if password is provided
//         if ($request->filled('password')) {
//             $rules['old_password'] = ['required', function ($attribute, $value, $fail) use ($user) {
//                 if (!Hash::check($value, $user->password)) {
//                     $fail('The old password is incorrect.');
//                 }
//             }];
//             $rules['password'] = 'required|string|min:8|confirmed';
//         }

//         $validated = $request->validate($rules);

//         $reason = isset($validated['reason']) ? $validated['reason'] : null;
//         if ($reason) {
//             $reasonMap = [
//                 'leave' => 'Member is on leave',
//                 'security' => 'Security concern',
//                 'offboarding' => 'Offboarding',
//                 'transition' => 'Role/project transition',
//                 'other' => 'Other',
//             ];
//             $reason = $reasonMap[$reason] ?? $reason;
//         }

//         // Update fields only if they are provided in the validated data
//         if (isset($validated['name'])) {
//             $user->name = $validated['name'];
//         }
//         if (isset($validated['email'])) {
//             $user->email = $validated['email'];
//         }
//         if (isset($validated['status'])) {
//             $user->status = $validated['status'];
//         }
//         if (isset($validated['role'])) {
//             $user->role = $validated['role'];
//         }
//         if (isset($validated['password'])) {
//             $user->password = Hash::make($validated['password']);
//         }

//         // Log status change if a reason is provided
//         if ($reason && isset($validated['status'])) {
//             \App\Models\StatusLog::create([
//                 'user_id' => $user->id,
//                 'status' => $validated['status'],
//                 'reason' => $reason,
//                 'changed_at' => now(),
//             ]);
//         }

//         $user->save();

//         return redirect()->route('members')->with('success', 'Member updated successfully!');
//     }

//     public function destroy(User $user)
//     {
//         $user->delete();
//         return Redirect::route('members')->with('success', 'Member deleted successfully.');
//     }
// }

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 9);
        $search = $request->query('search');

        $members = User::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->whereIn('role', ['user', 'admin'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString()
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role ?? 'user',
                    'created_at' => $user->created_at->toDateTimeString(),
                ];
            });

        return Inertia::render('members', [
            'members' => $members,
            'search' => $search,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'role' => 'required|in:user,admin',
            'password' => 'required|string|min:8|confirmed',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('members')->with('success', 'Member added successfully!');
    }

    public function update(Request $request, User $user)
    {
        $rules = [];

        // Validation for name, email, and role if any are provided
        if ($request->hasAny(['name', 'email', 'role'])) {
            $rules = array_merge($rules, [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email,' . $user->id,
                'role' => 'required|in:user,admin',
            ]);
        }

        // Validation for password fields only if password is provided
        if ($request->filled('password')) {
            $rules['old_password'] = ['required', function ($attribute, $value, $fail) use ($user) {
                if (!Hash::check($value, $user->password)) {
                    $fail('The old password is incorrect.');
                }
            }];
            $rules['password'] = 'required|string|min:8|confirmed';
        }

        $validated = $request->validate($rules);

        // Update fields only if they are provided in the validated data
        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }
        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }
        if (isset($validated['role'])) {
            $user->role = $validated['role'];
        }
        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->route('members')->with('success', 'Member updated successfully!');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return Redirect::route('members')->with('success', 'Member deleted successfully.');
    }
}