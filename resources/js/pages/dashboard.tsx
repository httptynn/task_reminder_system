import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Task',
        href: '/dashboard',
    },
];

export default function Dashboard() {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
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
                        <Link
                            key={index}
                            href={`/task/${index}`}
                            data={{ card }}
                            className="relative block overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                        >
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                            {/* Main Card Content */}
                            <div className="relative z-10 flex h-40 flex-col justify-end rounded-b-2xl border-t border-neutral-100 bg-/90 p-4 shadow-inner dark:border-neutral-700 dark:bg-neutral-900/80">
                                
                            </div>

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
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
