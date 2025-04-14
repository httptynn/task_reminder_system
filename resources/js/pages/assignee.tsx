// import ErrorBoundary from '@/components/error-boundary';
// import { Button } from '@/components/ui/button';
// import { DatePicker } from '@/components/ui/date-picker'; // This is the updated CustomDatePicker with react-datepicker
// import { FileUpload } from '@/components/ui/file-upload';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem } from '@/types';
// import { Head } from '@inertiajs/react';
// import dayjs, { Dayjs } from 'dayjs';
// import { useState } from 'react';

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Assignee',
//         href: '/assignee',
//     },
// ];

// export default function Assignee() {
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [attachedFile, setAttachedFile] = useState<File | null>(null);
//     const [team, setTeam] = useState('');
//     const [assignee, setAssignee] = useState('');
//     const [dueDateTime, setDueDateTime] = useState<Dayjs | null>(dayjs('2025-04-13 10:51')); 

//     const handleFileSelect = (file: File | null) => {
//         setAttachedFile(file);
//     };

//     const handleDateTimeChange = (date: Date | null) => {
//         setDueDateTime(date ? dayjs(date) : null);
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         const formData = {
//             title,
//             description,
//             attachedFile,
//             team,
//             assignee,
//             dueDateTime: dueDateTime ? dueDateTime.toISOString() : null,
//         };
//         console.log(formData); // Replace with Inertia.post('/assignee', formData)
//     };

//     return (
//         <ErrorBoundary>
//             <AppLayout breadcrumbs={breadcrumbs}>
//                 <Head title="Assignee" />
//                 <form onSubmit={handleSubmit}>
//                     <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
//                         <div className="flex items-center justify-between">
//                             <h1 className="text-xl font-semibold">Assign Task</h1>
//                         </div>

//                         <div className="flex flex-col gap-4 p-4 md:flex-row">
//                             <div className="flex-1">
//                                 <div>
//                                     <label htmlFor="title" className="text-foreground text-sm font-medium">
//                                         Title
//                                     </label>
//                                     <Input
//                                         id="title"
//                                         placeholder="Organize Weekly Team Meeting"
//                                         value={title}
//                                         onChange={(e) => setTitle(e.target.value)}
//                                         className="mt-1 w-full"
//                                     />
//                                 </div>
//                                 <div className="mt-4">
//                                     <label htmlFor="description" className="text-foreground text-sm font-medium">
//                                         Description
//                                     </label>
//                                     <Textarea
//                                         id="description"
//                                         placeholder="Schedule and prepare for the weekly team meeting."
//                                         value={description}
//                                         onChange={(e) => setDescription(e.target.value)}
//                                         className="mt-1 min-h-[100px] w-full"
//                                     />
//                                 </div>
//                                 <div className="mt-4">
//                                     <label className="text-foreground text-sm font-medium">Attach File</label>
//                                     <FileUpload onFileSelect={handleFileSelect} />
//                                 </div>
//                             </div>
//                             <div className="flex flex-1 flex-col gap-4">
//                                 <div>
//                                     <label htmlFor="team" className="text-foreground text-sm font-medium">
//                                         Team Name (group task)
//                                     </label>
//                                     <Input
//                                         id="team"
//                                         placeholder="Enter team name"
//                                         value={team}
//                                         onChange={(e) => setTeam(e.target.value)}
//                                         className="mt-1 w-full"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="assignee" className="text-foreground text-sm font-medium">
//                                         Assignee
//                                     </label>
//                                     <Textarea
//                                         id="assignee"
//                                         placeholder="Enter assignee(s)"
//                                         value={assignee}
//                                         onChange={(e) => setAssignee(e.target.value)}
//                                         className="mt-1 min-h-[100px] w-full"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label id="due-date-time-label" htmlFor="due-date-time" className="text-foreground text-sm font-medium">
//                                         Due Date
//                                     </label>
//                                     <DatePicker
//                                         id="due-date-time"
//                                         value={dueDateTime ? dueDateTime.toDate() : null}
//                                         onChange={handleDateTimeChange}
//                                         className="mt-1 w-full"
//                                         nativeInputAriaLabel="Due Date and Time"
//                                         aria-labelledby="due-date-time-label"
//                                     />
//                                 </div>
//                                 <div className="flex justify-center">
//                                     <Button
//                                         className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm mt-1 w-1/2"
//                                         type="submit"
//                                     >
//                                         Send task
//                                     </Button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </form>
//             </AppLayout>
//         </ErrorBoundary>
//     );
// }

import ErrorBoundary from '@/components/error-boundary';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Assignee',
    href: '/assignee',
  },
];

export default function Assignee() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [team, setTeam] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDateTime, setDueDateTime] = useState<Dayjs | null>(dayjs('2025-01-16 22:30'));

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
    const formData = {
      title,
      description,
      attachedFile,
      team,
      assignee,
      dueDateTime: dueDateTime ? dueDateTime.toISOString() : null,
    };
    console.log(formData); // Replace with Inertia.post('/assignee', formData)
  };

  return (
    <ErrorBoundary>
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Assignee" />
        <form onSubmit={handleSubmit}>
          <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Assign Task</h1>
            </div>

            <div className="flex flex-col gap-4 p-4 md:flex-row">
              <div className="flex-1">
                <div>
                  <label htmlFor="title" className="text-foreground text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Organize Weekly Team Meeting"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full"
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor="description" className="text-foreground text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Schedule and prepare for the weekly team meeting."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 min-h-[100px] w-full"
                  />
                </div>
                <div className="mt-4">
                  <label className="text-foreground text-sm font-medium">Attach File</label>
                  <FileUpload onFileSelect={handleFileSelect} />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4">
                <div>
                  <label htmlFor="team" className="text-foreground text-sm font-medium">
                    Team Name (group task)
                  </label>
                  <Input
                    id="team"
                    placeholder="Enter team name"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    className="mt-1 w-full"
                  />
                </div>
                <div>
                  <label htmlFor="assignee" className="text-foreground text-sm font-medium">
                    Assignee
                  </label>
                  <Textarea
                    id="assignee"
                    placeholder="Enter assignee(s)"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="mt-1 min-h-[100px] w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <DatePicker
                    id="due-date"
                    value={dueDateTime ? dueDateTime.toDate() : null}
                    onChange={handleDateChange}
                    className="mt-1 w-full"
                    aria-labelledby="due-date-label"
                  />
                  <TimePicker
                    id="due-time"
                    value={dueDateTime ? dueDateTime.toDate() : null}
                    onChange={handleTimeChange}
                    className="mt-1 w-full"
                    aria-labelledby="due-time-label"
                  />
                </div>
                <div className="flex justify-center">
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm mt-1 w-1/2 h-10"
                    type="submit"
                  >
                    Send task
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </AppLayout>
    </ErrorBoundary>
  );
}