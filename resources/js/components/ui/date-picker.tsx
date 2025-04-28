// import * as React from "react";
// import { cn } from "@/lib/utils";
// import DatePicker from "react-datepicker";
// import { Notificationtion, Clock } from "lucide-react";
// import "react-datepicker/dist/react-datepicker.css";
// // Import the en-US locale from date-fns
// import { registerLocale } from "react-datepicker";
// import {enUS} from "date-fns/locale/en-US";

// // Register the locale
// registerLocale("en-US", enUS);

// interface DatePickerProps {
//   value: Date | null;
//   onChange: (date: Date | null) => void;
//   className?: string;
//   label?: string;
//   id?: string;
//   nativeInputAriaLabel?: string;
//   "aria-labelledby"?: string;
// }

// function CustomDatePicker({
//   className,
//   value,
//   onChange,
//   label,
//   id,
//   nativeInputAriaLabel,
//   "aria-labelledby": ariaLabelledBy,
// }: DatePickerProps) {
//   return (
//     <div className="relative">
//       <DatePicker
//         id={id}
//         selected={value}
//         onChange={(date: Date | null) => onChange(date)}
//         className={cn(
//           "border-input placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//           "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
//           "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
//           className
//         )}
//         showTimeSelect
//         timeFormat="hh:mm aa"
//         timeIntervals={15}
//         dateFormat="MM/dd/yyyy h:mm aa"
//         placeholderText="Select date and time"
//         locale="en-US" // This now works because the locale is registered
//         ariaLabelledBy={ariaLabelledBy}
//       />
//       <Notification className="h-4 w-4 text-muted-foreground absolute right-8 top-1/2 transform -translate-y-1/2 pointer-events-none" />
//       <Clock className="h-4 w-4 text-muted-foreground absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
//     </div>
//   );
// }

// export { CustomDatePicker as DatePicker };


import { cn } from "@/lib/utils";
import ReactDatePicker from "react-datepicker";
import { Notification } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { enUS } from "date-fns/locale/en-US";

// Register the locale
registerLocale("en-US", enUS);

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  label?: string;
  id?: string;
  "aria-label"?: string; // Added for accessibility
  "aria-labelledby"?: string;
  [key: string]: any; // Allow additional props for react-datepicker
}

function DatePicker({
  className,
  value,
  onChange,
  label = "Due Date",
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}: DatePickerProps) {
  return (
    <div className="relative">
      <label htmlFor={id} className="text-foreground text-sm font-medium">
        {label}
      </label>
      <ReactDatePicker
        id={id}
        selected={value}
        onChange={onChange}
        className={cn(
          "border-input placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pr-10",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        dateFormat="MM/dd/yyyy"
        placeholderText="Select date"
        locale="en-US"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        {...rest}
      />
      <Notification className="h-4 w-4 text-muted-foreground absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

export { DatePicker };