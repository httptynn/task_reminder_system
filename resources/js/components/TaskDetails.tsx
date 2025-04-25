import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';

type TaskDetailProps = {
  card: {
    title: string;
    dateAdded: string;
    dateEnd: string;
  };
  auth: {
    user: {
      avatar: string | null;
      name: string;
      email: string;
    };
  };
};

export default function TaskDetail() {
  const { card, auth } = usePage().props as unknown as TaskDetailProps;
  const getInitials = useInitials();

  return (
    <AppLayout>
      <div className="space-y-4 p-6">
        {/* Card Info */}
        <div className="rounded-xl border bg-white p-6 shadow-md dark:bg-neutral-900">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{card.title}</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Start: {card.dateAdded}</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">End: {card.dateEnd}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left: Info Card */}
          <div className="space-y-4 md:col-span-2">
            <div className="rounded-xl border bg-white p-6 shadow-md dark:bg-neutral-900">
              <p className="mb-3 text-sm font-semibold text-neutral-500">From</p>
              <div className="mb-4 flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage src={auth.user.avatar ?? ''} />
                  <AvatarFallback>{getInitials(auth.user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{auth.user.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Sent: {card.dateAdded}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Title</p>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200">{card.title}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Subject</p>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200">e.g., Project Phase 1</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Due Date</p>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200">{card.dateEnd}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Assignee</p>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200">
                    email1@example.com, email2@example.com
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Attach File</p>
                  <Input type="file" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Description</p>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200">
                    Initial task description goes here...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Response Section */}
          <div className="space-y-4">
            <div className="rounded-xl border bg-white p-6 shadow-md dark:bg-neutral-900">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Your Description</label>
              <Textarea
                className="mt-2"
                placeholder="Write your update..."
                rows={6}
              />
              <div className="mt-4">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Attach File</label>
                <Input type="file" className="mt-2" />
              </div>
              <Button className="mt-6 w-full bg-[#036BFF] text-white hover:bg-[#0356cc]">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
