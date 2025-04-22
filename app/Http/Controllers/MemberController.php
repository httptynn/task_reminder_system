<?php

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
                $latestReason = $user->status === 'disabled'
                    ? \App\Models\StatusLog::where('user_id', $user->id)
                        ->where('status', 'disabled')
                        ->orderBy('changed_at', 'desc')
                        ->value('reason')
                    : null;

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => $user->status ?? 'enabled',
                    'role' => $user->role ?? 'user',
                    'disable_reason' => $latestReason,
                ];
            });

        // Define static reasons
        $staticReasons = [
            'leave' => 'Member is on leave',
            'security' => 'Security concern',
            'offboarding' => 'Offboarding',
            'transition' => 'Role/project transition',
            'other' => 'Other',
        ];

        // Fetch custom reasons from status_logs
        $customReasons = \App\Models\StatusLog::whereNotNull('reason')
            ->distinct()
            ->pluck('reason')
            ->toArray();

        // Combine static and custom reasons, ensuring no duplicates
        $statusReasons = array_unique(array_merge(array_values($staticReasons), $customReasons));

        return Inertia::render('members', [
            'members' => $members,
            'search' => $search,
            'statusReasons' => $statusReasons,
        ]);
    }

    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'role' => 'required|in:user,admin',
            'status' => 'required|in:enabled,disabled',
        ]);

        // Create the new user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'status' => $validated['status'],
            'password' => Hash::make('default_password'), // Set a default password or generate a random one
        ]);

        // If status is disabled, log the reason (if provided)
        if ($validated['status'] === 'disabled' && $request->has('reason')) {
            $reason = $request->input('reason');
            $reasonMap = [
                'leave' => 'Member is on leave',
                'security' => 'Security concern',
                'offboarding' => 'Offboarding',
                'transition' => 'Role/project transition',
                'other' => 'Other',
            ];
            $reason = $reasonMap[$reason] ?? $reason;

            \App\Models\StatusLog::create([
                'user_id' => $user->id,
                'status' => $validated['status'],
                'reason' => $reason,
                'changed_at' => now(),
            ]);
        }

        return redirect()->route('members')->with('success', 'Member added successfully!');
    }

    public function update(Request $request, User $user)
    {
        // Validate based on request context
        $rules = [];

        if ($request->has('name') || $request->has('email') || $request->has('role')) {
            // Full update (edit member)
            $rules = [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email,' . $user->id,
                'role' => 'required|in:user,admin',
            ];
        }

        if ($request->has('status')) {
            // Status update
            $rules['status'] = 'required|in:enabled,disabled';
            $rules['reason'] = 'nullable|string|max:255'; // Optional reason
        }

        $validated = $request->validate($rules);

        // Map static reason values to full text for status_logs
        $reason = isset($validated['reason']) ? $validated['reason'] : null;
        if ($reason) {
            $reasonMap = [
                'leave' => 'Member is on leave',
                'security' => 'Security concern',
                'offboarding' => 'Offboarding',
                'transition' => 'Role/project transition',
                'other' => 'Other',
            ];
            $reason = $reasonMap[$reason] ?? $reason; // Use mapped text or keep full text from statusReasons
        }

        // Update only provided fields
        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }
        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }
        if (isset($validated['status'])) {
            $user->status = $validated['status']; // Use status ENUM column
        }
        if (isset($validated['role'])) {
            $user->role = $validated['role']; // Direct role update
        }
        if ($reason) {
            // Store reason in status_logs table
            \App\Models\StatusLog::create([
                'user_id' => $user->id,
                'status' => $validated['status'],
                'reason' => $reason,
                'changed_at' => now(),
            ]);
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