
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { UserInfo } from '@/components/user-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, Search, UserRoundMinus, UserRoundPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Members',
    href: '/members',
  },
];

export default function Members({ members: initialMembers }: { members: any[] }) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [members, setMembers] = useState(initialMembers);

  const filteredMembers = members.filter((member) =>
    `${member.name} ${member.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = () => {
    console.log('Add member clicked');
    const newMember = {
      id: members.length + 1,
      name: 'New Member',
      email: 'new.member@example.com',
      role: 'user',
    };
    setMembers([...members, newMember]);
  };

  const handleRemoveMember = (id: number) => {
    console.log('Remove member:', id);
    setMembers(members.filter((member) => member.id !== id));
  };

  const handleChangeRole = (id: number, newRole: string) => {
    console.log('Change role for member:', id, 'to', newRole);
    setMembers(
      members.map((member) =>
        member.id === id ? { ...member, role: newRole } : member
      )
    );
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
                  <Input type="text" placeholder="Name" />
                  <Input type="email" placeholder="Email" />
                  <select className="rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                    <option value="user" className='text-muted-foreground'>User</option>
                    <option value="admin" className='text-muted-foreground'>Admin</option>
                  </select>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => console.log('Cancel')}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMember}>Add</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex-1">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <UserInfo user={member} showEmail={true} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 hover:bg-white dark:hover:bg-[#080b0e]"
                        >
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}{' '}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Role</DialogTitle>
                          <DialogDescription>
                            Select a new role for {member.name || member.email}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-2 py-4">
                          <Button
                            variant={member.role === 'user' ? 'default' : 'outline'}
                            onClick={() => handleChangeRole(member.id, 'user')}
                          >
                            User
                          </Button>
                          <Button
                            variant={member.role === 'admin' ? 'default' : 'outline'}
                            onClick={() => handleChangeRole(member.id, 'admin')}
                          >
                            Admin
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="hover:bg-red-700"
                        >
                          <UserRoundMinus className="text-white-foreground dark:text-white h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Remove Member</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to remove {member.name || member.email}?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => console.log('Cancel')}>
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleRemoveMember(member.id)}
                            className=' hover:bg-red-700'
                          >
                            Remove
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground p-4 text-center">
                No members found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

