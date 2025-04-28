import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Task',
        href: '/Task',
    },
    {
        title: 'Profile',
        href: '/user/profile',
    },
];

export default function UserProfile() {
    const { auth } = usePage<{
        auth: {
            user: {
                avatar: string | null;
                name: string;
                email: string;
                phone: string | null;
                role: string;
                description: string | null;
            };
        };
    }>().props;
    const getInitials = useInitials();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Profile" />
            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-6 sm:p-8">
                <div className="flex min-h-[60vh] items-center justify-center rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="flex flex-col items-center gap-8 text-center">
                        <div className="group relative">
                            <Avatar className="size-24 rounded-full shadow-md transition-all group-hover:scale-105">
                                <AvatarImage src={auth.user.avatar ?? ''} alt={auth.user.name} />
                                <AvatarFallback className="rounded-full bg-neutral-200 text-xl text-black dark:bg-neutral-700 dark:text-white">
                                    {getInitials(auth.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute right-0 -bottom-2 rounded-full border border-white bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-800 dark:text-white">
                                {auth.user.role}
                            </div>
                        </div>

                        <div className="w-full max-w-md space-y-5 text-left">
                            {[
                                { label: 'Full Name', value: auth.user.name },
                                { label: 'Email', value: auth.user.email },
                                { label: 'Role', value: auth.user.role },
                            ].map(({ label, value }, idx) => (
                                <div key={idx} className="border-b border-neutral-200 pb-4 dark:border-neutral-700">
                                    <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{label}</h2>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{value}</p>
                                </div>
                            ))}
                        </div>

                        <Link href="/user/profile/edit" aria-label="Edit user profile">
                            <Button
                                variant="default"
                                className="w-full px-6 shadow-md transition hover:brightness-105 sm:w-auto"
                                style={{ backgroundColor: '#0C0C18', color: '#FFFFFF' }}
                            >
                                Edit Profile
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="relative min-h-[50vh] flex-1 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                </div>
            </div>
        </AppLayout>
    );
}
