<?php

// namespace App\Http\Controllers;

// use App\Models\User;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Hash;
// use Inertia\Inertia;
// use Illuminate\Support\Facades\Redirect;

// class MemberController extends Controller
// {
//     public function index()
//     {
//         $members = User::all()->map(function ($user) {
//             return [
//                 'id' => $user->id,
//                 'name' => $user->name,
//                 'email' => $user->email,
//                 'status' => $user->status ?? 'active',
//                 'role' => $user->role ?? 'user',
//             ];
//         });

//         return Inertia::render('members', [
//             'members' => $members,
//         ]);
//     }

//     public function store(Request $request)
//     {
//         $validated = $request->validate([
//             'name' => 'required|string|max:255',
//             'email' => 'required|email|unique:users,email',
//             'role' => 'required|in:user,admin',
//             'status' => 'required|in:active,deactivated',
//         ]);

//         User::create([
//             'name' => $validated['name'],
//             'email' => $validated['email'],
//             'password' => Hash::make('temporary-password'),
//             'role' => $validated['role'],
//             'status' => $validated['status'],
//         ]);

//         return Redirect::route('members')->with('success', 'Member added successfully.');
//     }

//     public function update(Request $request, User $user)
//     {
//         $validated = $request->validate([
//             'status' => 'sometimes|in:active,deactivated',
//             'role' => 'sometimes|in:user,admin',
//         ]);

//         $user->update($validated);

//         return Redirect::route('members')->with('success', 'Member updated successfully.');
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
        $perPage = $request->input('per_page', 8); 
        $search = $request->query('search');

        $members = User::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->whereIn('role', ['user', 'admin'])
            ->paginate($perPage)
            ->withQueryString()
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => $user->status ?? 'enabled',
                    'role' => $user->role ?? 'user',
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
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:user,admin',
            'status' => 'required|in:enabled,disabled',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make('temporary-password'),
            'role' => $validated['role'],
            'status' => $validated['status'],
        ]);

        return Redirect::route('members')->with('success', 'Member added successfully.');
    }

    public function edit(Request $request, User $user)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->query('search');
    
        $members = User::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->whereIn('role', ['user', 'admin'])
            ->paginate($perPage)
            ->withQueryString()
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => $user->status ?? 'enabled',
                    'role' => $user->role ?? 'user',
                ];
            });
    
        return Inertia::render('members', [
            'editMember' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'user',
                'status' => $user->status ?? 'enabled',
            ],
            'members' => $members,
            'search' => $search,
        ]);
    }


    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:user,admin',
            'status' => 'required|in:enabled,disabled',
        ]);

        $user->update($validated);

        return Redirect::route('members')->with('success', 'Member updated successfully.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return Redirect::route('members')->with('success', 'Member deleted successfully.');
    }

}