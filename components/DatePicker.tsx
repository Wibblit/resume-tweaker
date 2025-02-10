import * as React from "react";
import { format, getYear, setMonth, setYear, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const PRESENT_DATE = new Date(1970, 0, 1); // January 1, 1920

interface CustomDatePickerProps {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  allowPresent?: boolean;
}

export function CustomDatePicker({
  date,
  onSelect,
  allowPresent = true,
}: CustomDatePickerProps) {
  const isDatePresent = date && isValid(date) && date.getTime() === PRESENT_DATE.getTime();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date && isValid(date) ? date : undefined
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPresent, setIsPresent] = React.useState(isDatePresent);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const startYear = 1900;
  const endYear = currentYear + 100;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const [calendarDate, setCalendarDate] = React.useState<Date>(
    selectedDate && isValid(selectedDate) ? selectedDate : new Date()
  );

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate && isValid(newDate)) {
      setSelectedDate(newDate);
      setCalendarDate(newDate);
      onSelect(newDate);
      setIsPresent(false);
      setIsOpen(false);
    }
  };

  const handleMonthChange = (value: string) => {
    const newMonth = months.indexOf(value);
    const newDate = setMonth(calendarDate, newMonth);
    setCalendarDate(newDate);

    if (selectedDate && isValid(selectedDate)) {
      const updatedSelectedDate = setMonth(selectedDate, newMonth);
      if (isValid(updatedSelectedDate)) {
        setSelectedDate(updatedSelectedDate);
        onSelect(updatedSelectedDate);
      }
    }
  };

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value, 10);
    const newDate = setYear(calendarDate, newYear);
    setCalendarDate(newDate);

    if (selectedDate && isValid(selectedDate)) {
      const updatedSelectedDate = setYear(selectedDate, newYear);
      if (isValid(updatedSelectedDate)) {
        setSelectedDate(updatedSelectedDate);
        onSelect(updatedSelectedDate);
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(undefined);
    setIsPresent(false);
    onSelect(undefined);
    setIsOpen(false);
  };

  const handlePresentToggle = (checked: boolean) => {
    setIsPresent(checked);
    if (checked) {
      setSelectedDate(PRESENT_DATE);
      onSelect(PRESENT_DATE);
    } else {
      setSelectedDate(undefined);
      onSelect(undefined);
    }
  };

  const handleCalendarMonthChange = (month: Date) => {
    setCalendarDate(month);
  };

  const getDisplayDate = () => {
    if (!selectedDate) return "Pick a date";
    if (!isValid(selectedDate)) return "Invalid date";
    if (selectedDate.getTime() === PRESENT_DATE.getTime()) return "Present";
    return format(selectedDate, "PPP");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            "hover:bg-accent hover:text-accent-foreground",
            "transition-colors duration-200"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="flex-1">{getDisplayDate()}</span>
          {selectedDate && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-transparent"
              onClick={handleClear}
            >
              <span className="sr-only">Clear date</span>
              <span className="text-muted-foreground hover:text-foreground">
                ×
              </span>
            </Button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="space-y-4 p-3">
          {allowPresent && (
            <div className="flex items-center justify-between px-1">
              <label htmlFor="present-toggle" className="text-sm font-medium">
                Present
              </label>
              <Switch
                id="present-toggle"
                checked={isPresent}
                onCheckedChange={handlePresentToggle}
              />
            </div>
          )}
          <div className="flex gap-2">
            <Select
              value={months[calendarDate.getMonth()]}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent position="popper">
                {months.map((m) => (
                  <SelectItem
                    key={m}
                    value={m}
                    className="cursor-pointer hover:bg-accent"
                  >
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={calendarDate.getFullYear().toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent position="popper">
                {years.map((y) => (
                  <SelectItem
                    key={y}
                    value={y.toString()}
                    className="cursor-pointer hover:bg-accent"
                  >
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            month={calendarDate}
            onMonthChange={handleCalendarMonthChange}
            className="rounded-md border shadow"
            initialFocus
            disabled={isPresent}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}