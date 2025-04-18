import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserRoundPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MembersTable } from '@/components/ui/members-table';
import InputError from '@/components/input-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toast } from '@/components/ui/toast';
import { Toggle } from '@/components/ui/toggle';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Members',
    href: '/members',
  },
];

interface Member {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'deactivated';
  role: 'user' | 'admin';
}

interface PageProps {
  members: Member[];
  flash?: {
    success?: string;
    error?: string;
  };
  editMember?: Member;
  [key: string]: any;
}

export default function Members({ members: initialMembers, editMember }: { members: Member[], editMember?: Member }) {
  const { flash } = usePage<PageProps>().props;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [errors, setErrors] = useState<{ name?: string; email?: string; role?: string; status?: string }>({});
  const [formData, setFormData] = useState<{ name: string; email: string; role: string; status: string }>({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
  });
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isSingleDeleteDialogOpen, setIsSingleDeleteDialogOpen] = useState<boolean>(false);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);

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

  const filteredMembers = members.filter((member) =>
    `${member.name} ${member.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = () => {
    setErrors({});
    router.post(
      '/members',
      {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: 'active',
      },
      {
        onSuccess: () => {
          const newMember: Member = {
            id: Date.now(), // Temporary ID; replace with server-provided ID if available
            name: formData.name,
            email: formData.email,
            role: formData.role as 'user' | 'admin',
            status: 'active',
          };
          setMembers((prev) => [...prev, newMember]);
          setFormData({ name: '', email: '', role: 'user', status: 'active' });
          setToast({ message: 'Member added successfully!', variant: 'success' });
          setIsAddDialogOpen(false);
        },
        onError: (errors) => {
          setErrors(errors);
        },
      }
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
          setMembers((prev) =>
            prev.map((member) =>
              member.id === editingMemberId
                ? { ...member, name: formData.name, email: formData.email, role: formData.role as 'user' | 'admin', status: formData.status as 'active' | 'deactivated' }
                : member
            )
          );
          setFormData({ name: '', email: '', role: 'user', status: 'active' });
          setEditingMemberId(null);
          setToast({ message: 'Member updated successfully!', variant: 'success' });
          setIsEditDialogOpen(false);
        },
        onError: (errors) => {
          setErrors(errors);
        },
      }
    );
  };

  const handleDeleteAll = () => {
    if (selectedMembers.length === 0) {
      setIsDeleteDialogOpen(false);
      return;
    }

    router.post(
      '/members/batch-delete',
      { ids: selectedMembers },
      {
        onSuccess: () => {
          setMembers((prev) => prev.filter((member) => !selectedMembers.includes(member.id)));
          setSelectedMembers([]);
          setToast({ message: 'Members deleted successfully!', variant: 'success' });
          setIsDeleteDialogOpen(false);
        },
        onError: (errors) => {
          setToast({ message: 'Failed to delete members.', variant: 'error' });
          console.error('Error deleting members:', errors);
        },
      }
    );
  };

  const handleRemoveMember = (id: number) => {
    setMembers((prev) => prev.filter((member) => member.id !== id)); // Optimistic update
    router.delete(`/members/${id}`, {
      onSuccess: () => {
        setSelectedMembers((prev) => prev.filter((memberId) => memberId !== id));
        setToast({ message: 'Member deleted successfully!', variant: 'success' });
      },
      onError: (errors) => {
        setMembers((prev) => [...prev, members.find((m) => m.id === id)!]); // Revert on error
        setToast({ message: 'Failed to delete member.', variant: 'error' });
        console.error('Error removing member:', errors);
      },
    });
    setIsSingleDeleteDialogOpen(false);
    setMemberToDelete(null);
  };

  const handleUpdateStatus = (id: number, newStatus: 'active' | 'deactivated') => {
    router.patch(
      `/members/${id}`,
      { status: newStatus },
      {
        onSuccess: () => {
          router.reload({ only: ['members', 'flash'] });
        },
        onError: (errors) => {
          console.error('Error updating member status:', errors);
        },
      }
    );
  };

  const handleSelectMember = (id: number) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (members.length === 0) return;
    setSelectedMembers(members.map((member) => member.id));
    setTimeout(() => {
      setIsDeleteDialogOpen(true);
    }, 100); // Brief delay to ensure checkboxes render
  };

  const handleSingleDeleteClick = (id: number) => {
    setSelectedMembers((prev) => prev.includes(id) ? prev : [...prev, id]); // Check the checkbox
    setMemberToDelete(id);
    setTimeout(() => {
      setIsSingleDeleteDialogOpen(true); // Open dialog after checkbox renders
    }, 100);
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Members" />
      <div className="flex h-full flex-1 flex-col gap-5 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Member Management</h1>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm mr-2">{filteredMembers.length} members</span>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                className="pl-8 pr-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1 ml-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <UserRoundPlus className="h-4 w-4" />
                  Add member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Member</DialogTitle>
                  <DialogDescription>Enter the details for the new member.</DialogDescription>
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
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
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
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMember}>Add</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex-1">
          <MembersTable
            members={filteredMembers}
            onRemoveMember={handleSingleDeleteClick}
            onUpdateStatus={handleUpdateStatus}
            onSelectMember={handleSelectMember}
            onSelectAll={handleSelectAll}
            selectedMembers={selectedMembers}
            onEditMember={handleEditClick}
          />
        </div>
        <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setSelectedMembers([]); // Clear selection on cancel
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>Do you really want to delete all selected accounts?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleDeleteAll}>Delete All</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isSingleDeleteDialogOpen} onOpenChange={(open) => {
          setIsSingleDeleteDialogOpen(open);
          if (!open) setMemberToDelete(null);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this account?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSingleDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => memberToDelete && handleRemoveMember(memberToDelete)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setFormData({ name: '', email: '', role: 'user', status: 'active' });
            setEditingMemberId(null);
          }
        }}>
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
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
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
                <Toggle
                  variant="outline"
                  size="sm"
                  pressed={formData.status === 'active'}
                  onPressedChange={(pressed) =>
                    setFormData({ ...formData, status: pressed ? 'active' : 'deactivated' })
                  }
                >
                  {formData.status === 'active' ? 'Active' : 'Deactivated'}
                </Toggle>
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
        {toast && (
          <Toast
            message={toast.message}
            variant={toast.variant}
            duration={3000}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </AppLayout>
  );
}