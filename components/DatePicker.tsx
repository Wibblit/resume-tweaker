<<<<<<< HEAD
// "use client";

// import * as React from "react";
// import { CalendarIcon } from "lucide-react";
// import { format } from "date-fns";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// interface DatePickerProps {
//   placeholder: string;
//   date: Date | undefined;
//   setDate: (date: Date | undefined) => void;
// }

// export const DatePicker: React.FC<DatePickerProps> = ({
//   placeholder,
//   date,
//   setDate,
// }) => {
//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button
//           variant={"outline"}
//           className={cn(
//             "w-full justify-start text-left font-normal",
//             !date && "text-muted-foreground"
//           )}
//         >
//           <CalendarIcon className="mr-2 h-4 w-4" />
//           {date ? format(date, "PPP") : <span>{placeholder}</span>}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-auto p-0" align="start">
//         <Calendar
//           mode="single"
//           selected={date}
//           onSelect={setDate}
//           initialFocus
//         />
//       </PopoverContent>
//     </Popover>
//   );
// };


"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
=======
"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

>>>>>>> caaaa7a (landing page hero section update)
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

<<<<<<< HEAD
interface CustomDatePickerProps {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

export function CustomDatePicker({ date, onSelect }: CustomDatePickerProps) {
=======
interface DatePickerProps {
  placeholder: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  placeholder,
  date,
  setDate,
}) => {
>>>>>>> caaaa7a (landing page hero section update)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
<<<<<<< HEAD
          {date ? format(date, "dd, MMM ''yy") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
=======
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
>>>>>>> caaaa7a (landing page hero section update)
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
<<<<<<< HEAD
}
=======
};
>>>>>>> caaaa7a (landing page hero section update)
