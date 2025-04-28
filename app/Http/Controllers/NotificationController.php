<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;


class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->query('filter', 'all'); // 'all' or 'unread'
        $sort = $request->query('sort', 'newest'); // 'newest' or 'oldest'
        $perPage = $request->input('per_page', 9); // Pagination support
        $user = Auth::user();
        $isAdmin = $user->role === 'admin';

        // Base query for notifications
        $notificationsQuery = Notification::query()
            ->where('recipient_id', $user->id)
            ->with('user');

        if ($isAdmin) {
            $notificationsQuery->orWhere(function ($query) {
                $query->whereNull('recipient_id')
                      ->where('message', 'like', '%system:%');
            });
        }

        // Calculate total notifications (all, regardless of read status)
        $totalNotifications = $notificationsQuery->count();

        // Apply filter for unread notifications
        if ($filter === 'unread') {
            $notificationsQuery->where('is_read', false);
        }

        // Calculate unread notifications
        $unreadNotificationsQuery = Notification::query()
            ->where('recipient_id', $user->id)
            ->where('is_read', false);
        if ($isAdmin) {
            $unreadNotificationsQuery->orWhere(function ($query) {
                $query->whereNull('recipient_id')
                      ->where('message', 'like', '%system:%')
                      ->where('is_read', false);
            });
        }
        $unreadNotifications = $unreadNotificationsQuery->count();

        // Apply sorting
        $orderDirection = $sort === 'newest' ? 'desc' : 'asc';
        $notificationsQuery->orderBy('created_at', $orderDirection);

        // Paginate the filtered notifications
        $notifications = $notificationsQuery
            ->paginate($perPage)
            ->withQueryString()
            ->through(function ($notification) {
                return [
                    'id' => $notification->id,
                    'user' => $notification->user ? [
                        'id' => $notification->user->id,
                        'name' => $notification->user->name,
                        'email' => $notification->user->email,
                        'avatar' => $notification->user->avatar ?? null,
                        'email_verified_at' => $notification->user->email_verified_at ? $notification->user->email_verified_at->toIso8601String() : null,
                        'created_at' => $notification->user->created_at->toIso8601String(),
                        'updated_at' => $notification->user->updated_at->toIso8601String(),
                    ] : [
                        'id' => 0,
                        'name' => 'System',
                        'email' => 'system@example.com',
                        'avatar' => null,
                        'email_verified_at' => null,
                        'created_at' => now()->toIso8601String(),
                        'updated_at' => now()->toIso8601String(),
                    ],
                    'message' => $notification->message,
                    'read' => $notification->is_read, // Map is_read to read for frontend
                    'time' => $notification->created_at->toIso8601String(),
                ];
            });

        return Inertia::render('notifications', [
            'notifications' => $notifications,
            'isAdmin' => $isAdmin,
            'filter' => $filter,
            'sort' => $sort,
            'total_notifications' => $totalNotifications,
            'unread_notifications' => $unreadNotifications,
        ]);
    }

    public function markAllRead(Request $request)
    {
        $user = Auth::user();

        Notification::where('recipient_id', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        if ($user->role === 'admin') {
            Notification::whereNull('recipient_id')
                ->where('message', 'like', '%system:%')
                ->where('is_read', false)
                ->update(['is_read' => true]);
        }

        return redirect()->route('notifications', [
            'filter' => $request->query('filter'),
            'sort' => $request->query('sort'),
        ])->with('success', 'All notifications marked as read.');
    }

    public function markAsRead(Request $request, Notification $notification)
    {
        $user = Auth::user();

        if ($notification->recipient_id !== $user->id && !($user->role === 'admin' && is_null($notification->recipient_id))) {
            return redirect()->route('notifications', [
                'filter' => $request->query('filter'),
                'sort' => $request->query('sort'),
            ])->with('error', 'Unauthorized to mark this notification as read.');
        }

        $notification->update(['is_read' => true]);

        return redirect()->route('notifications', [
            'filter' => $request->query('filter'),
            'sort' => $request->query('sort'),
        ])->with('success', 'Notification marked as read.');
    }
}

