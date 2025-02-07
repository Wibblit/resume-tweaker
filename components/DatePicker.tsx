import * as React from "react"
import { format, getYear, setMonth, setYear, isValid } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CustomDatePickerProps {
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
}

export function CustomDatePicker({ date, onSelect }: CustomDatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date && isValid(date) ? date : undefined
  )
  const [isOpen, setIsOpen] = React.useState(false)

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const currentYear = new Date().getFullYear()
  const startYear = 1900
  const endYear = currentYear + 100
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  )

  const [month, setCurrentMonth] = React.useState(
    selectedDate ? selectedDate.getMonth() : new Date().getMonth()
  )
  const [year, setCurrentYear] = React.useState(
    selectedDate ? getYear(selectedDate) : currentYear
  )

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate && isValid(newDate)) {
      setSelectedDate(newDate)
      setCurrentMonth(newDate.getMonth())
      setCurrentYear(getYear(newDate))
      onSelect(newDate)
      setIsOpen(false)
    }
  }

  const handleMonthChange = (value: string) => {
    const newMonth = months.indexOf(value)
    setCurrentMonth(newMonth)
    if (selectedDate && isValid(selectedDate)) {
      const newDate = setMonth(selectedDate, newMonth)
      if (isValid(newDate)) {
        setSelectedDate(newDate)
        onSelect(newDate)
      }
    }
  }

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value, 10)
    setCurrentYear(newYear)
    if (selectedDate && isValid(selectedDate)) {
      const newDate = setYear(selectedDate, newYear)
      if (isValid(newDate)) {
        setSelectedDate(newDate)
        onSelect(newDate)
      }
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedDate(undefined)
    onSelect(undefined)
    setIsOpen(false)
  }

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
          {selectedDate ? (
            <span className="flex-1">{format(selectedDate, "PPP")}</span>
          ) : (
            <span>Pick a date</span>
          )}
          {selectedDate && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-transparent"
              onClick={handleClear}
            >
              <span className="sr-only">Clear date</span>
              <span className="text-muted-foreground hover:text-foreground">×</span>
            </Button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="space-y-4 p-3">
          <div className="flex gap-2">
            <Select value={months[month]} onValueChange={handleMonthChange}>
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
            <Select value={year.toString()} onValueChange={handleYearChange}>
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
            month={new Date(year, month)}
            className="rounded-md border shadow"
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}