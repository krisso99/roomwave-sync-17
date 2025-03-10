
import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
  showCompactFooter?: boolean;
}

export function DateRangePickerInline({
  dateRange,
  onDateRangeChange,
  className,
  showCompactFooter = true,
}: DateRangePickerProps) {
  const presentMonth = new Date();

  // Quick selection buttons
  const selectToday = () => {
    const today = new Date();
    onDateRangeChange({
      from: today,
      to: today,
    });
  };

  const selectThisWeek = () => {
    const today = new Date();
    const startOfWeek = today.getDate() - today.getDay();
    const from = new Date(today.setDate(startOfWeek));
    const to = addDays(from, 6);
    onDateRangeChange({ from, to });
  };

  const selectNextWeek = () => {
    const today = new Date();
    const startOfWeek = today.getDate() - today.getDay() + 7;
    const from = new Date(today.setDate(startOfWeek));
    const to = addDays(from, 6);
    onDateRangeChange({ from, to });
  };

  const selectThisMonth = () => {
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth(), 1);
    const to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    onDateRangeChange({ from, to });
  };

  const selectNextMonth = () => {
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const to = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    onDateRangeChange({ from, to });
  };

  const selectNext3Months = () => {
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth(), 1);
    const to = new Date(today.getFullYear(), today.getMonth() + 3, 0);
    onDateRangeChange({ from, to });
  };

  const selectCurrentYear = () => {
    const today = new Date();
    const from = new Date(today.getFullYear(), 0, 1);
    const to = new Date(today.getFullYear(), 11, 31);
    onDateRangeChange({ from, to });
  };

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={presentMonth}
        selected={dateRange}
        onSelect={onDateRangeChange}
        numberOfMonths={2}
        className="rounded-md border"
      />

      {showCompactFooter && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={selectToday}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={selectThisWeek}
          >
            This Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={selectNextWeek}
          >
            Next Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={selectThisMonth}
          >
            This Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={selectNextMonth}
          >
            Next Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={selectNext3Months}
          >
            Next 3 Months
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={selectCurrentYear}
          >
            This Year
          </Button>
        </div>
      )}
    </div>
  );
}
