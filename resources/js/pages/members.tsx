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
    status: 'enabled' | 'disabled';
    role: 'user' | 'admin';
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
    const [errors, setErrors] = useState<{ name?: string; email?: string; role?: string; status?: string }>({});
    const [formData, setFormData] = useState<{ name: string; email: string; role: string; status: string }>({
        name: '',
        email: '',
        role: 'user',
        status: 'enabled',
    });
    const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState<boolean>(false);
    const [statusChange, setStatusChange] = useState<{ id: number; newStatus: 'enabled' | 'disabled'; reason?: string } | null>(null);
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
                status: editMember.status,
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
                status: 'enabled',
            },
            {
                onSuccess: () => {
                    setFormData({ name: '', email: '', role: 'user', status: 'enabled' });
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
        router.patch(
            `/members/${editingMemberId}`,
            {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                status: formData.status,
            },
            {
                onSuccess: () => {
                    setFormData({ name: '', email: '', role: 'user', status: 'enabled' });
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

    const handleUpdateStatus = (id: number, newStatus: 'enabled' | 'disabled') => {
        setStatusChange({ id, newStatus });
        setIsStatusDialogOpen(true);
    };

    const confirmStatusChange = () => {
        if (!statusChange) return;
        router.patch(
            `/members/${statusChange.id}`,
            { status: statusChange.newStatus },
            {
                onSuccess: () => {
                    setToast({
                        message: `Member ${statusChange.newStatus === 'enabled' ? 'enabled' : 'disabled'} successfully!`,
                        variant: 'success',
                    });
                },
                onError: (errors) => {
                    console.error('Error updating member status:', errors);
                    setToast({ message: 'Failed to update member status.', variant: 'error' });
                },
            },
        );
        setIsStatusDialogOpen(false);
        setStatusChange(null);
    };

    const handleEditClick = (member: Member) => {
        setFormData({
            name: member.name,
            email: member.email,
            role: member.role,
            status: member.status,
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
                    <h1 className="text-xl font-semibold">Member Management</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground mr-2 text-sm">{initialMembers.total} members</span>
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search by name or email"
                                className="pr-2 pl-8"
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                            <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                        <Button
                            className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                            onClick={() => {
                                setFormData({ name: '', email: '', role: 'user', status: 'enabled' });
                                setErrors({});
                                setIsAddDialogOpen(true);
                            }}
                        >
                            <UserRoundPlus className="h-4 w-4" />
                            Add Member
                        </Button>
                    </div>
                </div>
                <div className="flex-1">
                    <MembersTable
                        members={initialMembers}
                        onUpdateStatus={handleUpdateStatus}
                        onEditMember={handleEditClick}
                        onDeleteMember={handleDeleteSingleMember}
                        onPageChange={handlePageChange}
                    />
                </div>
                <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={(open) => {
                        setIsAddDialogOpen(open);
                        if (!open) {
                            setFormData({ name: '', email: '', role: 'user', status: 'enabled' });
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
                                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
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
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddMember} className="bg-blue-500 hover:bg-blue-600">
                                Add
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
                <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={(open) => {
                        setIsEditDialogOpen(open);
                        if (!open) {
                            setFormData({ name: '', email: '', role: 'user', status: 'enabled' });
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
                                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
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
                                <InputError message={errors.status} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEditMember}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Status Change</DialogTitle>
                            <DialogDescription>
                                {statusChange?.newStatus === 'enabled'
                                    ? 'Enabling this member will allow them to log in and use the system.'
                                    : 'Disabling this member will prevent them from logging in or accessing the system.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Select onValueChange={(value) => setStatusChange({ ...statusChange!, reason: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a reason (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="leave">Member is on leave</SelectItem>
                                    <SelectItem value="security">Security concern</SelectItem>
                                    <SelectItem value="offboarding">Offboarding</SelectItem>
                                    <SelectItem value="transition">Role/project transition</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={confirmStatusChange}>{statusChange?.newStatus === 'enabled' ? 'Enable' : 'Disable'}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                {toast && <Toast message={toast.message} variant={toast.variant} duration={3000} onClose={() => setToast(null)} />}
            </div>
        </AppLayout>
    );
}
