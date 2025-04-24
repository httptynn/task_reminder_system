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
    const { auth } = usePage<{ auth: { user: { avatar: string | null; name: string; email: string } } }>().props;
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
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Link href="/user/profile" className="block">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Avatar className="size-12 rounded-full">
                            <AvatarImage src={auth.user.avatar ?? ''} alt={auth.user.name} />
                            <AvatarFallback className="rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                {getInitials(auth.user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{auth.user.name}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">{auth.user.email}</p>
                        </div>
                    </div>
                </Link>
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border"
                        >
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            {/* Inner Card */}
                            <div className="border-sidebar-border absolute right-0 bottom-0 left-0 h-1/2 rounded-b-xl border-t bg-white/90 p-4 shadow-inner dark:bg-neutral-900/80">
                                <div className="relative h-full">
                                    <div className="absolute top-0 right-0">
                                        <Bell className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                                    </div>
                                    <div className="flex h-full flex-col justify-end">
                                        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{card.title}</h3>
                                        <div className="mt-1 space-y-0.5 text-[10px] font-medium text-[#036BFF]">
                                            <p>Start: {card.dateAdded}</p>
                                            <p>End: {card.dateEnd}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
