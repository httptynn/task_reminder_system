// import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem } from '@/types';
// import { Head } from '@inertiajs/react';
// import { Button } from '@/components/ui/button';
// import { Plus } from 'lucide-react';
// import { useState } from 'react';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
//  // Assuming you have this from earlier
// import FullCalendarComponent from '@/components/ui/full-calendar-component'; // Import the new component

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Calendar',
//         href: '/calendar',
//     },
// ];

// interface Event {
//     title: string;
//     date: string; // ISO format (e.g., "2025-04-15")
//     description?: string;
//     teamName?: string;
//     assignedUser?: string;
// }

// export default function Calendar() {
//     const [formData, setFormData] = useState({
//         title: '',
//         description: '',
//         teamName: '',
//         assignedUser: '',
//         dueDate: '',
//         createdAt: '',
//     });
//     const [errors, setErrors] = useState({
//         title: '',
//         description: '',
//         teamName: '',
//         assignedUser: '',
//         dueDate: '',
//     });
//     const [events, setEvents] = useState<Event[]>([]); // State to store calendar events

//     const users = [
//         { id: 1, name: 'John Doe' },
//         { id: 2, name: 'Jane Smith' },
//         { id: 3, name: 'Alice Johnson' },
//     ];

//     const handleInputChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//     ) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//         setErrors((prev) => ({ ...prev, [name]: '' }));
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         let hasErrors = false;
//         const newErrors = { title: '', description: '', teamName: '', assignedUser: '', dueDate: '' };

//         if (!formData.title) {
//             newErrors.title = 'Task title is required';
//             hasErrors = true;
//         }
//         if (!formData.description) {
//             newErrors.description = 'Description is required';
//             hasErrors = true;
//         }
//         if (!formData.assignedUser) {
//             newErrors.assignedUser = 'Please select a user';
//             hasErrors = true;
//         }
//         if (!formData.dueDate) {
//             newErrors.dueDate = 'Please select a due date';
//             hasErrors = true;
//         }

//         if (hasErrors) {
//             setErrors(newErrors);
//             return;
//         }

//         const timestamp = new Date().toISOString();
//         const newEvent: Event = {
//             title: formData.title,
//             date: formData.dueDate, // Use dueDate as the event date
//             description: formData.description,
//             teamName: formData.teamName || undefined,
//             assignedUser: users.find((u) => u.id === Number(formData.assignedUser))?.name,
//         };

//         setEvents((prev) => [...prev, newEvent]); // Add new event to calendar
//         console.log('Schedule Created:', { ...formData, createdAt: timestamp });

//         setFormData({
//             title: '',
//             description: '',
//             teamName: '',
//             assignedUser: '',
//             dueDate: '',
//             createdAt: '',
//         });
//     };

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Calendar" />
//             <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
//                 <div className="flex h-full gap-4">
//                     <div className="w-3/4 border-r border-gray-200 dark:border-gray-700 pr-4">
//                         <div className="flex items-center justify-between">
//                             <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
//                                 Calendar Schedule
//                             </h1>
//                             <Dialog>
//                                 <DialogTrigger asChild>
//                                     <Button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white flex items-center">
//                                         <Plus className="-mr-1 h-5 w-5" />
//                                         Create Schedule
//                                     </Button>
//                                 </DialogTrigger>
//                                 <DialogContent>
//                                     <DialogHeader>
//                                         <DialogTitle>Create New Schedule</DialogTitle>
//                                         <DialogDescription className="text-gray-600 dark:text-gray-400">
//                                             Assign a task to a user or team and set a due date.
//                                         </DialogDescription>
//                                     </DialogHeader>
//                                     <form onSubmit={handleSubmit} className="space-y-4">
//                                         <div>
//                                             <label htmlFor="title" className="block text-sm font-medium mb-1">
//                                                 Task Title (required)
//                                             </label>
//                                             <Input
//                                                 type="text"
//                                                 id="title"
//                                                 name="title"
//                                                 value={formData.title}
//                                                 onChange={handleInputChange}
//                                                 placeholder="Enter task title"
//                                                 aria-invalid={!!errors.title}
//                                                 className={errors.title ? 'border-destructive' : ''}
//                                             />
//                                             {errors.title && (
//                                                 <p className="mt-1 text-sm text-destructive">{errors.title}</p>
//                                             )}
//                                         </div>

//                                         <div>
//                                             <label htmlFor="description" className="block text-sm font-medium mb-1">
//                                                 Description (required)
//                                             </label>
//                                             <textarea
//                                                 id="description"
//                                                 name="description"
//                                                 value={formData.description}
//                                                 onChange={handleInputChange}
//                                                 placeholder="Enter task description"
//                                                 className={`border-input placeholder:text-muted-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
//                                                     errors.description ? 'border-destructive' : ''
//                                                 }`}
//                                                 rows={3}
//                                                 aria-invalid={!!errors.description}
//                                             />
//                                             {errors.description && (
//                                                 <p className="mt-1 text-sm text-destructive">{errors.description}</p>
//                                             )}
//                                         </div>

//                                         <div>
//                                             <label htmlFor="teamName" className="block text-sm font-medium mb-1">
//                                                 Team Name (group task)
//                                             </label>
//                                             <Input
//                                                 type="text"
//                                                 id="teamName"
//                                                 name="teamName"
//                                                 value={formData.teamName}
//                                                 onChange={handleInputChange}
//                                                 placeholder="Enter team name"
//                                                 aria-invalid={!!errors.teamName}
//                                                 className={errors.teamName ? 'border-destructive' : ''}
//                                             />
//                                             {errors.teamName && (
//                                                 <p className="mt-1 text-sm text-destructive">{errors.teamName}</p>
//                                             )}
//                                         </div>

//                                         <div>
//                                             <label htmlFor="assignedUser" className="block text-sm font-medium mb-1">
//                                                 Assign to User (individual task)
//                                             </label>
//                                             <select
//                                                 id="assignedUser"
//                                                 name="assignedUser"
//                                                 value={formData.assignedUser}
//                                                 onChange={handleInputChange}
//                                                 className="border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
//                                                 aria-invalid={!!errors.assignedUser}
//                                             >
//                                                 <option value="" disabled className="text-gray-500">
//                                                     Select a user
//                                                 </option>
//                                                 {users.map((user) => (
//                                                     <option key={user.id} value={user.id} className="text-gray-900">
//                                                         {user.name}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                             {errors.assignedUser && (
//                                                 <p className="mt-1 text-sm text-destructive">{errors.assignedUser}</p>
//                                             )}
//                                         </div>

//                                         <div>
//                                             <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
//                                                 Due Date (required)
//                                             </label>
//                                             <Input
//                                                 type="date"
//                                                 id="dueDate"
//                                                 name="dueDate"
//                                                 value={formData.dueDate}
//                                                 onChange={handleInputChange}
//                                                 aria-invalid={!!errors.dueDate}
//                                                 className={errors.dueDate ? 'border-destructive' : ''}
//                                             />
//                                             {errors.dueDate && (
//                                                 <p className="mt-1 text-sm text-destructive">{errors.dueDate}</p>
//                                             )}
//                                         </div>


//                                         <DialogFooter>
//                                             <Button
//                                                 type="button"
//                                                 variant="outline"
//                                                 onClick={() =>
//                                                     setFormData({
//                                                         title: '',
//                                                         description: '',
//                                                         teamName: '',
//                                                         assignedUser: '',
//                                                         dueDate: '',
//                                                         createdAt: '',
//                                                     })
//                                                 }
//                                             >
//                                                 Cancel
//                                             </Button>
//                                             <Button type="submit">Create Schedule</Button>
//                                         </DialogFooter>
//                                     </form>
//                                 </DialogContent>
//                             </Dialog>
//                         </div>
//                         <div className="mt-10 h-[calc(100%-4rem)]"> {/* Adjust height to fit */}
//                             <FullCalendarComponent initialEvents={events} />
//                         </div>
//                     </div>

//                     <div className="w-1/4 border-gray-400 dark:border-gray-600 pl-4">
//                         <div className="h-full">
//                             <PlaceholderPattern />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }

// calendar.tsx
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import FullCalendarComponent from '@/components/ui/full-calendar-component'; // Import the new component

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Calendar', href: '/calendar' },
];

interface Event {
    title: string;
    date: string; // ISO format with time
    description?: string;
    teamName?: string;
    assignedUser?: string;
    createdAt?: string;
    status?: 'pending' | 'done' | 'overdue';
}

export default function Calendar() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        teamName: '',
        assignedUser: '',
        dueDate: '',
        dueTime: '',
        createdAt: '',
    });
    const [errors, setErrors] = useState({
        title: '',
        description: '',
        teamName: '',
        assignedUser: '',
        dueDate: '',
        dueTime: '',
    });
    const [events, setEvents] = useState<Event[]>([]);

    const users = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Alice Johnson' },
    ];

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let hasErrors = false;
        const newErrors = { title: '', description: '', teamName: '', assignedUser: '', dueDate: '', dueTime: '' };

        if (!formData.title) {
            newErrors.title = 'Task title is required';
            hasErrors = true;
        }
        if (!formData.description) {
            newErrors.description = 'Description is required';
            hasErrors = true;
        }
        if (!formData.assignedUser) {
            newErrors.assignedUser = 'Please select a user';
            hasErrors = true;
        }
        if (!formData.dueDate) {
            newErrors.dueDate = 'Please select a due date';
            hasErrors = true;
        }
        if (!formData.dueTime) {
            newErrors.dueTime = 'Please select a due time';
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        const timestamp = new Date().toISOString();
        const dueDateTime = `${formData.dueDate}T${formData.dueTime}:00`;
        const newEvent: Event = {
            title: formData.title,
            date: dueDateTime,
            description: formData.description,
            teamName: formData.teamName || undefined,
            assignedUser: users.find((u) => u.id === Number(formData.assignedUser))?.name,
            createdAt: timestamp,
            status: 'pending',
        };

        setEvents((prev) => [...prev, newEvent]);
        console.log('Schedule Created:', newEvent);

        setFormData({
            title: '',
            description: '',
            teamName: '',
            assignedUser: '',
            dueDate: '',
            dueTime: '',
            createdAt: '',
        });
    };

    const handleEventUpdate = (updatedEvent: Event) => {
        setEvents((prev) => prev.map((e) => (e.date === updatedEvent.date && e.title === updatedEvent.title ? updatedEvent : e)));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calendar" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex h-full gap-4">
                    <div className="w-3/4 border-r border-gray-200 dark:border-gray-700 pr-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">

                                Task Deadline
                            </h1>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center">
                                        <Plus className="-mr-1 h-5 w-5" />
                                        Create Schedule
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className=" text-gray-900 dark:text-gray-100">
                                    <DialogHeader>
                                        <DialogTitle>Create New Schedule</DialogTitle>
                                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                                            Assign a task to a user or team and set a due date and time.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="title" className="block text-sm font-medium mb-1">
                                                Task Title (required)
                                            </label>
                                            <Input
                                                type="text"
                                                id="title"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                placeholder="Enter task title"
                                                aria-invalid={!!errors.title}
                                                className={errors.title ? 'border-destructive' : ''}
                                            />
                                            {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium mb-1">
                                                Description (required)
                                            </label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                placeholder="Enter task description"
                                                className={`border-input placeholder:text-muted-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${errors.description ? 'border-destructive' : ''}`}
                                                rows={3}
                                                aria-invalid={!!errors.description}
                                            />
                                            {errors.description && <p className="mt-1 text-sm text-destructive">{errors.description}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="teamName" className="block text-sm font-medium mb-1">
                                                Team Name (group task)
                                            </label>
                                            <Input
                                                type="text"
                                                id="teamName"
                                                name="teamName"
                                                value={formData.teamName}
                                                onChange={handleInputChange}
                                                placeholder="Enter team name"
                                                aria-invalid={!!errors.teamName}
                                                className={errors.teamName ? 'border-destructive' : ''}
                                            />
                                            {errors.teamName && <p className="mt-1 text-sm text-destructive">{errors.teamName}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="assignedUser" className="block text-sm font-medium mb-1">
                                                Assign to User (individual task)
                                            </label>
                                            <select
                                                id="assignedUser"
                                                name="assignedUser"
                                                value={formData.assignedUser}
                                                onChange={handleInputChange}
                                                className="border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                                aria-invalid={!!errors.assignedUser}
                                            >
                                                <option value="" disabled className="text-gray-500">
                                                    Select a user
                                                </option>
                                                {users.map((user) => (
                                                    <option key={user.id} value={user.id} className="text-gray-900">
                                                        {user.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.assignedUser && <p className="mt-1 text-sm text-destructive">{errors.assignedUser}</p>}
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                                                    Due Date (required)
                                                </label>
                                                <Input
                                                    type="date"
                                                    id="dueDate"
                                                    name="dueDate"
                                                    value={formData.dueDate}
                                                    onChange={handleInputChange}
                                                    aria-invalid={!!errors.dueDate}
                                                    className={errors.dueDate ? 'border-destructive' : ''}
                                                />
                                                {errors.dueDate && <p className="mt-1 text-sm text-destructive">{errors.dueDate}</p>}
                                            </div>
                                            <div className="flex-1">
                                                <label htmlFor="dueTime" className="block text-sm font-medium mb-1">
                                                    Due Time (required)
                                                </label>
                                                <Input
                                                    type="time"
                                                    id="dueTime"
                                                    name="dueTime"
                                                    value={formData.dueTime}
                                                    onChange={handleInputChange}
                                                    aria-invalid={!!errors.dueTime}
                                                    className={errors.dueTime ? 'border-destructive' : ''}
                                                />
                                                {errors.dueTime && <p className="mt-1 text-sm text-destructive">{errors.dueTime}</p>}
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setFormData({
                                                        title: '',
                                                        description: '',
                                                        teamName: '',
                                                        assignedUser: '',
                                                        dueDate: '',
                                                        dueTime: '',
                                                        createdAt: '',
                                                    })
                                                }
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit">Create Schedule</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="mt-10 h-[calc(100%-4rem)]">
                            <FullCalendarComponent initialEvents={events} onEventUpdate={handleEventUpdate} />
                        </div>
                    </div>
                    <div className="w-1/4 border-gray-400 dark:border-gray-600 pl-4">
                        <div className="h-full">
                            <PlaceholderPattern />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}