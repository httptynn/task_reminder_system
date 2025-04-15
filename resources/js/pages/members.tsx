// // members.tsx
// import { useState } from 'react';
// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem } from '@/types';
// import { Head, router } from '@inertiajs/react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Search, UserRoundPlus } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { MembersTable } from '@/components/ui/members-table';

// const breadcrumbs: BreadcrumbItem[] = [
//   {
//     title: 'Members',
//     href: '/members',
//   },
// ];

// interface Member {
//   id: number;
//   name: string;
//   email: string;
//   status: 'active' | 'deactivated';
//   role: 'user' | 'admin';
// }

// export default function Members({ members: initialMembers }: { members: Member[] }) {
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [members, setMembers] = useState<Member[]>(initialMembers);
//   const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

//   const filteredMembers = members.filter((member) =>
//     `${member.name} ${member.email}`.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleAddMember = (name: string, email: string, role: string) => {
//     router.post(
//       '/members',
//       {
//         name,
//         email,
//         role,
//         status: 'active',
//       },
//       {
//         onSuccess: () => {
//           router.reload({ only: ['members'] });
//         },
//         onError: (errors) => {
//           console.error('Error adding member:', errors);
//         },
//       }
//     );
//   };

//   const handleRemoveMember = (id: number) => {
//     router.delete(`/members/${id}`, {
//       onSuccess: () => {
//         router.reload({ only: ['members'] });
//         setSelectedMembers(selectedMembers.filter((memberId) => memberId !== id));
//       },
//       onError: (errors) => {
//         console.error('Error removing member:', errors);
//       },
//     });
//   };

//   const handleUpdateStatus = (id: number, newStatus: 'active' | 'deactivated') => {
//     router.patch(
//       `/members/${id}`,
//       { status: newStatus },
//       {
//         onSuccess: () => {
//           router.reload({ only: ['members'] });
//         },
//         onError: (errors) => {
//           console.error('Error updating member status:', errors);
//         },
//       }
//     );
//   };

//   const handleSelectMember = (id: number) => {
//     setSelectedMembers((prev) =>
//       prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id]
//     );
//   };

//   const handleSelectAll = (checked: boolean) => {
//     setSelectedMembers(checked ? members.map((member) => member.id) : []);
//   };

//   return (
//     <AppLayout breadcrumbs={breadcrumbs}>
//       <Head title="Members" />
//       <div className="flex h-full flex-1 flex-col gap-5 rounded-xl p-4">
//         <div className="flex items-center justify-between">
//           <h1 className="text-xl font-semibold">Member Management</h1>
//           <div className="flex items-center gap-2">
//             <span className="text-muted-foreground text-sm mr-2">{filteredMembers.length} members</span>
//             <div className="relative">
//               <Input
//                 type="text"
//                 placeholder="Search"
//                 className="pl-8 pr-2"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//             </div>
//             <Dialog>
//               <DialogTrigger asChild>
//                 <Button className="flex items-center gap-1 ml-2 bg-primary text-primary-foreground hover:bg-primary/90">
//                   <UserRoundPlus className="h-4 w-4" />
//                   Add member
//                 </Button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Add New Member</DialogTitle>
//                   <DialogDescription>Enter the details for the new member.</DialogDescription>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                   <Input type="text" placeholder="Name" id="name" />
//                   <Input type="email" placeholder="Email" id="email" />
//                   <select
//                     className="rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
//                     id="role"
//                   >
//                     <option value="user">Member</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                 </div>
//                 <DialogFooter>
//                   <Button variant="outline">Cancel</Button>
//                   <Button
//                     onClick={() => {
//                       const name = (document.getElementById('name') as HTMLInputElement).value;
//                       const email = (document.getElementById('email') as HTMLInputElement).value;
//                       const role = (document.getElementById('role') as HTMLSelectElement).value;
//                       handleAddMember(name, email, role);
//                     }}
//                   >
//                     Add
//                   </Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </div>
//         <div className="flex-1">
//           <MembersTable
//             members={filteredMembers}
//             onRemoveMember={handleRemoveMember}
//             onUpdateStatus={handleUpdateStatus}
//             onSelectMember={handleSelectMember}
//             onSelectAll={handleSelectAll}
//             selectedMembers={selectedMembers}
//           />
//         </div>
//       </div>
//     </AppLayout>
//   );
// }
import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
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
  [key: string]: any; // Add index signature to satisfy Inertia.js PageProps
}

export default function Members({ members: initialMembers }: { members: Member[] }) {
  const { flash } = usePage<PageProps>().props;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [errors, setErrors] = useState<{ name?: string; email?: string; role?: string }>({});
  const [formData, setFormData] = useState<{ name: string; email: string; role: string }>({
    name: '',
    email: '',
    role: 'user',
  });
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (flash?.success) {
      setToast({ message: flash.success, variant: 'success' });
    } else if (flash?.error) {
      setToast({ message: flash.error, variant: 'error' });
    }
  }, [flash]);

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
          setFormData({ name: '', email: '', role: 'user' });
          router.reload({ only: ['members', 'flash'] });
        },
        onError: (errors) => {
          setErrors(errors);
        },
      }
    );
  };

  const handleRemoveMember = (id: number) => {
    router.delete(`/members/${id}`, {
      onSuccess: () => {
        setSelectedMembers(selectedMembers.filter((memberId) => memberId !== id));
        router.reload({ only: ['members', 'flash'] });
      },
      onError: (errors) => {
        console.error('Error removing member:', errors);
      },
    });
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

  const handleSelectAll = (checked: boolean) => {
    setSelectedMembers(checked ? members.map((member) => member.id) : []);
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
            <Dialog>
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
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleAddMember}>Add</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex-1">
          <MembersTable
            members={filteredMembers}
            onRemoveMember={handleRemoveMember}
            onUpdateStatus={handleUpdateStatus}
            onSelectMember={handleSelectMember}
            onSelectAll={handleSelectAll}
            selectedMembers={selectedMembers}
          />
        </div>
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