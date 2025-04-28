import FullNotification from '@fullNotification/react';
import dayGridPlugin from '@fullNotification/daygrid';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Event {
    title: string;
    date: string; // ISO format with time (e.g., "2025-04-15T14:30:00")
    description?: string;
    teamName?: string;
    assignedUser?: string;
    createdAt?: string;
    status?: 'pending' | 'done' | 'overdue';
}

interface FullNotificationComponentProps {
    initialEvents?: Event[];
    onEventUpdate?: (updatedEvent: Event) => void;
}

export default function FullNotificationComponent({ initialEvents = [], onEventUpdate }: FullNotificationComponentProps) {
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        teamName: '',
        assignedUser: '',
        dueDate: '',
        dueTime: '',
        status: 'pending' as 'pending' | 'done' | 'overdue',
    });

    useEffect(() => {
        setEvents(initialEvents);
    }, [initialEvents]);

    const handleEventClick = (info: any) => {
        const event: Event = {
            title: info.event.title,
            date: info.event.start?.toISOString() || '',
            description: info.event.extendedProps.description,
            teamName: info.event.extendedProps.teamName,
            assignedUser: info.event.extendedProps.assignedUser,
            createdAt: info.event.extendedProps.createdAt,
            status: info.event.extendedProps.status || 'pending',
        };
        setSelectedEvent(event);
        setEditFormData({
            title: event.title,
            description: event.description || '',
            teamName: event.teamName || '',
            assignedUser: event.assignedUser || '',
            dueDate: event.date.split('T')[0],
            dueTime: event.date.split('T')[1]?.slice(0, 5) || '',
            status: event.status || 'pending',
        });
    };

    const handleEditInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (selectedEvent) {
            const updatedEvent: Event = {
                ...selectedEvent,
                title: editFormData.title,
                description: editFormData.description || undefined,
                teamName: editFormData.teamName || undefined,
                assignedUser: editFormData.assignedUser || undefined,
                date: `${editFormData.dueDate}T${editFormData.dueTime}:00`,
                status: editFormData.status,
            };
            setEvents((prev) => prev.map((e) => (e.date === selectedEvent.date && e.title === selectedEvent.title ? updatedEvent : e)));
            onEventUpdate?.(updatedEvent);
            setSelectedEvent(null);
        }
    };

    // Format time to 12-hour format with AM/PM
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am'; // Use full "am" or "pm"
        const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM/PM
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes}${ampm}`;
    };

    return (
        <div className="h-full w-full">
            <FullNotification
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events.map((event) => ({
                    title: event.title,
                    start: event.date,
                    extendedProps: {
                        description: event.description,
                        teamName: event.teamName,
                        assignedUser: event.assignedUser,
                        createdAt: event.createdAt,
                        status: event.status,
                    },
                    backgroundColor: event.status === 'done' ? '#10b981' : event.status === 'overdue' ? '#ef4444' : '#3788d8',
                }))}
                height="100%"
                contentHeight="auto"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,dayGridDay',
                }}
                eventClick={handleEventClick}
                eventContent={(eventInfo) => {
                    const event = eventInfo.event;
                    const title = event.title;
                    const time = formatTime(event.start?.toISOString() || '');

                    return (
                        <div className="flex flex-col p-1">
                            <div
                                className="text-sm font-medium truncate max-w-full"
                                title={title} // Tooltip for full title on hover
                            >
                                {title}
                            </div>
                            <div className="text-[10px] text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                {time}
                            </div>
                        </div>
                    );
                }}
            />
            {selectedEvent && (
                <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
                    <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                        <DialogHeader>
                            <DialogTitle>Edit Schedule</DialogTitle>
                            <DialogDescription className="text-gray-600 dark:text-gray-400">
                                Adjust the details of this schedule.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium mb-1">
                                    Task Title
                                </label>
                                <Input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={editFormData.title}
                                    onChange={handleEditInputChange}
                                    placeholder="Enter task title"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={editFormData.description}
                                    onChange={handleEditInputChange}
                                    placeholder="Enter task description"
                                    className="border-input placeholder:text-muted-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label htmlFor="teamName" className="block text-sm font-medium mb-1">
                                    Team Name
                                </label>
                                <Input
                                    type="text"
                                    id="teamName"
                                    name="teamName"
                                    value={editFormData.teamName}
                                    onChange={handleEditInputChange}
                                    placeholder="Enter team name"
                                />
                            </div>
                            <div>
                                <label htmlFor="assignedUser" className="block text-sm font-medium mb-1">
                                    Assigned User
                                </label>
                                <Input
                                    type="text"
                                    id="assignedUser"
                                    name="assignedUser"
                                    value={editFormData.assignedUser}
                                    onChange={handleEditInputChange}
                                    placeholder="Enter assigned user"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                                        Due Date
                                    </label>
                                    <Input
                                        type="date"
                                        id="dueDate"
                                        name="dueDate"
                                        value={editFormData.dueDate}
                                        onChange={handleEditInputChange}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="dueTime" className="block text-sm font-medium mb-1">
                                        Due Time
                                    </label>
                                    <Input
                                        type="time"
                                        id="dueTime"
                                        name="dueTime"
                                        value={editFormData.dueTime}
                                        onChange={handleEditInputChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium mb-1">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={editFormData.status}
                                    onChange={handleEditInputChange}
                                    className="border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="done">Done</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>Created At:</strong> {selectedEvent.createdAt ? new Date(selectedEvent.createdAt).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}