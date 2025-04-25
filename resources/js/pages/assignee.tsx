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
import { FilePlusIcon, Search, SlidersHorizontal } from 'lucide-react';
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
    const [assigneeId, setAssigneeId] = useState<string>(users[0]?.id.toString() || '');
    const [dueDateTime, setDueDateTime] = useState<Dayjs>(dayjs());
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [toastMessage, setToastMessage] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);
    const [titleError, setTitleError] = useState<string | undefined>(undefined);
    const [descriptionError, setDescriptionError] = useState<string | undefined>(undefined);
    const [dueDateTimeError, setDueDateTimeError] = useState<string | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState<string>(initialSearch || '');
    const [filterStatus, setFilterStatus] = useState<string>(
        initialStatus ? initialStatus.charAt(0).toUpperCase() + initialStatus.slice(1) : 'All'
    );

    // Helper function to get the assignee's name from assignee_id
    const getAssigneeName = (assigneeId: number): string | null => {
        const user = users.find((user) => user.id === assigneeId);
        return user ? user.name : 'Unknown';
    };

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setToastMessage({ message: flash.success, variant: 'success' });
        }
        if (flash?.error) {
            setToastMessage({ message: flash.error, variant: 'error' });
        }
    }, [flash]);

    // Set default assignee for UX purposes
    useEffect(() => {
        if (users.length > 0 && !assigneeId && !editingTaskId) {
            setAssigneeId(users[0].id.toString());
        }
    }, [users, assigneeId, editingTaskId]);

    const handleFileSelect = (file: File | null) => {
        setAttachedFile(file);
    };

    const handleDateChange = (date: Date, _event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> | undefined) => {
        const newDate = dueDateTime.toDate();
        newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        setDueDateTime(dayjs(newDate));
        if (dueDateTimeError) {
            setDueDateTimeError(undefined);
        }
    };

    const handleTimeChange = (time: Date, _event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> | undefined) => {
        const newDate = dueDateTime.toDate();
        newDate.setHours(time.getHours(), time.getMinutes());
        setDueDateTime(dayjs(newDate));
        if (dueDateTimeError) {
            setDueDateTimeError(undefined);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setTitleError(undefined);
        setDescriptionError(undefined);
        setDueDateTimeError(undefined);

        let hasError = false;

        if (!title.trim()) {
            setTitleError('Title is required');
            hasError = true;
        }
        if (!description.trim()) {
            setDescriptionError('Description is required');
            hasError = true;
        }
        if (!assigneeId || !users.some((user) => user.id.toString() === assigneeId)) {
            setDueDateTimeError('Please select a valid assignee');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (attachedFile) {
            formData.append('attached_file', attachedFile);
        }
        formData.append('assignee_id', assigneeId);
        formData.append('due_date_time', dueDateTime.toISOString());
        const startedDate = editingTaskId ? initialTasks.data.find((task) => task.id === editingTaskId)!.started_date_time : dayjs().toISOString();
        formData.append('started_date', startedDate);
        formData.append('status', 'pending');
        if (editingTaskId) {
            formData.append('_method', 'PATCH');
        }

        const method = 'post';
        const url = editingTaskId ? `/assignee/${editingTaskId}` : '/assignee';

        router[method](url, formData, {
            onSuccess: () => {
                setTitle('');
                setDescription('');
                setAttachedFile(null);
                setAssigneeId(users[0]?.id.toString() || '');
                setDueDateTime(dayjs());
                setEditingTaskId(null);
                setIsDialogOpen(false);
            },
            onError: (errors) => {
                console.error('Error submitting task:', errors);
                setToastMessage({ message: 'Failed to save task', variant: 'error' });
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
            onSuccess: () => {
                console.log('Task deleted successfully');
                setToastMessage({ message: 'Task deleted successfully', variant: 'success' });
                setIsDeleteDialogOpen(false);
                setDeletingTaskId(null);
            },
            onError: (errors) => {
                console.error('Error deleting task:', errors);
                setToastMessage({ message: 'Failed to delete task', variant: 'error' });
                setIsDeleteDialogOpen(false);
                setDeletingTaskId(null);
            },
        });
    };

    const handleEdit = (task: Task) => {
        setTitle(task.title);
        setDescription(task.description);
        setAttachedFile(null);
        setAssigneeId(task.assignee_id?.toString() || '');
        setDueDateTime(dayjs(task.due_date_time));
        setEditingTaskId(task.id);
        setIsDialogOpen(true);
        setTitleError(undefined);
        setDescriptionError(undefined);
        setDueDateTimeError(undefined);
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
            onError: (errors) => console.error('Inertia error:', errors),
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

    // Transform tasks to include assignee name for display
    const tasksWithAssigneeName = initialTasks.data.map((task) => ({
        ...task,
        assignee: getAssigneeName(task.assignee_id),
    }));

    return (
        <ErrorBoundary>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Task Assignee" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    {/* Toast Notification */}
                    {toastMessage && <Toast message={toastMessage.message} variant={toastMessage.variant} onClose={() => setToastMessage(null)} />}

                    {/* Header Section */}
                    <div className="flex flex-col gap-2">
                        {/* Row: Create Task (left) and Search/Filter (right) */}
                        <div className="flex justify-between items-center p-2 rounded-md">
                            {/* Create Task (Left-Aligned) */}
                            <div>
                                <Dialog
                                    open={isDialogOpen}
                                    onOpenChange={(open) => {
                                        setIsDialogOpen(open);
                                        if (!open) {
                                            setTitle('');
                                            setDescription('');
                                            setAttachedFile(null);
                                            setAssigneeId(users[0]?.id.toString() || '');
                                            setDueDateTime(dayjs());
                                            setEditingTaskId(null);
                                            setTitleError(undefined);
                                            setDescriptionError(undefined);
                                            setDueDateTimeError(undefined);
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
                                                        onChange={(e) => {
                                                            setTitle(e.target.value);
                                                            if (titleError && e.target.value.trim()) {
                                                                setTitleError(undefined);
                                                            }
                                                        }}
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
                                                        onChange={(e) => {
                                                            setDescription(e.target.value);
                                                            if (descriptionError && e.target.value.trim()) {
                                                                setDescriptionError(undefined);
                                                            }
                                                        }}
                                                        className="border-border bg-background text-foreground mt-1 box-border min-h-[100px] w-full rounded-md border px-3"
                                                    />
                                                    <InputError message={descriptionError} className="mt-1" />
                                                </div>
                                                <div>
                                                    <label htmlFor="assignee" className="text-foreground text-sm font-medium">
                                                        Assignee
                                                    </label>
                                                    <div>
                                                        <Select value={assigneeId} onValueChange={(value) => setAssigneeId(value)}>
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
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div>
                                                        <label htmlFor="due-date" className="text-foreground text-sm font-medium">
                                                            Due Date
                                                        </label>
                                                        <DatePicker
                                                            id="due-date"
                                                            value={dueDateTime.toDate()}
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
                                                            value={dueDateTime.toDate()}
                                                            onChange={handleTimeChange}
                                                            className="border-border bg-background text-foreground mt-1 box-border w-full rounded-md border px-3"
                                                            aria-labelledby="due-date-label"
                                                        />
                                                    </div>
                                                    <InputError message={dueDateTimeError} className="mt-1" />
                                                </div>
                                                <div>
                                                    <label className="text-foreground text-sm font-medium">File Attachment</label>
                                                    <FileUpload onFileSelect={handleFileSelect} className="mt-1 w-full" />
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

                            {/* Search and Filter (Right-Aligned) */}
                            <div className="flex items-center gap-2">
                                {/* Search */}
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Search by title or description"
                                        className="pr-2 pl-8 w-full "
                                        value={searchTerm}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                    />
                                    <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                </div>
                                {/* Filter */}
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

                    {/* Table */}
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

                    {/* Delete Confirmation Dialog */}
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
                                <DialogDescription>Are you sure do you want to delete this task?</DialogDescription>
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