
import React from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DateRangePickerInline } from '@/components/ui/date-range-picker-inline';

interface DateRangeFilterCardProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

const DateRangeFilterCard: React.FC<DateRangeFilterCardProps> = ({
  dateRange,
  onDateRangeChange,
}) => {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Date Range</CardTitle>
        <CardDescription>
          Select a date range for rate management
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <span className="font-medium">From:</span>
            <span>
              {dateRange?.from ? format(dateRange.from, 'PPP') : 'Select start date'}
            </span>
            <span className="font-medium ml-4">To:</span>
            <span>
              {dateRange?.to ? format(dateRange.to, 'PPP') : 'Select end date'}
            </span>
          </div>
          
          <DateRangePickerInline
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DateRangeFilterCard;
