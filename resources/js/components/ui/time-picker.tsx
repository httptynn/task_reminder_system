import { cn } from "@/lib/utils";
import ReactDatePicker from "react-datepicker";
import { Clock } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { enUS } from "date-fns/locale/en-US";

// Register the locale
registerLocale("en-US", enUS);

interface TimePickerProps {
  value: Date | null;
  onChange: (time: Date | null) => void;
  className?: string;
  label?: string;
  id?: string;
  "aria-label"?: string; // Added for accessibility
  "aria-labelledby"?: string;
  [key: string]: any; // Allow additional props for react-datepicker
}

function TimePicker({
  className,
  value,
  onChange,
  label = "Due Time",
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}: TimePickerProps) {
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
        showTimeSelect
        showTimeSelectOnly
        timeFormat="hh:mm aa"
        timeIntervals={15}
        dateFormat="h:mm aa"
        placeholderText="Select time"
        locale="en-US"
        timeInputLabel="Time"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        {...rest}
      />
      <Clock className="h-4 w-4 text-muted-foreground absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

export { TimePicker };