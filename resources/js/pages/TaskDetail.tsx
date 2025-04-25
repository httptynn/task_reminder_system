import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { Bell, Download } from 'lucide-react';

type TaskDetailProps = {
    card: {
        title: string;
        dateAdded: string;
        dateEnd: string;
        fileUrl?: string;
    };
    auth: {
        user: {
            avatar: string | null;
            name: string;
            email: string;
        };
    };
};

export default function TaskDetail() {
    const { card, auth } = usePage().props as unknown as TaskDetailProps;
    const getInitials = useInitials();

    return (
        <AppLayout>
            <div className="space-y-5 p-5">
                {/* Top Part: Clicked Card Summary */}
                <div className="relative rounded-xl border bg-white p-6 shadow-lg dark:bg-neutral-900">
                    {/* Main card body (optional content or background) */}
                    <div className="min-h-[200px]"></div>

                    {/* Inner Card anchored to bottom */}
                    <div className="absolute bottom-0 left-0 w-full rounded-b-xl bg-[#036BFF] p-4">
                        <div className="flex items-start justify-between">
                            {/* Left side: Title and Dates */}
                            <div>
                                <h2 className="text-lg font-semibold text-white">{card.title}</h2>
                                <div className="mt-1 space-y-1">
                                    <p className="text-xs text-white">Start: {card.dateAdded}</p>
                                    <p className="text-xs text-white">End: {card.dateEnd}</p>
                                </div>
                            </div>

                            {/* Right side: Notification icon */}
                            <div>
                                <Bell className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Details & Inputs */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Left Column: Details */}
                    <div className="space-y-4 md:col-span-2">
                        <div className="rounded-xl border bg-[#036BFF] p-4 text-white">
                            {/* From Section */}
                            <p className="mb-2 text-xs font-semibold text-white">From</p>
                            <div className="mb-4 flex items-center gap-3">
                                <Avatar className="size-10">
                                    <AvatarImage src={auth.user.avatar ?? ''} />
                                    <AvatarFallback>{getInitials(auth.user.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium text-white">{auth.user.name}</p>
                                    <p className="text-xs text-white">Sent: {card.dateAdded}</p>
                                </div>
                            </div>

                            {/* Inner Card with Task Details */}
                            <div className="rounded-xl border bg-white p-4 text-neutral-900 dark:bg-neutral-900 dark:text-white">
                                <div className="mb-4">
                                    <p className="text-xs font-semibold">Title</p>
                                    <p className="text-xs">{card.title}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-xs font-semibold">Subject</p>
                                    <p className="text-xs">Design UI Mockups</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-xs font-semibold">Due Date</p>
                                    <p className="text-xs">{card.dateEnd}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-xs font-semibold">Assignee</p>
                                    <p className="text-xs">user1@email.com, user2@email.com</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-xs font-semibold">Attachment</p>
                                    {card.fileUrl ? (
                                        <a
                                            href={card.fileUrl}
                                            download
                                            className="inline-flex items-center gap-2 text-xs text-[#036BFF] hover:underline"
                                        >
                                            <Download className="h-4 w-4" />
                                            Download File
                                        </a>
                                    ) : (
                                        <p className="text-xs text-white italic">No file attached</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">Description</p>
                                    <p className="text-xs text-white">
                                        This is a sample task description provided by the sender. It outlines the requirements and expectations.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: User Input */}
                    <div className="space-y-4">
                        <div className="rounded-xl border bg-white p-4 text-xs shadow dark:bg-neutral-900">
                            <label className="font-medium">Add Description</label>
                            <Textarea className="mt-1 p-4 text-xs" placeholder="Write your update..." rows={8} />
                            <div className="mt-8">
                                <label className="font-medium">Attach File</label>
                                <Input type="file" className="mt-1 text-xs" />
                            </div>
                            <Button className="mt-4 w-full bg-[#036BFF] text-xs text-white hover:bg-[#035ee0] focus:ring-2 focus:ring-[#036BFF]">
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
