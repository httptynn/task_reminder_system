import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { UserInfo } from '@/components/user-info';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Bell, Check } from 'lucide-react'; // Replace Trash2 with Check
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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

// Mock notification data using users from Members
const mockNotifications = [
  { id: 1, name: 'Stephanie Lucero', email: 'stephanielucero177@gmail.com', message: 'assigned you to a new team Squad Alpha', read: false, time: '2025-04-10T10:00:00Z' },
  { id: 2, name: 'Admin One', email: 'admin1@example.com', message: 'changed an issue from Testing to Done', read: true, time: '2025-04-10T09:00:00Z' },
  { id: 3, name: 'Admin Two', email: 'admin2@example.com', message: 'mentioned you on a task The Menu Dashboard', read: false, time: '2025-04-10T07:00:00Z' },
  { id: 4, name: 'John Doe', email: 'john.doe@example.com', message: 'You haven’t moved any tasks this week', read: true, time: '2025-04-10T06:00:00Z' },
  { id: 5, name: 'Jane Smith', email: 'jane.smith@example.com', message: 'created a new project Scholarship Region Redesign', read: false, time: '2025-04-10T05:00:00Z' },
  { id: 6, name: 'Mike Johnson', email: 'mike.johnson@example.com', message: 'You have completed your tasks for the week', read: true, time: '2025-04-10T04:00:00Z' },
  { id: 7, name: 'Emily Brown', email: 'emily.brown@example.com', message: 'commented on a task Revamp Sidebar in Review', read: false, time: '2025-04-08T10:00:00Z' },
  { id: 8, name: 'David Lee', email: 'david.lee@example.com', message: 'invited you to a new project IPNX API Refactoring', read: true, time: '2025-03-20T10:00:00Z' },
];

export default function Notifications({ notifications: initialNotifications = mockNotifications }: { notifications?: any[] }) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [notifications, setNotifications] = useState(
    initialNotifications.map((notification) => ({
      ...notification,
      relativeTime: notification.time ? getRelativeTime(notification.time) : 'Unknown time',
    }))
  );
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications
    .filter((notification) =>
      filter === 'unread' ? notification.read === false : true
    )
    .filter((notification) =>
      `${notification.name || ''} ${notification.email || ''} ${notification.message || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const handleMarkAllRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  // Check if there are any unread notifications
  const hasUnreadNotifications = notifications.some((notification) => !notification.read);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notifications" />
      <div className="flex h-full flex-1 flex-col gap-5 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            Updates
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm mr-2">{filteredNotifications.length} notifications</span>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search notifications"
                className="pl-8 pr-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread ({notifications.filter(n => n.read === false).length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={handleMarkAllRead}
            disabled={!hasUnreadNotifications} // Disable if no unread notifications
          >
            <Check className="h-4 w-4 mr-1" /> Mark as All Read
          </Button>
        </div>

        {/* Notification List */}
        <div className="flex-1">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <Dialog key={notification.id}>
                  <DialogTrigger asChild>
                    <div
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {notification.read === false && (
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                        <div className="flex items-center gap-3 flex-1">
                          <UserInfo user={notification} showEmail={true} />
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-black dark:text-white'}`}>
                              {notification.message || 'No message available'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {notification.relativeTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{notification.name || 'Unknown User'}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p><strong>User:</strong> {notification.name || 'Unknown User'}</p>
                      <p><strong>Email:</strong> {notification.email || 'No email'}</p>
                      <p><strong>Message:</strong> {notification.message || 'No message available'}</p>
                      <p><strong>Time:</strong> {notification.relativeTime}</p>
                      <p><strong>Status:</strong> {notification.read ? 'Read' : 'Unread'}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              ))
            ) : (
              <div className="text-muted-foreground p-4 text-center">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}