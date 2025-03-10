
import React from 'react';
import { DateRange } from 'react-day-picker';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { RoomType, RateRule } from '@/contexts/RateContext';
import RateCalendarView from '@/components/rates/RateCalendarView';

interface CalendarTabContentProps {
  roomTypes: RoomType[];
  dateRange: DateRange | undefined;
  selectedChannel: string;
  onEditRate: (rate: RateRule) => void;
}

const CalendarTabContent: React.FC<CalendarTabContentProps> = ({
  roomTypes,
  dateRange,
  selectedChannel,
  onEditRate,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate Calendar</CardTitle>
        <CardDescription>
          Visual calendar view of rates for selected room types
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RateCalendarView
          roomTypes={roomTypes}
          dateRange={dateRange}
          selectedChannel={selectedChannel}
          onEditRate={onEditRate}
        />
      </CardContent>
    </Card>
  );
};

export default CalendarTabContent;
