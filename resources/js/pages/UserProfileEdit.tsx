import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Task',
        href: '/Task',
    },
    {
        title: 'Profile',
        href: '/user/profile',
    },
    {
        title: 'Edit Profile',
        href: '/user/profile/edit',
    },
];

export default function UserProfileEdit() {
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

    const { data, setData, post, processing, errors } = useForm({
        avatar: null as File | null,
        name: auth.user.name,
        email: auth.user.email,
        role: auth.user.role,
    });

    const [preview, setPreview] = useState<string | null>(auth.user.avatar || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('avatar', file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(auth.user.avatar || null);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/user/profile', {
            preserveScroll: true,
            onSuccess: () => {
                window.location.href = '/user/profile';
            },
        });
    };

    const getInitials = useInitials();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Profile" />
            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-8">
                <div className="border-sidebar-border/70 dark:border-sidebar-border flex min-h-[60vh] items-center justify-center rounded-xl border bg-white p-8 shadow-xl dark:bg-neutral-900">
                    <div className="flex max-w-2xl flex-col items-center gap-8 text-center">
                        <div
                            className="group relative cursor-pointer rounded-full ring-offset-2 transition-all hover:ring-4 hover:ring-[#036BFF]"
                            onClick={handleAvatarClick}
                            role="button"
                            aria-label="Change profile picture"
                        >
                            <Avatar className="size-20 rounded-full">
                                <AvatarImage src={preview || auth.user.avatar || ''} alt={auth.user.name} />
                                <AvatarFallback className="rounded-full bg-neutral-200 text-xl text-black dark:bg-neutral-700 dark:text-white">
                                    {getInitials(auth.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#036BFF] text-white shadow-md transition-all duration-200 ease-in-out group-hover:scale-110">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <input id="avatar" type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        {errors.avatar && <p className="text-xs text-red-500">{errors.avatar}</p>}
                        <form onSubmit={submit} className="w-full space-y-6">
                            <div className="flex items-start gap-4">
                                <Label htmlFor="name" className="w-28 pt-2 text-right">
                                    Full Name
                                </Label>
                                <div className="flex-1">
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full rounded-md border-2 border-neutral-300 bg-white p-3 text-base shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Label htmlFor="email" className="w-28 pt-2 text-right">
                                    Email
                                </Label>
                                <div className="flex-1">
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full rounded-md border-2 border-neutral-300 bg-white p-3 text-base shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                                        required
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Label htmlFor="role" className="w-28 pt-2 text-right">
                                    Role
                                </Label>
                                <div className="flex-1">
                                    <Select value={data.role} onValueChange={(value) => setData('role', value as 'user' | 'admin' | 'manager')}>
                                        <SelectTrigger className="w-full rounded-md border-2 border-neutral-300 bg-white p-3 text-base dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="manager">Manager</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
                                </div>
                            </div>
                            <div className="flex justify-center gap-4">
                                <Link href="/user/profile" aria-label="Cancel editing profile">
                                    <Button variant="outline" className="w-full px-6 sm:w-auto" disabled={processing}>
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    variant="default"
                                    className="w-full px-6 transition hover:brightness-125 sm:w-auto"
                                    style={{ backgroundColor: '#0C0C18', color: '#FFFFFF' }}
                                    disabled={processing}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[60vh] flex-1 overflow-hidden rounded-xl border bg-gradient-to-br from-white to-neutral-100 dark:from-neutral-800 dark:to-neutral-900">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
