// import { Button } from '@/components/ui/button';
// import { UserInfo } from '@/components/user-info';
// import { UserRoundPen, Trash2 } from 'lucide-react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { type User } from '@/types';

// interface Member extends User {
//   status: 'enabled' | 'disabled';
//   role: 'user' | 'admin';
// }

// interface MembersTableProps {
//   members: {
//     data: Member[];
//     current_page: number;
//     last_page: number;
//     per_page: number;
//     total: number;
//   };
//   onUpdateStatus: (id: number, newStatus: 'enabled' | 'disabled') => void;
//   onEditMember: (member: Member) => void;
//   onDeleteMember: (id: number) => void;
//   onPageChange: (page: number) => void;
// }

// export function MembersTable({
//   members,
//   onUpdateStatus,
//   onEditMember,
//   onDeleteMember,
//   onPageChange,
// }: MembersTableProps) {
//   return (
//     <div className="flex flex-col">
//       <div className="divide-y divide-gray-200 rounded-lg overflow-hidden">
//         <div className="flex items-center px-4 py-3 font-medium text-sm uppercase text-[#1E1E1E] bg-blue-200">
//           <div className="flex-1 pl-4">Name</div>
//           <div className="flex-1">Email</div>
//           <div className="flex-1 relative group">Status</div>
//           <div className="flex-1">Role</div>
//           <div className="w-24">Actions</div>
//         </div>
//         {members.data.length > 0 ? (
//           members.data.map((member) => (
//             <div
//               key={member.id}
//               className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-sidebar-accent"
//             >
//               <div className="flex-1 pl-4">
//                 <UserInfo user={member} showEmail={false} />
//               </div>
//               <div className="flex-1 text-sm underline">{member.email}</div>
//               <div className="flex-1 relative group">
//                 <span
//                   className={`inline-block px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
//                     member.status === 'enabled'
//                       ? 'bg-green-100 text-chart-2'
//                       : 'bg-red-100 text-red-600'
//                   }`}
//                   onClick={() =>
//                     onUpdateStatus(member.id, member.status === 'enabled' ? 'disabled' : 'enabled')
//                   }
//                 >
//                   {member.status === 'enabled' ? 'Enabled' : 'Disabled'}
//                 </span>
//                 <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 z-10 w-64">
//                   {member.status === 'enabled'
//                     ? 'Enabled: User can log in. Disable to block access (e.g., for leave or security).'
//                     : 'Disabled: User cannot log in. Enable to restore access.'}
//                 </div>
//               </div>
//               <div className="flex-1 text-sm">
//                 {member.role === 'user' ? 'Member' : 'Admin'}
//               </div>
//               <div className="w-24 flex gap-2">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="hover:bg-transparent"
//                   onClick={() => onEditMember(member)}
//                 >
//                   <UserRoundPen className="h-4 w-4 text-chart-2" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="hover:bg-transparent"
//                   onClick={() => onDeleteMember(member.id)}
//                 >
//                   <Trash2 className="h-4 w-4 text-red-600" />
//                 </Button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-muted-foreground p-4 text-center">
//             No members found matching your search.
//           </div>
//         )}
//       </div>
//       <div className="flex items-center justify-between px-4 py-3">
//         <div className="text-sm text-muted-foreground">
//           Showing {members.data.length} of {members.total} members
//         </div>
//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             disabled={members.current_page === 1}
//             onClick={() => onPageChange(members.current_page - 1)}
//           >
//             <ChevronLeft className="h-4 w-4" />
//             Previous
//           </Button>
//           <span className="text-sm">
//             Page {members.current_page} of {members.last_page}
//           </span>
//           <Button
//             variant="outline"
//             size="sm"
//             disabled={members.current_page === members.last_page}
//             onClick={() => onPageChange(members.current_page + 1)}
//           >
//             Next
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// members-table.tsx
import { Button } from '@/components/ui/button';
import { UserInfo } from '@/components/user-info';
import { UserRoundPen, Trash2 } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type User } from '@/types';

interface Member extends User {
    role: 'user' | 'admin';
    created_at: string;
}

interface MembersTableProps {
    members: {
        data: Member[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    onEditMember: (member: Member) => void;
    onDeleteMember: (id: number) => void;
    onPageChange: (page: number) => void;
}

export function MembersTable({
    members,
    onEditMember,
    onDeleteMember,
    onPageChange,
}: MembersTableProps) {
    return (
        <div className="flex flex-col">
            <div className="divide-y divide-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="flex items-center px-4 py-3 font-medium text-sm uppercase text-[#1E1E1E] bg-blue-200">
                    <div className="flex-1 pl-4">Name</div>
                    <div className="flex-1">Email</div>
                    <div className="flex-1">Added At</div>
                    <div className="flex-1">Role</div>
                    <div className="w-24">Actions</div>
                </div>
                {members.data.length > 0 ? (
                    members.data.map((member, index) => (
                        <div
                            key={member.id}
                            className={`flex items-center px-4 py-3 ${
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                            }`}
                        >
                            <div className="flex-1 pl-4">
                                <UserInfo user={member} showEmail={false} />
                            </div>
                            <div className="flex-1 text-sm underline">{member.email}</div>
                            <div className="flex-1 text-sm">
                                {new Date(member.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex-1 text-sm">
                                {member.role === 'user' ? 'Member' : 'Admin'}
                            </div>
                            <div className="w-24 flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-transparent"
                                    onClick={() => onEditMember(member)}
                                >
                                    <UserRoundPen className="h-4 w-4 text-chart-2" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-transparent"
                                    onClick={() => onDeleteMember(member.id)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-muted-foreground p-4 text-center bg-white">
                        No members found matching your search.
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-white">
                <div className="text-sm text-muted-foreground">
                    Showing {members.data.length} of {members.total} members
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={members.current_page === 1}
                        onClick={() => onPageChange(members.current_page - 1)}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <span className="text-sm">
                        Page {members.current_page} of {members.last_page}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={members.current_page === members.last_page}
                        onClick={() => onPageChange(members.current_page + 1)}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}