"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/cn";
import {
  formatDateForDisplay,
  convertUTCToLocalForCalendar,
} from "@/utils/formats";
import { enUS } from "date-fns/locale";

export function DatePicker({
  date,
  setDate,
  placeholder = "Select date",
  height = "43px",
}) {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    setOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setDate(null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            `w-full justify-start text-left font-normal h-[${height}]`,
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDateForDisplay(date) : placeholder}
          {date && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="ml-auto h-5 w-5 p-0 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={convertUTCToLocalForCalendar(date)}
          onSelect={handleDateSelect}
          initialFocus
          locale={enUS}
        />
      </PopoverContent>
    </Popover>
  );
}
