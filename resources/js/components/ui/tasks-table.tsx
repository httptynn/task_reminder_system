import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import { FilePenLine, Trash2 } from 'lucide-react';

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

interface TasksTableProps {
  tasks: Task[];
  handleEdit: (task: Task) => void;
  handleDelete: (id: number) => void;
}

export default function TasksTable({ tasks, handleEdit, handleDelete }: TasksTableProps) {
  return (
    <div className="flex flex-col">
      <div className="divide-y divide-gray-200">
        <div className="flex items-center px-4 py-3 font-medium text-sm uppercase text-[#1E1E1E] bg-blue-200">
          <div className="flex-1 pl-4">Task</div>
          <div className="flex-1">Started Date</div>
          <div className="flex-1">Due Date</div>
          <div className="flex-1">Task Status</div>
          <div className="w-28">Actions</div>
        </div>
        {tasks.length === 0 ? (
          <div className="px-4 py-4 text-center text-md text-gray-500">
            No tasks available.
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center px-4 py-3 hover:bg-gray-100"
            >
              <div className="flex-1 pl-4 text-sm text-gray-900 font-medium">
                {task.title}
              </div>
              <div className="flex-1 text-sm text-gray-900">
                {dayjs(task.startedDate).format('MMM D, YYYY')}
              </div>
              <div className="flex-1 text-sm text-gray-900">
                {task.dueDateTime ? dayjs(task.dueDateTime).format('MMM D, YYYY, h:mm A') : 'N/A'}
              </div>
              <div className="flex-1 text-sm text-gray-900">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.status === 'done'
                      ? 'bg-green-100 text-green-800'
                      : task.status === 'on progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : task.status === 'overdue'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <div className="w-28 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(task)}
                  className="hover:bg-transparent"
                >
                  <FilePenLine className="h-4 w-4 text-chart-2" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(task.id)}
                  className="hover:bg-transparent"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}