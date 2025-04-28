import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MembersTable } from '@/components/ui/members-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toast } from '@/components/ui/toast';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { debounce } from 'lodash';
import { Search, UserRoundPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Members',
        href: '/members',
    },
];

interface Member extends User {
    role: 'user' | 'admin';
    created_at: string;
}

interface PageProps {
    members: {
        data: Member[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    editMember?: Member;
    search?: string;
    [key: string]: any;
}

export default function Members({
    members: initialMembers,
    editMember,
    search,
}: {
    members: PageProps['members'];
    editMember?: Member;
    search?: string;
}) {
    const { flash } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState<string>(search || '');
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        role?: string;
        password?: string;
        password_confirmation?: string;
        old_password?: string;
    }>({});
    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        role: string;
        password: string;
        password_confirmation: string;
        old_password: string;
    }>({
        name: '',
        email: '',
        role: 'user',
        password: '',
        password_confirmation: '',
        old_password: '',
    });
    const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
    const [isSingleDeleteDialogOpen, setIsSingleDeleteDialogOpen] = useState<boolean>(false);
    const [deletingMemberId, setDeletingMemberId] = useState<number | null>(null);

    const handleSearchChange = debounce((value: string) => {
        setSearchTerm(value);
        router.visit('/members', {
            method: 'get',
            data: { search: value },
            preserveState: true,
            preserveScroll: true,
            only: ['members', 'flash', 'search'],
        });
    }, 100);

    useEffect(() => {
        if (flash?.error) {
            setToast({ message: flash.error, variant: 'error' });
        }
        if (flash?.success) {
            setToast({ message: flash.success, variant: 'success' });
        }
    }, [flash]);

    useEffect(() => {
        if (editMember) {
            setFormData({
                name: editMember.name,
                email: editMember.email,
                role: editMember.role,
                password: '',
                password_confirmation: '',
                old_password: '',
            });
            setEditingMemberId(editMember.id);
            setIsEditDialogOpen(true);
        }
    }, [editMember]);

    const handleAddMember = () => {
        setErrors({});
        router.post(
            '/members',
            {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            },
            {
                onSuccess: () => {
                    setFormData({ name: '', email: '', role: 'user', password: '', password_confirmation: '', old_password: '' });
                    setIsAddDialogOpen(false);
                    setToast({ message: 'Member added successfully!', variant: 'success' });
                },
                onError: (errors) => {
                    setErrors(errors);
                },
            },
        );
    };

    const handleEditMember = () => {
        if (!editingMemberId) return;
        setErrors({});

        const updateData: {
            name: string;
            email: string;
            role: string;
            old_password?: string;
            password?: string;
            password_confirmation?: string;
        } = {
            name: formData.name,
            email: formData.email,
            role: formData.role,
        };

        if (formData.old_password) {
            updateData.old_password = formData.old_password;
        }
        if (formData.password) {
            updateData.password = formData.password;
        }
        if (formData.password_confirmation) {
            updateData.password_confirmation = formData.password_confirmation;
        }

        router.patch(
            `/members/${editingMemberId}`,
            updateData,
            {
                onSuccess: () => {
                    setFormData({ name: '', email: '', role: 'user', password: '', password_confirmation: '', old_password: '' });
                    setEditingMemberId(null);
                    setToast({ message: 'Member updated successfully!', variant: 'success' });
                    setIsEditDialogOpen(false);
                },
                onError: (errors) => {
                    setErrors(errors);
                },
            },
        );
    };

    const handleDeleteSingleMember = (id: number) => {
        setDeletingMemberId(id);
        setIsSingleDeleteDialogOpen(true);
    };

    const confirmSingleDelete = () => {
        if (!deletingMemberId) return;

        const getCookie = (name: string): string | null => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) {
                return parts.pop()!.split(';').shift() || null;
            }
            return null;
        };

        const xsrfToken = getCookie('XSRF-TOKEN');

        const deleteRequest = () => {
            router.delete(`/members/${deletingMemberId}`, {
                headers: xsrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) } : {},
                onSuccess: () => {
                    setToast({ message: 'Member deleted successfully!', variant: 'success' });
                    setIsSingleDeleteDialogOpen(false);
                    setDeletingMemberId(null);
                },
                onError: (errors) => {
                    setToast({ message: 'Failed to delete member.', variant: 'error' });
                    console.error('Error deleting member:', errors);
                },
            });
        };

        if (xsrfToken) {
            deleteRequest();
        } else {
            fetch('/sanctum/csrf-cookie', { credentials: 'include' })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch CSRF token: ${response.status} ${response.statusText}`);
                    }
                    deleteRequest();
                })
                .catch((error) => {
                    console.error('Error fetching CSRF token:', error);
                    setToast({ message: `Failed to fetch CSRF token: ${error.message}`, variant: 'error' });
                });
        }
    };

    const handleEditClick = (member: Member) => {
        setFormData({
            name: member.name,
            email: member.email,
            role: member.role,
            password: '',
            password_confirmation: '',
            old_password: '',
        });
        setEditingMemberId(member.id);
        setIsEditDialogOpen(true);
    };

    const handlePageChange = (page: number) => {
        router.visit(`/members?page=${page}&search=${encodeURIComponent(searchTerm)}`, {
            preserveState: true,
            preserveScroll: true,
            only: ['members', 'flash', 'search'],
            onError: (errors) => console.error('Inertia error:', errors),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="flex h-full flex-1 flex-col gap-5 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            className="flex items-center gap-2 bg-blue-950 text-white hover:bg-blue-950/90 hover:text-white"
                            onClick={() => {
                                setFormData({
                                    name: '',
                                    email: '',
                                    role: 'user',
                                    password: '',
                                    password_confirmation: '',
                                    old_password: '',
                                });
                                setErrors({});
                                setIsAddDialogOpen(true);
                            }}
                        >
                            <UserRoundPlus className="h-4 w-4" />
                            Add Member
                        </Button>
                    </div>
                    <div className="relative flex-1 max-w-sm">
                        <Input
                            type="text"
                            placeholder="Search by name or email"
                            className="w-full pr-2 pl-8"
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                        <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
                <div className="flex-1">
                    <MembersTable
                        members={initialMembers}
                        onEditMember={handleEditClick}
                        onDeleteMember={handleDeleteSingleMember}
                        onPageChange={handlePageChange}
                    />
                </div>
                <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={(open: boolean) => {
                        setIsAddDialogOpen(open);
                        if (!open) {
                            setFormData({
                                name: '',
                                email: '',
                                role: 'user',
                                password: '',
                                password_confirmation: '',
                                old_password: '',
                            });
                            setErrors({});
                        }
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Member</DialogTitle>
                            <DialogDescription>Add a new member to the system.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                <InputError message={errors.email} />
                            </div>
                            <div>
                                <Select
                                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                                    value={formData.role}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">Member</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>
                            <div>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <InputError message={errors.password} />
                            </div>
                            <div>
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={formData.password_confirmation}
                                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                className="border-blue-600 text-blue-600 hover:text-blue-600/90"
                                onClick={() => setIsAddDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleAddMember} className="bg-blue-600 hover:bg-blue-600/90">
                                Add
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={(open) => {
                        setIsEditDialogOpen(open);
                        if (!open) {
                            setFormData({
                                name: '',
                                email: '',
                                role: 'user',
                                password: '',
                                password_confirmation: '',
                                old_password: '',
                            });
                            setEditingMemberId(null);
                        }
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Member</DialogTitle>
                            <DialogDescription>Update the details for this member.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                <InputError message={errors.email} />
                            </div>
                            <div>
                                <Select
                                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                                    value={formData.role}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">Member</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>
                            <div>
                                <Input
                                    type="password"
                                    placeholder="Old Password"
                                    value={formData.old_password}
                                    onChange={(e) => setFormData({ ...formData, old_password: e.target.value })}
                                />
                                <InputError message={errors.old_password} />
                            </div>
                            <div>
                                <Input
                                    type="password"
                                    placeholder="New Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <InputError message={errors.password} />
                            </div>
                            <div>
                                <Input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={formData.password_confirmation}
                                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                className="border-green-700 text-green-700 hover:text-green-700/90"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleEditMember} className="bg-green-700 hover:bg-green-700/90">
                                Save
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog
                    open={isSingleDeleteDialogOpen}
                    onOpenChange={(open) => {
                        setIsSingleDeleteDialogOpen(open);
                        if (!open) setDeletingMemberId(null);
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogDescription>Are you sure you want to delete this member? This action cannot be undone.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                className="hover:bg-accent border-red-600 text-red-600 hover:text-red-600/90"
                                onClick={() => {
                                    setIsSingleDeleteDialogOpen(false);
                                    setDeletingMemberId(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={confirmSingleDelete} variant="destructive">
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                {toast && <Toast message={toast.message} variant={toast.variant} duration={3000} onClose={() => setToast(null)} />}
            </div>
        </AppLayout>
    );
}