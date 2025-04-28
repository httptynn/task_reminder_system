import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toast } from '@/components/ui/toast';
import { UserInfo } from '@/components/user-info';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Bell, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

// Utility to calculate relative time (e.g., "1hr ago")
const getRelativeTime = (date: string | Date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();
  const diffInMinutes = Math.floor(diffInMs / 1000 / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}hr${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}d ago`;
  }
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Notifications',
    href: '/notifications',
  },
];

interface Notification {
  id: number;
  user: User;
  message: string;
  read: boolean;
  time: string;
  relativeTime?: string;
}

interface PaginatedNotifications {
  data: Notification[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface PageProps {
  notifications: PaginatedNotifications;
  isAdmin?: boolean;
  flash?: {
    success?: string;
    error?: string;
  };
  filter?: 'all' | 'unread';
  sort?: 'newest' | 'oldest';
  total_notifications: number;
  unread_notifications: number;
  [key: string]: any; // For Inertia compatibility
}

export default function Notifications({
  notifications: initialNotifications,
  total_notifications,
  unread_notifications,
}: PageProps) {
  const { flash, filter: initialFilter, sort: initialSort } = usePage<PageProps>().props;
  const [filter, setFilter] = useState<'all' | 'unread'>(initialFilter || 'all');
  const [sort, setSort] = useState<'newest' | 'oldest'>(initialSort || 'newest');
  const [notifications, setNotifications] = useState(
    initialNotifications.data.map((notification) => ({
      ...notification,
      relativeTime: notification.time ? getRelativeTime(notification.time) : 'Unknown time',
    })),
  );
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  // Update local state when initialNotifications changes (e.g., after pagination)
  useEffect(() => {
    setNotifications(
      initialNotifications.data.map((notification) => ({
        ...notification,
        relativeTime: notification.time ? getRelativeTime(notification.time) : 'Unknown time',
      })),
    );
  }, [initialNotifications]);

  useEffect(() => {
    if (flash?.success) {
      setToast({ message: flash.success, variant: 'success' });
    }
    if (flash?.error) {
      setToast({ message: flash.error, variant: 'error' });
    }
  }, [flash]);

  const handleFilterChange = (newFilter: 'all' | 'unread') => {
    setFilter(newFilter);
    router.visit('/notifications', {
      method: 'get',
      data: { filter: newFilter, sort, page: 1 }, // Reset to page 1 on filter change
      preserveState: true,
      preserveScroll: true,
      only: ['notifications', 'flash', 'filter', 'sort', 'total_notifications', 'unread_notifications'],
    });
  };

  const handleSortChange = (newSort: 'newest' | 'oldest') => {
    setSort(newSort);
    router.visit('/notifications', {
      method: 'get',
      data: { filter, sort: newSort, page: 1 }, // Reset to page 1 on sort change
      preserveState: true,
      preserveScroll: true,
      only: ['notifications', 'flash', 'filter', 'sort', 'total_notifications', 'unread_notifications'],
    });
  };

  const handlePageChange = (page: number) => {
    router.visit('/notifications', {
      method: 'get',
      data: { filter, sort, page },
      preserveState: true,
      preserveScroll: true,
      only: ['notifications', 'flash', 'filter', 'sort', 'total_notifications', 'unread_notifications'],
    });
  };

  const handleMarkAllRead = () => {
    router.post(
      '/notifications/mark-all-read',
      {},
      {
        onSuccess: () => {
          setNotifications(
            notifications.map((notification) => ({
              ...notification,
              read: true,
            })),
          );
          setToast({ message: 'All notifications marked as read.', variant: 'success' });
        },
        onError: (errors) => {
          setToast({ message: 'Failed to mark notifications as read.', variant: 'error' });
        },
      },
    );
  };

  const handleMarkAsRead = (notificationId: number) => {
    router.post(
      `/notifications/${notificationId}/mark-read`,
      {},
      {
        onSuccess: () => {
          setNotifications(
            notifications.map((notification) =>
              notification.id === notificationId ? { ...notification, read: true } : notification,
            ),
          );
          setToast({ message: 'Notification marked as read.', variant: 'success' });
        },
        onError: (errors) => {
          setToast({ message: 'Failed to mark notification as read.', variant: 'error' });
        },
      },
    );
  };

  const hasUnreadNotifications = notifications.some((notification) => !notification.read);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notifications" />
      <div className="flex h-full flex-1 flex-col gap-5 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Updates</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">{total_notifications} notifications</span>
            <Select value={sort} onValueChange={(value) => handleSortChange(value as 'newest' | 'oldest')}>
              <SelectTrigger className="w-[120px] border-blue-950/90 focus:ring-2 focus:ring-blue-950 focus:ring-offset-1">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('all')}
            className={filter === 'all' ? 'bg-blue-950 text-white hover:bg-blue-950/90' : ''}
          >
            All ({total_notifications})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('unread')}
            className={filter === 'unread' ? 'bg-blue-950 text-white hover:bg-blue-950/90' : ''}
          >
            Unread ({unread_notifications})
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={handleMarkAllRead}
            disabled={!hasUnreadNotifications}
          >
            <Check className="mr-1 h-4 w-4" /> Mark as All Read
          </Button>
        </div>

        {/* Notification List */}
        <div className="flex-1">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <Dialog key={notification.id}>
                  <DialogTrigger asChild>
                    <div
                      className={`flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                      onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                    >
                      <div className="flex flex-1 items-center gap-3">
                        {notification.read === false && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                        <div className="flex flex-1 items-center gap-3">
                          <UserInfo user={notification.user} showEmail={true} />
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${
                                notification.read ? 'text-gray-600' : 'text-black dark:text-white'
                              }`}
                            >
                              {notification.message || 'No message available'}
                            </p>
                            <p className="text-muted-foreground text-xs">{notification.relativeTime}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{notification.user.name || 'Unknown User'}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p>
                        <strong>User:</strong> {notification.user.name || 'Unknown User'}
                      </p>
                      <p>
                        <strong>Email:</strong> {notification.user.email || 'No email'}
                      </p>
                      <p>
                        <strong>Message:</strong> {notification.message || 'No message available'}
                      </p>
                      <p>
                        <strong>Time:</strong> {notification.relativeTime}
                      </p>
                      <p>
                        <strong>Status:</strong> {notification.read ? 'Read' : 'Unread'}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              ))
            ) : (
              <div className="text-muted-foreground p-4 text-center bg-white">
                <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No notifications found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        {initialNotifications.last_page > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              Showing {initialNotifications.data.length} of {initialNotifications.total} notifications
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(initialNotifications.current_page - 1)}
                disabled={initialNotifications.current_page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-muted-foreground text-sm">
                Page {initialNotifications.current_page} of {initialNotifications.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(initialNotifications.current_page + 1)}
                disabled={initialNotifications.current_page === initialNotifications.last_page}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      {toast && (
        <Toast message={toast.message} variant={toast.variant} duration={3000} onClose={() => setToast(null)} />
      )}
    </AppLayout>
  );
}