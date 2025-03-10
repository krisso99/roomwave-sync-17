
import React from 'react';
import { DateRange } from 'react-day-picker';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { RoomType, Channel } from '@/contexts/RateContext';
import ChannelRatesTable from '@/components/rates/ChannelRatesTable';

interface ChannelRatesTabContentProps {
  roomTypes: RoomType[];
  channels: Channel[];
  dateRange: DateRange | undefined;
}

const ChannelRatesTabContent: React.FC<ChannelRatesTabContentProps> = ({
  roomTypes,
  channels,
  dateRange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Channel Rates</CardTitle>
        <CardDescription>
          Manage rates across different distribution channels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChannelRatesTable
          roomTypes={roomTypes}
          channels={channels}
          dateRange={dateRange}
        />
      </CardContent>
    </Card>
  );
};

export default ChannelRatesTabContent;
