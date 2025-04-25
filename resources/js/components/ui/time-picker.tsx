import { cn } from "@/lib/utils";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { enUS } from "date-fns/locale/en-US";

// Register the locale
registerLocale("en-US", enUS);

interface TimePickerProps {
  value: Date;
  onChange: (time: Date, event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> | undefined) => void;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  [key: string]: any;
}

function TimePicker({
  className,
  value,
  onChange,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}: TimePickerProps) {
  const handleChange = (time: Date | null, event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> | undefined) => {
    console.log('TimePicker onChange:', time);
    // Since isClearable={false}, time should never be null, but TypeScript requires handling it
    if (time) {
      onChange(time, event);
    }
  };

  return (
    <div className="relative w-full">
      <ReactDatePicker
        id={id}
        selected={value}
        onChange={handleChange}
        className={cn(
          "border-input placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm box-border px-3",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        wrapperClassName="w-full"
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
        isClearable={false}
        {...rest}
      />
    </div>
  );
}

export { TimePicker };