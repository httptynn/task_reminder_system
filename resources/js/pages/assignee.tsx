import ErrorBoundary from '@/components/error-boundary';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { PencilIcon, TrashIcon, FilePlusIcon } from 'lucide-react';
import TasksTable from '@/components/ui/tasks-table';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Tasks', href: '/assignee' },
  { title: 'Tasks List', href: '/assignee' },
];

interface Task {
  id: number;
  title: string;
  description: string;
  attachedFile: File | null;
  assignee: string;
  dueDateTime: string | null;
  startedDate: string;
  status: 'pending' | 'on progress' | 'done' | 'overdue';
}

export default function Assignee() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [assignee, setAssignee] = useState('');
  const [dueDateTime, setDueDateTime] = useState<Dayjs | null>(dayjs('2025-01-16 22:30'));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const handleFileSelect = (file: File | null) => {
    setAttachedFile(file);
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) {
      setDueDateTime(null);
      return;
    }
    const newDate = dueDateTime ? dueDateTime.toDate() : new Date();
    newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    setDueDateTime(dayjs(newDate));
  };

  const handleTimeChange = (time: Date | null) => {
    if (!time) {
      setDueDateTime(null);
      return;
    }
    const newDate = dueDateTime ? dueDateTime.toDate() : new Date();
    newDate.setHours(time.getHours(), time.getMinutes());
    setDueDateTime(dayjs(newDate));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskData = {
      title,
      description,
      attachedFile,
      assignee,
      dueDateTime: dueDateTime ? dueDateTime.toISOString() : null,
      startedDate: dayjs().toISOString(),
      status: 'pending' as const,
    };

    if (editingTaskId) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId ? { ...task, ...taskData, id: editingTaskId } : task
        )
      );
      setEditingTaskId(null);
    } else {
      setTasks([...tasks, { ...taskData, id: tasks.length + 1 }]);
    }

    setTitle('');
    setDescription('');
    setAttachedFile(null);
    setAssignee('');
    setDueDateTime(dayjs('2025-01-16 22:30'));
    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEdit = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setAttachedFile(task.attachedFile);
    setAssignee(task.assignee);
    setDueDateTime(task.dueDateTime ? dayjs(task.dueDateTime) : null);
    setEditingTaskId(task.id);
    setIsDialogOpen(true);
  };

  return (
    <ErrorBoundary>
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Assignee" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Task Management</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-950 text-white hover:bg-blue-900 text-sm h-10">
                  <FilePlusIcon className="h-4 w-4" />
                  Create Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingTaskId ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                  <DialogDescription>
                    {editingTaskId
                      ? 'Modify the details of the existing task.'
                      : 'Fill out the form to create a new task.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
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
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white text-black px-3 box-border"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="text-foreground text-sm font-medium">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        placeholder="Schedule and prepare for the weekly team meeting."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 min-h-[100px] w-full rounded-md border border-gray-300 bg-white text-black px-3 box-border"
                      />
                    </div>
                    <div>
                      <label htmlFor="assignee" className="text-foreground text-sm font-medium">
                        Assignee(s)
                      </label>
                      <Input
                        id="assignee"
                        placeholder="Mention @email or @name"
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)} // Fixed bug: was setting description
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white text-black px-3 box-border"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div>
                        <label htmlFor="due-date" className="text-foreground text-sm font-medium">
                          Due Date
                        </label>
                        <DatePicker
                          id="due-date"
                          value={dueDateTime ? dueDateTime.toDate() : null}
                          onChange={handleDateChange}
                          className="mt-1 w-full rounded-md border border-gray-300 bg-white text-black px-3 box-border"
                          aria-labelledby="due-date-label"
                        />
                      </div>
                      <div>
                        <label htmlFor="due-time" className="text-foreground text-sm font-medium">
                          Due Time
                        </label>
                        <TimePicker
                          id="due-time"
                          value={dueDateTime ? dueDateTime.toDate() : null}
                          onChange={handleTimeChange}
                          className="mt-1 w-full rounded-md border border-gray-300 bg-white text-black px-3 box-border"
                          aria-labelledby="due-time-label"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-foreground text-sm font-medium">Attach File</label>
                      <FileUpload onFileSelect={handleFileSelect} className="w-full mt-1" />
                    </div>
                    <div className="flex justify-center">
                      <Button
                        className="bg-blue-950 text-white hover:bg-blue-900 text-sm w-full  h-10"
                        type="submit"
                      >
                        {editingTaskId ? 'Update Task' : 'Send Task'}
                      </Button>
                    </div>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <TasksTable tasks={tasks} handleEdit={handleEdit} handleDelete={handleDelete} />
        </div>
      </AppLayout>
    </ErrorBoundary>
  );
}