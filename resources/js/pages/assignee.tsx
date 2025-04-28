// import ErrorBoundary from '@/components/error-boundary';
// import InputError from '@/components/input-error';
// import { Button } from '@/components/ui/button';
// import { DatePicker } from '@/components/ui/date-picker';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
// import { FileUpload } from '@/components/ui/file-upload';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import TasksTable from '@/components/ui/tasks-table';
// import { Textarea } from '@/components/ui/textarea';
// import { TimePicker } from '@/components/ui/time-picker';
// import { Toast } from '@/components/ui/toast';
// import AppLayout from '@/layouts/app-layout';
// import { Task, type BreadcrumbItem } from '@/types';
// import { PageProps } from '@inertiajs/core';
// import { Head, router, usePage } from '@inertiajs/react';
// import dayjs, { Dayjs } from 'dayjs';
// import { FilePlusIcon, Search, SlidersHorizontal } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { debounce } from 'lodash';
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from '@/components/ui/dropdown-menu';

// const breadcrumbs: BreadcrumbItem[] = [{ title: 'Tasks Management', href: '/assignee' }];

// interface User {
//     id: number;
//     name: string;
// }

// interface CustomPageProps extends PageProps {
//     tasks: {
//         data: Task[];
//         current_page: number;
//         last_page: number;
//         per_page: number;
//         total: number;
//     };
//     users: User[];
//     flash?: {
//         success?: string;
//         error?: string;
//     };
//     search?: string;
//     status?: string;
// }

// export default function Assignee() {
//     const { tasks: initialTasks, users, flash, search: initialSearch, status: initialStatus } = usePage<CustomPageProps>().props;

//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [attachedFile, setAttachedFile] = useState<File | null>(null);
//     const [assigneeId, setAssigneeId] = useState<string>('');
//     const [dueDateTime, setDueDateTime] = useState<Dayjs | null>(null);
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//     const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
//     const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
//     const [toastMessage, setToastMessage] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);
//     const [titleError, setTitleError] = useState<string | undefined>(undefined);
//     const [descriptionError, setDescriptionError] = useState<string | undefined>(undefined);
//     const [assigneeError, setAssigneeError] = useState<string | undefined>(undefined);
//     const [dueDateTimeError, setDueDateTimeError] = useState<string | undefined>(undefined);
//     const [searchTerm, setSearchTerm] = useState<string>(initialSearch || '');
//     const [filterStatus, setFilterStatus] = useState<string>(
//         initialStatus ? initialStatus.charAt(0).toUpperCase() + initialStatus.slice(1) : 'All'
//     );

//     // Helper function to get the assignee's name from assignee_id
//     const getAssigneeName = (assigneeId: number): string | null => {
//         const user = users.find((user) => user.id === assigneeId);
//         return user ? user.name : 'Unknown';
//     };

//     // Handle flash messages
//     useEffect(() => {
//         if (flash?.success) {
//             setToastMessage({ message: flash.success, variant: 'success' });
//         }
//         if (flash?.error) {
//             setToastMessage({ message: flash.error, variant: 'error' });
//         }
//     }, [flash]);

//     const handleFileSelect = (file: File | null) => {
//         setAttachedFile(file);
//     };

//     const handleDateChange = (date: Date) => {
//         const newDate = dueDateTime ? dueDateTime.toDate() : new Date();
//         newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
//         setDueDateTime(dayjs(newDate));
//         setDueDateTimeError(undefined);
//     };

//     const handleTimeChange = (time: Date) => {
//         const newDate = dueDateTime ? dueDateTime.toDate() : new Date();
//         newDate.setHours(time.getHours(), time.getMinutes());
//         setDueDateTime(dayjs(newDate));
//         setDueDateTimeError(undefined);
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
      
//         // Reset errors
//         setTitleError(undefined);
//         setDescriptionError(undefined);
//         setAssigneeError(undefined);
//         setDueDateTimeError(undefined);
      
//         let hasError = false;
      
//         // Validate required fields
//         if (!title) {
//           setTitleError('Title is required');
//           hasError = true;
//         }
//         if (!description) {
//           setDescriptionError('Description is required');
//           hasError = true;
//         }
//         if (!assigneeId) {
//           setAssigneeError('Please select an assignee');
//           hasError = true;
//         }
//         if (!dueDateTime || !dueDateTime.isValid()) {
//           setDueDateTimeError('Due date and time are required');
//           hasError = true;
//         }
      
//         if (hasError) {
//           console.log('Client-side validation errors:', { titleError, descriptionError, assigneeError, dueDateTimeError });
//           return;
//         }
      
//         // Create FormData object
//         const formData = new FormData();
//         formData.append('title', title);
//         formData.append('description', description);
//         formData.append('assignee_id', assigneeId);
//         formData.append('due_date_time', dueDateTime!.toISOString());
//         formData.append(
//           'started_date',
//           editingTaskId
//             ? initialTasks.data.find((task) => task.id === editingTaskId)?.started_date_time || dayjs().toISOString()
//             : dayjs().toISOString()
//         );
//         formData.append(
//           'status',
//           editingTaskId
//             ? initialTasks.data.find((task) => task.id === editingTaskId)?.status || 'pending'
//             : 'pending'
//         );
      
//         // Append file if it exists
//         if (attachedFile) {
//           formData.append('attached_file', attachedFile);
//         }
      
//         // Add _method for PATCH requests (Laravel expects this for spoofing PUT/PATCH)
//         if (editingTaskId) {
//           formData.append('_method', 'PATCH');
//         }
      
//         // Log data for debugging
//         console.log('FormData being sent:', {
//           title,
//           description,
//           assignee_id: assigneeId,
//           due_date_time: dueDateTime!.toISOString(),
//           started_date: formData.get('started_date'),
//           status: formData.get('status'),
//           attached_file: attachedFile ? attachedFile.name : 'No file',
//         });
      
//         const method = editingTaskId ? 'post' : 'post'; // Use 'post' for both, as _method handles PATCH
//         const url = editingTaskId ? `/assignee/${editingTaskId}` : '/assignee';
      
//         router[method](url, formData, {
//           preserveState: true,
//           preserveScroll: true,
//           onBefore: () => {
//             console.log('Sending request to:', url, 'with method:', method);
//           },
//           onSuccess: () => {
//             console.log('Request successful');
//             setTitle('');
//             setDescription('');
//             setAttachedFile(null);
//             setAssigneeId('');
//             setDueDateTime(null);
//             setEditingTaskId(null);
//             setIsDialogOpen(false);
//             setToastMessage({
//               message: editingTaskId ? 'Task updated successfully!' : 'Task created successfully!',
//               variant: 'success',
//             });
//             router.reload({ only: ['tasks', 'flash'] });
//           },
//           onError: (errors) => {
//             console.error('Server validation errors:', errors);
//             setToastMessage({ message: 'Failed to save task', variant: 'error' });
//             if (errors.title) setTitleError(errors.title);
//             if (errors.description) setDescriptionError(errors.description);
//             if (errors.assignee_id) setAssigneeError(errors.assignee_id);
//             if (errors.due_date_time) setDueDateTimeError(errors.due_date_time);
//             if (errors.attached_file) setToastMessage({ message: errors.attached_file, variant: 'error' });
//           },
//           onFinish: () => {
//             console.log('Request finished');
//           },
//         });
//       };

//     const handleDelete = (id: number) => {
//         setDeletingTaskId(id);
//         setIsDeleteDialogOpen(true);
//     };

//     const confirmDelete = () => {
//         if (!deletingTaskId) return;

//         router.delete(`/assignee/${deletingTaskId}`, {
//             preserveState: true,
//             preserveScroll: true,
//             onSuccess: () => {
//                 setToastMessage({ message: 'Task deleted successfully', variant: 'success' });
//                 setIsDeleteDialogOpen(false);
//                 setDeletingTaskId(null);
//             },
//             onError: () => {
//                 setToastMessage({ message: 'Failed to delete task', variant: 'error' });
//                 setIsDeleteDialogOpen(false);
//                 setDeletingTaskId(null);
//             },
//         });
//     };

//     const handleEdit = (task: Task) => {
//         console.log('Editing task:', task);
//         setTitle(task.title || '');
//         setDescription(task.description || '');
//         setAttachedFile(null);
//         setAssigneeId(task.assignee_id ? task.assignee_id.toString() : '');
//         setDueDateTime(task.due_date_time ? dayjs(task.due_date_time) : null);
//         setEditingTaskId(task.id);
//         setIsDialogOpen(true);
//         setTitleError(undefined);
//         setDescriptionError(undefined);
//         setAssigneeError(undefined);
//         setDueDateTimeError(undefined);
//     };

//     const handleSearchChange = debounce((value: string) => {
//         setSearchTerm(value);
//         router.visit('/assignee', {
//             method: 'get',
//             data: { search: value, status: filterStatus.toLowerCase() === 'all' ? '' : filterStatus.toLowerCase() },
//             preserveState: true,
//             preserveScroll: true,
//             only: ['tasks', 'flash', 'search', 'status'],
//         });
//     }, 100);

//     const handlePageChange = (page: number) => {
//         router.visit(`/assignee?page=${page}&search=${encodeURIComponent(searchTerm)}&status=${filterStatus.toLowerCase() === 'all' ? '' : filterStatus.toLowerCase()}`, {
//             preserveState: true,
//             preserveScroll: true,
//             only: ['tasks', 'flash', 'search', 'status'],
//         });
//     };

//     const handleFilterChange = (status: string) => {
//         setFilterStatus(status);
//         router.visit('/assignee', {
//             method: 'get',
//             data: { search: searchTerm, status: status.toLowerCase() === 'all' ? '' : status.toLowerCase() },
//             preserveState: true,
//             preserveScroll: true,
//             only: ['tasks', 'flash', 'search', 'status'],
//         });
//     };

//     // Transform tasks to include assignee name for display
//     const tasksWithAssigneeName = initialTasks.data.map((task) => ({
//         ...task,
//         assignee: getAssigneeName(task.assignee_id),
//     }));

//     console.log('Attached file:', attachedFile);

//     return (
//         <ErrorBoundary>
//             <AppLayout breadcrumbs={breadcrumbs}>
//                 <Head title="Task Assignee" />
//                 <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
//                     {/* Toast Notification */}
//                     {toastMessage && <Toast message={toastMessage.message} variant={toastMessage.variant} onClose={() => setToastMessage(null)} />}

//                     {/* Header Section */}
//                     <div className="flex flex-col gap-2">
//                         <div className="flex justify-between items-center p-2 rounded-md">
//                             <div>
//                                 <Dialog
//                                     open={isDialogOpen}
//                                     onOpenChange={(open) => {
//                                         setIsDialogOpen(open);
//                                         if (!open) {
//                                             setTitle('');
//                                             setDescription('');
//                                             setAttachedFile(null);
//                                             setAssigneeId('');
//                                             setDueDateTime(null);
//                                             setEditingTaskId(null);
//                                             setTitleError(undefined);
//                                             setDescriptionError(undefined);
//                                             setAssigneeError(undefined);
//                                             setDueDateTimeError(undefined);
//                                         }
//                                     }}
//                                 >
//                                     <DialogTrigger asChild>
//                                         <Button
//                                             className="h-10 bg-blue-950 text-sm text-white hover:bg-blue-950/90"
//                                             disabled={!users.length}
//                                         >
//                                             <FilePlusIcon className="h-4 w-4" />
//                                             Create Task
//                                         </Button>
//                                     </DialogTrigger>
//                                     <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
//                                         <DialogHeader>
//                                             <DialogTitle>{editingTaskId ? 'Edit Task' : 'Create New Task'}</DialogTitle>
//                                             <DialogDescription>
//                                                 {editingTaskId ? 'Modify the details of the existing task.' : 'Fill out the form to create a new task.'}
//                                             </DialogDescription>
//                                         </DialogHeader>
//                                         <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
//                                             <div className="flex flex-col gap-4">
//                                                 <div>
//                                                     <label htmlFor="title" className="text-foreground text-sm font-medium">
//                                                         Title
//                                                     </label>
//                                                     <Input
//                                                         id="title"
//                                                         placeholder="Organize Weekly Team Meeting"
//                                                         value={title}
//                                                         onChange={(e) => setTitle(e.target.value)}
//                                                         className="border-border bg-background text-foreground mt-1 box-border w-full rounded-md border px-3"
//                                                     />
//                                                     <InputError message={titleError} className="mt-1" />
//                                                 </div>
//                                                 <div>
//                                                     <label htmlFor="description" className="text-foreground text-sm font-medium">
//                                                         Description
//                                                     </label>
//                                                     <Textarea
//                                                         id="description"
//                                                         placeholder="Schedule and prepare for the weekly team meeting"
//                                                         value={description}
//                                                         onChange={(e) => setDescription(e.target.value)}
//                                                         className="border-border bg-background text-foreground mt-1 box-border min-h-[100px] w-full rounded-md border px-3"
//                                                     />
//                                                     <InputError message={descriptionError} className="mt-1" />
//                                                 </div>
//                                                 <div>
//                                                     <label htmlFor="assignee" className="text-foreground text-sm font-medium">
//                                                         Assignee
//                                                     </label>
//                                                     <Select value={assigneeId} onValueChange={setAssigneeId}>
//                                                         <SelectTrigger className="border-border bg-background text-foreground mt-1 box-border w-full rounded-md border px-3">
//                                                             <SelectValue placeholder="Select an assignee" />
//                                                         </SelectTrigger>
//                                                         <SelectContent>
//                                                             {users.map((user) => (
//                                                                 <SelectItem key={user.id} value={user.id.toString()}>
//                                                                     {user.name}
//                                                                 </SelectItem>
//                                                             ))}
//                                                         </SelectContent>
//                                                     </Select>
//                                                     <InputError message={assigneeError} className="mt-1" />
//                                                 </div>
//                                                 <div className="flex flex-col gap-2">
//                                                     <div>
//                                                         <label htmlFor="due-date" className="text-foreground text-sm font-medium">
//                                                             Due Date
//                                                         </label>
//                                                         <DatePicker
//                                                             id="due-date"
//                                                             value={dueDateTime?.toDate() || new Date()}
//                                                             onChange={handleDateChange}
//                                                             className="border-border bg-background text-foreground mt-1 box-border w-full rounded-md border px-3"
//                                                             aria-labelledby="due-date-label"
//                                                         />
//                                                     </div>
//                                                     <div>
//                                                         <label htmlFor="due-time" className="text-foreground text-sm font-medium">
//                                                             Due Time
//                                                         </label>
//                                                         <TimePicker
//                                                             id="due-time"
//                                                             value={dueDateTime?.toDate() || new Date()}
//                                                             onChange={handleTimeChange}
//                                                             className="border-border bg-background text-foreground mt-1 box-border w-full rounded-md border px-3"
//                                                             aria-labelledby="due-date-label"
//                                                         />
//                                                     </div>
//                                                     <InputError message={dueDateTimeError} className="mt-1" />
//                                                 </div>
//                                                 <div>
//                                                     <label className="text-foreground text-sm font-medium">File Attachment</label>
//                                                     <FileUpload onFileSelect={handleFileSelect} className="mt-1 w-full" />
//                                                 </div>
//                                                 <div className="flex justify-center">
//                                                     <Button className="h-10 w-full bg-blue-950 text-sm text-white hover:bg-blue-900" type="submit">
//                                                         {editingTaskId ? 'Update Task' : 'Send Task'}
//                                                     </Button>
//                                                 </div>
//                                             </div>
//                                         </form>
//                                     </DialogContent>
//                                 </Dialog>
//                             </div>

//                             <div className="flex items-center gap-2">
//                                 <div className="relative">
//                                     <Input
//                                         type="text"
//                                         placeholder="Search by title or description"
//                                         className="pr-2 pl-8 w-full"
//                                         value={searchTerm}
//                                         onChange={(e) => handleSearchChange(e.target.value)}
//                                     />
//                                     <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//                                 </div>
//                                 <DropdownMenu>
//                                     <DropdownMenuTrigger asChild>
//                                         <Button
//                                             variant="outline"
//                                             className="h-10 text-sm font-light text-gray-600 border-gray-300 hover:bg-gray-100"
//                                         >
//                                             <SlidersHorizontal className="h-4 w-4" />
//                                             Filter
//                                         </Button>
//                                     </DropdownMenuTrigger>
//                                     <DropdownMenuContent align="end">
//                                         <DropdownMenuItem onClick={() => handleFilterChange('All')}>
//                                             All
//                                         </DropdownMenuItem>
//                                         <DropdownMenuItem onClick={() => handleFilterChange('Pending')}>
//                                             Pending
//                                         </DropdownMenuItem>
//                                         <DropdownMenuItem onClick={() => handleFilterChange('On Progress')}>
//                                             On Progress
//                                         </DropdownMenuItem>
//                                         <DropdownMenuItem onClick={() => handleFilterChange('Done')}>
//                                             Done
//                                         </DropdownMenuItem>
//                                         <DropdownMenuItem onClick={() => handleFilterChange('Overdue')}>
//                                             Overdue
//                                         </DropdownMenuItem>
//                                     </DropdownMenuContent>
//                                 </DropdownMenu>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex-1">
//                         <TasksTable
//                             tasks={tasksWithAssigneeName}
//                             handleEdit={handleEdit}
//                             handleDelete={handleDelete}
//                             onPageChange={handlePageChange}
//                             pagination={{
//                                 current_page: initialTasks.current_page,
//                                 last_page: initialTasks.last_page,
//                                 per_page: initialTasks.per_page,
//                                 total: initialTasks.total,
//                             }}
//                         />
//                     </div>

//                     <Dialog
//                         open={isDeleteDialogOpen}
//                         onOpenChange={(open) => {
//                             setIsDeleteDialogOpen(open);
//                             if (!open) {
//                                 setDeletingTaskId(null);
//                             }
//                         }}
//                     >
//                         <DialogContent>
//                             <DialogHeader>
//                                 <DialogTitle>Confirmation Deletion</DialogTitle>
//                                 <DialogDescription>Are you sure you want to delete this task?</DialogDescription>
//                             </DialogHeader>
//                             <DialogFooter>
//                                 <Button
//                                     variant="outline"
//                                     className="hover:bg-accent border-red-600 text-red-600 hover:text-red-600/90"
//                                     onClick={() => {
//                                         setIsDeleteDialogOpen(false);
//                                         setDeletingTaskId(null);
//                                     }}
//                                 >
//                                     Cancel
//                                 </Button>
//                                 <Button onClick={confirmDelete} variant="destructive">
//                                     Delete
//                                 </Button>
//                             </DialogFooter>
//                         </DialogContent>
//                     </Dialog>
//                 </div>
//             </AppLayout>
//         </ErrorBoundary>
//     );
// }

import ErrorBoundary from '@/components/error-boundary';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TasksTable from '@/components/ui/tasks-table';
import { Textarea } from '@/components/ui/textarea';
import { TimePicker } from '@/components/ui/time-picker';
import { Toast } from '@/components/ui/toast';
import AppLayout from '@/layouts/app-layout';
import { Task, type BreadcrumbItem } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import dayjs, { Dayjs } from 'dayjs';
import { FilePlusIcon, Search, SlidersHorizontal, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Tasks Management', href: '/assignee' }];

interface User {
    id: number;
    name: string;
}

interface CustomPageProps extends PageProps {
    tasks: {
        data: Task[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    users: User[];
    flash?: {
        success?: string;
        error?: string;
    };
    search?: string;
    status?: string;
}

export default function Assignee() {
    const { tasks: initialTasks, users, flash, search: initialSearch, status: initialStatus } = usePage<CustomPageProps>().props;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [existingFile, setExistingFile] = useState<string | null>(null);
    const [removeFile, setRemoveFile] = useState(false);
    const [showUploadAnother, setShowUploadAnother] = useState(false); // New state to toggle upload field
    const [assigneeId, setAssigneeId] = useState<string>('');
    const [dueDateTime, setDueDateTime] = useState<Dayjs | null>(null);
    const [startedDate, setStartedDate] = useState<Dayjs | null>(null);
    const [status, setStatus] = useState<string>('pending');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [toastMessage, setToastMessage] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);
    const [titleError, setTitleError] = useState<string | undefined>(undefined);
    const [descriptionError, setDescriptionError] = useState<string | undefined>(undefined);
    const [assigneeError, setAssigneeError] = useState<string | undefined>(undefined);
    const [dueDateTimeError, setDueDateTimeError] = useState<string | undefined>(undefined);
    const [startedDateError, setStartedDateError] = useState<string | undefined>(undefined);
    const [statusError, setStatusError] = useState<string | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState<string>(initialSearch || '');
    const [filterStatus, setFilterStatus] = useState<string>(
        initialStatus ? initialStatus.charAt(0).toUpperCase() + initialStatus.slice(1) : 'All'
    );

    const getAssigneeName = (assigneeId: number): string | null => {
        const user = users.find((user) => user.id === assigneeId);
        return user ? user.name : 'Unknown';
    };

    useEffect(() => {
        if (flash?.success) {
            setToastMessage({ message: flash.success, variant: 'success' });
        }
        if (flash?.error) {
            setToastMessage({ message: flash.error, variant: 'error' });
        }
    }, [flash]);

    const handleFileSelect = (file: File | null) => {
        setAttachedFile(file);
        setRemoveFile(true); // Mark existing file for removal when a new file is selected
        setShowUploadAnother(false); // Hide the upload field after selecting a file
    };

    const handleDateChange = (date: Date) => {
        const newDate = dueDateTime ? dueDateTime.toDate() : new Date();
        newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        setDueDateTime(dayjs(newDate));
        setDueDateTimeError(undefined);
    };

    const handleTimeChange = (time: Date) => {
        const newDate = dueDateTime ? dueDateTime.toDate() : new Date();
        newDate.setHours(time.getHours(), time.getMinutes());
        setDueDateTime(dayjs(newDate));
        setDueDateTimeError(undefined);
    };

    const handleStartedDateChange = (date: Date) => {
        const newDate = startedDate ? startedDate.toDate() : new Date();
        newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        setStartedDate(dayjs(newDate));
        setStartedDateError(undefined);
    };

    const handleStartedTimeChange = (time: Date) => {
        const newDate = startedDate ? startedDate.toDate() : new Date();
        newDate.setHours(time.getHours(), time.getMinutes());
        setStartedDate(dayjs(newDate));
        setStartedDateError(undefined);
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        setStatusError(undefined);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setTitleError(undefined);
        setDescriptionError(undefined);
        setAssigneeError(undefined);
        setDueDateTimeError(undefined);
        setStartedDateError(undefined);
        setStatusError(undefined);

        let hasError = false;

        if (!title) {
            setTitleError('Title is required');
            hasError = true;
        }
        if (!description) {
            setDescriptionError('Description is required');
            hasError = true;
        }
        if (!assigneeId) {
            setAssigneeError('Please select an assignee');
            hasError = true;
        }
        if (!dueDateTime || !dueDateTime.isValid()) {
            setDueDateTimeError('Due date and time are required');
            hasError = true;
        }
        if (!startedDate || !startedDate.isValid()) {
            setStartedDateError('Started date and time are required');
            hasError = true;
        }
        if (!status) {
            setStatusError('Status is required');
            hasError = true;
        }

        if (hasError) {
            console.log('Client-side validation errors:', {
                titleError,
                descriptionError,
                assigneeError,
                dueDateTimeError,
                startedDateError,
                statusError,
            });
            return;
        }

        let computedStatus = status;
        if (dueDateTime && dueDateTime.isBefore(dayjs()) && status !== 'done') {
            computedStatus = 'overdue';
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('assignee_id', assigneeId);
        formData.append('due_date_time', dueDateTime!.toISOString());
        formData.append('started_date', startedDate!.toISOString());
        formData.append('status', computedStatus);

        if (attachedFile) {
            formData.append('attached_file', attachedFile);
        } else if (removeFile) {
            formData.append('remove_file', '1');
        }

        if (editingTaskId) {
            formData.append('_method', 'PATCH');
        }

        console.log('FormData being sent:', {
            title,
            description,
            assignee_id: assigneeId,
            due_date_time: dueDateTime!.toISOString(),
            started_date: startedDate!.toISOString(),
            status: computedStatus,
            attached_file: attachedFile ? attachedFile.name : removeFile ? 'Remove file' : existingFile || 'No change',
        });

        const method = 'post';
        const url = editingTaskId ? `/assignee/${editingTaskId}` : '/assignee';

        router[method](url, formData, {
            preserveState: true,
            preserveScroll: true,
            onBefore: () => {
                console.log('Sending request to:', url, 'with method:', method);
            },
            onSuccess: () => {
                console.log('Request successful');
                setTitle('');
                setDescription('');
                setAttachedFile(null);
                setExistingFile(null);
                setRemoveFile(false);
                setShowUploadAnother(false);
                setAssigneeId('');
                setDueDateTime(null);
                setStartedDate(null);
                setStatus('pending');
                setEditingTaskId(null);
                setIsDialogOpen(false);
                setToastMessage({
                    message: editingTaskId ? 'Task updated successfully!' : 'Task created successfully!',
                    variant: 'success',
                });
                router.reload({ only: ['tasks', 'flash'] });
            },
            onError: (errors) => {
                console.error('Server validation errors:', errors);
                setToastMessage({ message: 'Failed to save task', variant: 'error' });
                if (errors.title) setTitleError(errors.title);
                if (errors.description) setDescriptionError(errors.description);
                if (errors.assignee_id) setAssigneeError(errors.assignee_id);
                if (errors.due_date_time) setDueDateTimeError(errors.due_date_time);
                if (errors.started_date) setStartedDateError(errors.started_date);
                if (errors.status) setStatusError(errors.status);
                if (errors.attached_file) setToastMessage({ message: errors.attached_file, variant: 'error' });
            },
            onFinish: () => {
                console.log('Request finished');
            },
        });
    };

    const handleDelete = (id: number) => {
        setDeletingTaskId(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!deletingTaskId) return;

        router.delete(`/assignee/${deletingTaskId}`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setToastMessage({ message: 'Task deleted successfully', variant: 'success' });
                setIsDeleteDialogOpen(false);
                setDeletingTaskId(null);
            },
            onError: () => {
                setToastMessage({ message: 'Failed to delete task', variant: 'error' });
                setIsDeleteDialogOpen(false);
                setDeletingTaskId(null);
            },
        });
    };

    const handleEdit = (task: Task) => {
        console.log('Editing task:', task);
        setTitle(task.title || '');
        setDescription(task.description || '');
        setAttachedFile(null);
        setExistingFile(task.attached_file);
        setRemoveFile(false);
        setShowUploadAnother(false);
        setAssigneeId(task.assignee_id ? task.assignee_id.toString() : '');
        setDueDateTime(task.due_date_time ? dayjs(task.due_date_time) : null);
        setStartedDate(task.started_date_time ? dayjs(task.started_date_time) : null);
        setStatus(task.status || 'pending');
        setEditingTaskId(task.id);
        setIsDialogOpen(true);
        setTitleError(undefined);
        setDescriptionError(undefined);
        setAssigneeError(undefined);
        setDueDateTimeError(undefined);
        setStartedDateError(undefined);
        setStatusError(undefined);
    };

    const handleSearchChange = debounce((value: string) => {
        setSearchTerm(value);
        router.visit('/assignee', {
            method: 'get',
            data: { search: value, status: filterStatus.toLowerCase() === 'all' ? '' : filterStatus.toLowerCase() },
            preserveState: true,
            preserveScroll: true,
            only: ['tasks', 'flash', 'search', 'status'],
        });
    }, 100);

    const handlePageChange = (page: number) => {
        router.visit(`/assignee?page=${page}&search=${encodeURIComponent(searchTerm)}&status=${filterStatus.toLowerCase() === 'all' ? '' : filterStatus.toLowerCase()}`, {
            preserveState: true,
            preserveScroll: true,
            only: ['tasks', 'flash', 'search', 'status'],
        });
    };

    const handleFilterChange = (status: string) => {
        setFilterStatus(status);
        router.visit('/assignee', {
            method: 'get',
            data: { search: searchTerm, status: status.toLowerCase() === 'all' ? '' : status.toLowerCase() },
            preserveState: true,
            preserveScroll: true,
            only: ['tasks', 'flash', 'search', 'status'],
        });
    };

    const tasksWithAssigneeName = initialTasks.data.map((task) => ({
        ...task,
        assignee: getAssigneeName(task.assignee_id),
    }));

    console.log('Attached file:', attachedFile);

    return (
        <ErrorBoundary>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Task Assignee" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    {toastMessage && <Toast message={toastMessage.message} variant={toastMessage.variant} onClose={() => setToastMessage(null)} />}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center p-2 rounded-md">
                            <div>
                                <Dialog
                                    open={isDialogOpen}
                                    onOpenChange={(open) => {
                                        setIsDialogOpen(open);
                                        if (!open) {
                                            setTitle('');
                                            setDescription('');
                                            setAttachedFile(null);
                                            setExistingFile(null);
                                            setRemoveFile(false);
                                            setShowUploadAnother(false);
                                            setAssigneeId('');
                                            setDueDateTime(null);
                                            setStartedDate(null);
                                            setStatus('pending');
                                            setEditingTaskId(null);
                                            setTitleError(undefined);
                                            setDescriptionError(undefined);
                                            setAssigneeError(undefined);
                                            setDueDateTimeError(undefined);
                                            setStartedDateError(undefined);
                                            setStatusError(undefined);
                                        }
                                    }}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            className="h-10 bg-blue-950 text-sm text-white hover:bg-blue-950/90"
                                            disabled={!users.length}
                                        >
                                            <FilePlusIcon className="h-4 w-4" />
                                            Create Task
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>{editingTaskId ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                                            <DialogDescription>
                                                {editingTaskId ? 'Modify the details of the existing task.' : 'Fill out the form to create a new task.'}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                                            <div className="flex flex-col gap-4">
                                                <div>
                                                    <label htmlFor="title" className="text-foreground text-sm font-medium">
                                                        Title
                                                    </label>
                                                    <Input
                                                        id="title"
                                                        placeholder="Organize Weekly Team Meeting"
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                        className="border-border bg-background text-foreground mt-1 box-border w-full rounded-md border px-3"
                                                    />
                                                    <InputError message={titleError} className="mt-1" />
                                                </div>
                                                <div>
                                                    <label htmlFor="description" className="text-foreground text-sm font-medium">
                                                        Description
                                                    </label>
                                                    <Textarea
                                                        id="description"
                                                        placeholder="Schedule and prepare for the weekly team meeting"
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        className="border-border bg-background text-foreground mt-1 box-border min-h-[100px] w-full rounded-md border px-3"
                                                    />
                                                    <InputError message={descriptionError} className="mt-1" />
                                                </div>
                                                <div>
                                                    <label htmlFor="assignee" className="text-foreground text-sm font-medium">
                                                        Assignee
                                                    </label>
                                                    <Select value={assigneeId} onValueChange={setAssigneeId}>
                                                        <SelectTrigger className="border-border bg-background text-foreground mt-1 box-border w-full rounded-md border px-3">
                                                            <SelectValue placeholder="Select an assignee" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {users.map((user) => (
                                                                <SelectItem key={user.id} value={user.id.toString()}>
                                                                    {user.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError message={assigneeError} className="mt-1" />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div>
                                                        <label htmlFor="due-date" className="text-foreground text-sm font-medium">
                                                            Due Date
                                                        </label>
                                                        <DatePicker
                                                            id="due-date"
                                                            value={dueDateTime?.toDate() || new Date()}
                                                            onChange={handleDateChange}
                                                            className="border-border bg-background text-foreground mt-1 box-border w-full rounded-md border px-3"
                                                            aria-labelledby="due-date-label"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="due-time" className="text-foreground text-sm font-medium">
                                                            Due Time
                                                        </label>
                                                        <TimePicker
                                                            id="due-time"
                                                            value={dueDateTime?.toDate() || new Date()}
                                                            onChange={handleTimeChange}
                                                            className="border-border bg-background text-foreground mt-1 box-border w-full rounded-md border px-3"
                                                            aria-labelledby="due-date-label"
                                                        />
                                                    </div>
                                                    <InputError message={dueDateTimeError} className="mt-1" />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div>
                                                        <label htmlFor="started-date" className="text-foreground text-sm font-medium">
                                                            Started Date
                                                        </label>
                                                        <DatePicker
                                                            id="started-date"
                                                            value={startedDate?.toDate() || new Date()}
                                                            onChange={handleStartedDateChange}
                                                            className="border-border bg-background text-foreground mt-1 box-border w-full rounded-md border px-3"
                                                            aria-labelledby="started-date-label"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="started-time" className="text-foreground text-sm font-medium">
                                                            Started Time
                                                        </label>
                                                        <TimePicker
                                                            id="started-time"
                                                            value={startedDate?.toDate() || new Date()}
                                                            onChange={handleStartedTimeChange}
                                                            className="border-border bg-background text-foreground mt-1 box-border w-full rounded-md border px-3"
                                                            aria-labelledby="started-date-label"
                                                        />
                                                    </div>
                                                    <InputError message={startedDateError} className="mt-1" />
                                                </div>
                                                <div>
                                                    <label htmlFor="status" className="text-foreground text-sm font-medium">
                                                        Status
                                                    </label>
                                                    <Select value={status} onValueChange={handleStatusChange}>
                                                        <SelectTrigger className="border-border bg-background text-foreground mt-1 box-border w-full rounded-md border px-3">
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pending">Pending</SelectItem>
                                                            <SelectItem value="on progress">On Progress</SelectItem>
                                                            <SelectItem value="done">Done</SelectItem>
                                                            <SelectItem value="overdue">Overdue</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError message={statusError} className="mt-1" />
                                                </div>
                                                <div>
                                                    <label className="text-foreground text-sm font-medium">File Attachment</label>
                                                    {existingFile && !removeFile && !showUploadAnother && (
                                                        <div className="mt-1 flex items-center gap-2">
                                                            <a
                                                                href={existingFile}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                View Current File
                                                            </a>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setShowUploadAnother(true)}
                                                                className="text-green-600 border-green-600 hover:bg-600/90 hover:text-green-600"
                                                            >
                                                                <Upload className="h-4 w-4 mr-1" />
                                                                Change File
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setRemoveFile(true)}
                                                                className="text-red-600 border-red-600 hover:bg-red-50"
                                                            >
                                                                Remove File
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {(showUploadAnother || !existingFile || removeFile) && (
                                                        <FileUpload onFileSelect={handleFileSelect} className="mt-1 w-full" />
                                                    )}
                                                </div>
                                                <div className="flex justify-center">
                                                    <Button className="h-10 w-full bg-blue-950 text-sm text-white hover:bg-blue-900" type="submit">
                                                        {editingTaskId ? 'Update Task' : 'Send Task'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Search by title or description"
                                        className="pr-2 pl-8 w-full"
                                        value={searchTerm}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                    />
                                    <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="h-10 text-sm font-light text-gray-600 border-gray-300 hover:bg-gray-100"
                                        >
                                            <SlidersHorizontal className="h-4 w-4" />
                                            Filter
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleFilterChange('All')}>
                                            All
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleFilterChange('Pending')}>
                                            Pending
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleFilterChange('On Progress')}>
                                            On Progress
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleFilterChange('Done')}>
                                            Done
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleFilterChange('Overdue')}>
                                            Overdue
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <TasksTable
                            tasks={tasksWithAssigneeName}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            onPageChange={handlePageChange}
                            pagination={{
                                current_page: initialTasks.current_page,
                                last_page: initialTasks.last_page,
                                per_page: initialTasks.per_page,
                                total: initialTasks.total,
                            }}
                        />
                    </div>
                    <Dialog
                        open={isDeleteDialogOpen}
                        onOpenChange={(open) => {
                            setIsDeleteDialogOpen(open);
                            if (!open) {
                                setDeletingTaskId(null);
                            }
                        }}
                    >
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirmation Deletion</DialogTitle>
                                <DialogDescription>Are you sure you want to delete this task?</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    className="hover:bg-accent border-red-600 text-red-600 hover:text-red-600/90"
                                    onClick={() => {
                                        setIsDeleteDialogOpen(false);
                                        setDeletingTaskId(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={confirmDelete} variant="destructive">
                                    Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </AppLayout>
        </ErrorBoundary>
    );
}