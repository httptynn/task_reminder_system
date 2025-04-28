import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Task',
        href: '/Task',
    },
];

export default function Task() {
    const { auth } = usePage<{
        auth: { user: { avatar: string | null; name: string; email: string } };
    }>().props;

    const getInitials = useInitials();

    const cards = [
        {
            title: 'Project Alpha',
            dateAdded: '2025-04-01',
            dateEnd: '2025-06-30',
        },
        {
            title: 'Website Redesign',
            dateAdded: '2025-03-15',
            dateEnd: '2025-05-15',
        },
        {
            title: 'Mobile App Dev',
            dateAdded: '2025-04-10',
            dateEnd: '2025-07-20',
        },
        {
            title: 'Marketing Campaign',
            dateAdded: '2025-04-20',
            dateEnd: '2025-08-01',
        },
    ];

    // State for modal
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<{ title: string; index: number } | null>(null);

    // Handle card click to open modal
    const handleCardClick = (task: { title: string }, index: number) => {
        setSelectedTask({ title: task.title, index });
        setIsOpen(true);
    };

    // Handle modal accept
    const handleAccept = () => {
        if (selectedTask) {
            router.visit(`/task/${selectedTask.index}`);
        }
        setIsOpen(false);
        setSelectedTask(null);
    };

    // Handle modal cancel
    const handleCancel = () => {
        setIsOpen(false);
        setSelectedTask(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Task" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Profile Section */}
                <Link href="/user/profile" className="block">
                    <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                        <Avatar className="size-14 rounded-full">
                            <AvatarImage src={auth.user.avatar ?? ''} alt={auth.user.name} />
                            <AvatarFallback className="rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                {getInitials(auth.user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-lg font-semibold text-neutral-900 dark:text-white">{auth.user.name}</p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">{auth.user.email}</p>
                        </div>
                    </div>
                </Link>

                {/* Section Title */}
                <div>
                    <h2 className="mb-2 text-xl font-bold text-neutral-800 dark:text-white">Your Projects</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage and keep track of your ongoing tasks</p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            onClick={() => handleCardClick(card, index)}
                            className="relative block cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                        >
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                            {/* Main Card Content */}
                            <div className="bg-/90 relative z-10 flex h-40 flex-col justify-end rounded-b-2xl border-t border-neutral-100 p-4 shadow-inner dark:border-neutral-700 dark:bg-neutral-900/80"></div>

                            {/* Nested Card with #036BFF background */}
                            <div className="absolute right-0 bottom-0 left-0 rounded-t-2xl bg-[#036BFF] p-4 text-white">
                                <h4 className="text-sm font-semibold">{card.title}</h4>
                                <div className="mt-1 text-xs font-medium">
                                    <p>Start: {card.dateAdded}</p>
                                    <p>End: {card.dateEnd}</p>
                                </div>
                                <div className="absolute top-2 right-2">
                                    <Bell className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-neutral-900/50">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg dark:bg-neutral-800">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Accept Task</h3>
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">Do you want to accept the task "{selectedTask?.title}"?</p>
                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                onClick={handleCancel}
                                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAccept}
                                className="rounded-lg bg-[#036BFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#0254cc]"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
