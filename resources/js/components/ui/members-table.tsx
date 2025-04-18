import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { UserRoundPen } from 'lucide-react';

interface Member {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'deactivated';
  role: 'user' | 'admin';
}

interface MembersTableProps {
  members: Member[];
  onRemoveMember: (id: number) => void;
  onUpdateStatus: (id: number, newStatus: 'active' | 'deactivated') => void;
  onSelectMember: (id: number) => void;
  onSelectAll: (checked: boolean) => void;
  selectedMembers: number[];
  onEditMember: (member: Member) => void;
}

export function MembersTable({
  members,
  onRemoveMember,
  onUpdateStatus,
  onSelectMember,
  onSelectAll,
  selectedMembers,
  onEditMember,
}: MembersTableProps) {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="flex items-center px-4 py-3 font-medium text-sm uppercase text-[#1E1E1E] dark:text-[#FEFEFE]">
        <Checkbox
          checked={selectedMembers.length === members.length && members.length > 0}
          onCheckedChange={(checked) => onSelectAll(checked as boolean)}
        />
        <div className="flex-1 pl-4">Name</div>
        <div className="flex-1">Email</div>
        <div className="flex-1">Status</div>
        <div className="flex-1">Role</div>
        <div className="w-20">Edit</div>
      </div>
      {members.length > 0 ? (
        members.map((member) => (
          <div
            key={member.id}
            className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-sidebar-accent"
          >
            <Checkbox
              checked={selectedMembers.includes(member.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onRemoveMember(member.id); // Trigger dialog for deletion
                } else {
                  onSelectMember(member.id); // Toggle selection for batch
                }
              }}
            />
            <div className="flex-1 pl-4 text-sm">{member.name}</div>
            <div className="flex-1 text-sm underline">{member.email}</div>
            <div className="flex-1">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  member.status === 'active'
                    ? 'bg-green-100 text-chart-2'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {member.status === 'active' ? 'Active' : 'Deactivated'}
              </span>
            </div>
            <div className="flex-1 text-sm">
              {member.role === 'user' ? 'Member' : 'Admin'}
            </div>
            <div className="w-20">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-transparent"
                onClick={() => onEditMember(member)}
              >
                <UserRoundPen className="h-4 w-4 text-chart-2" />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-muted-foreground p-4 text-center">
          No members found matching your search.
        </div>
      )}
    </div>
  );
}