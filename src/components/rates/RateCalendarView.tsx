import React, { useState, useEffect } from 'react';
import { format, eachDayOfInterval, isSameDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useRates, RoomType, DayOfWeek } from '@/contexts/RateContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RateCalendarViewProps {
  roomTypes: RoomType[];
  dateRange: DateRange | undefined;
  selectedChannel: string;
  onEditRate: (rate: any) => void;
}

const RateCalendarView: React.FC<RateCalendarViewProps> = ({
  roomTypes,
  dateRange,
  selectedChannel,
  onEditRate,
}) => {
  const { rateRules, channels, previewRate } = useRates();
  const [calendar, setCalendar] = useState<Date[]>([]);
  const [rateData, setRateData] = useState<Record<string, Record<string, any>>>({});
  const [loading, setLoading] = useState(true);

  // Helper to get color based on rate
  const getRateColor = (amount: number, baseRate: number) => {
    const ratio = amount / baseRate;

    if (ratio >= 1.5) return 'bg-red-100 text-red-800';
    if (ratio >= 1.2) return 'bg-orange-100 text-orange-800';
    if (ratio >= 1.05) return 'bg-yellow-100 text-yellow-800';
    if (ratio <= 0.8) return 'bg-green-100 text-green-800';
    if (ratio <= 0.95) return 'bg-emerald-100 text-emerald-800';
    return '';
  };

  // Generate calendar days from date range
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const days = eachDayOfInterval({
        start: dateRange.from,
        end: dateRange.to,
      });
      setCalendar(days);
    } else {
      setCalendar([]);
    }
  }, [dateRange]);

  // Load rate data for all rooms and dates
  useEffect(() => {
    const loadRateData = async () => {
      if (!calendar.length || !roomTypes.length) {
        setRateData({});
        setLoading(false);
        return;
      }

      setLoading(true);

      const data: Record<string, Record<string, any>> = {};

      for (const roomType of roomTypes) {
        data[roomType.id] = {};

        for (const date of calendar) {
          try {
            const result = await previewRate(roomType.id, date, selectedChannel);
            data[roomType.id][format(date, 'yyyy-MM-dd')] = result;
          } catch (error) {
            console.error(`Error loading rate for ${roomType.id} on ${format(date, 'yyyy-MM-dd')}:`, error);
            data[roomType.id][format(date, 'yyyy-MM-dd')] = { finalAmount: 0, baseAmount: 0, error: true };
          }
        }
      }

      setRateData(data);
      setLoading(false);
    };

    loadRateData();
  }, [calendar, roomTypes, selectedChannel, previewRate]);

  // Handle clicking on a rate cell
  const handleRateClick = (roomTypeId: string, date: string) => {
    const roomType = roomTypes.find(rt => rt.id === roomTypeId);
    if (!roomType) return;

    // Find any rate rules that apply to this date
    const dateObj = new Date(date);
    const applicableRules = rateRules.filter(rule => {
      // Must match room type
      if (rule.roomTypeId !== roomTypeId) return false;

      // Check date range if applicable
      if (rule.startDate && rule.endDate) {
        const ruleStart = new Date(rule.startDate);
        const ruleEnd = new Date(rule.endDate);
        if (dateObj < ruleStart || dateObj > ruleEnd) return false;
      }

      // Check day of week if applicable
      if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
        const dayIndex = dateObj.getDay();
        // Convert day index to DayOfWeek type
        const dayOfWeekMap: Record<number, DayOfWeek> = {
          0: 'sunday',
          1: 'monday',
          2: 'tuesday',
          3: 'wednesday',
          4: 'thursday',
          5: 'friday',
          6: 'saturday'
        };
        const dayOfWeek = dayOfWeekMap[dayIndex];
        if (!rule.daysOfWeek.includes(dayOfWeek)) return false;
      }

      // Check minimum stay if applicable
      if (rule.minimumStay && lengthOfStay && lengthOfStay < rule.minimumStay) return false;
      
      return true;
    });
    
    // Find the highest priority rule
    // Priority: special > seasonal > weekend/weekday > base
    let ruleToEdit: RateRule | undefined;
    
    // First check for special event rates
    ruleToEdit = applicableRules.find(rule => rule.type === 'special');
    
    // Then check for seasonal rates
    if (!ruleToEdit) {
      ruleToEdit = applicableRules.find(rule => rule.type === 'seasonal');
    }
    
    // Then check for day-specific rates (weekend/weekday)
    if (!ruleToEdit) {
      ruleToEdit = applicableRules.find(rule => 
        rule.type === 'base' && rule.daysOfWeek && rule.daysOfWeek.length > 0
      );
    }
    
    // Finally fall back to base rate
    if (!ruleToEdit) {
      ruleToEdit = applicableRules.find(rule => 
        rule.type === 'base' && (!rule.daysOfWeek || rule.daysOfWeek.length === 0)
      );
    }
    
    // Apply the rule
    if (ruleToEdit) {
      onEditRate(ruleToEdit);
    } else {
      // If no rule exists, create a new one
      const newRule = {
        name: `Rate for ${roomType.name} on ${format(dateObj, 'MMM d, yyyy')}`,
        type: 'base' as const,
        roomTypeId,
        amount: roomType.baseRate,
        currency: 'USD',
        startDate: dateObj,
        endDate: dateObj,
      };
      onEditRate(newRule);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (!calendar.length) {
    return (
      <div className="text-center py-8">
        Please select a date range to view the rate calendar.
      </div>
    );
  }

  if (!roomTypes.length) {
    return (
      <div className="text-center py-8">
        Please select at least one room type to view rates.
      </div>
    );
  }

  // Get the selected channel name
  const channelName = channels.find(c => c.id === selectedChannel)?.name || 'Direct';

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium">
          Showing rates for: <span className="text-primary">{channelName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-2 py-1 rounded bg-red-100 text-red-800">High</span>
          <span className="px-2 py-1 rounded bg-orange-100 text-orange-800">Above Average</span>
          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">Slightly Higher</span>
          <span className="px-2 py-1 rounded">Standard</span>
          <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800">Slightly Lower</span>
          <span className="px-2 py-1 rounded bg-green-100 text-green-800">Discounted</span>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="sticky left-0 bg-background z-20">Room Type</TableHead>
              {calendar.map(date => (
                <TableHead key={date.toString()} className="text-center min-w-[100px]">
                  <div className="flex flex-col">
                    <span className="font-bold">{format(date, 'EEE')}</span>
                    <span>{format(date, 'MMM d')}</span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {roomTypes.map(roomType => (
              <TableRow key={roomType.id}>
                <TableCell className="font-medium sticky left-0 bg-background z-10">
                  {roomType.name}
                </TableCell>
                {calendar.map(date => {
                  const dateKey = format(date, 'yyyy-MM-dd');
                  const rateInfo = rateData[roomType.id]?.[dateKey];
                  
                  if (!rateInfo) {
                    return (
                      <TableCell key={dateKey} className="text-center">
                        <Skeleton className="h-8 w-16 mx-auto" />
                      </TableCell>
                    );
                  }

                  const colorClass = getRateColor(rateInfo.finalAmount, roomType.baseRate);

                  return (
                    <TableCell 
                      key={dateKey} 
                      className={`text-center relative cursor-pointer hover:bg-muted transition-colors ${colorClass}`}
                      onClick={() => handleRateClick(roomType.id, dateKey)}
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-semibold">${rateInfo.finalAmount.toFixed(0)}</span>
                        {rateInfo.finalAmount !== rateInfo.baseAmount && (
                          <span className="text-xs text-muted-foreground">
                            Base: ${rateInfo.baseAmount.toFixed(0)}
                          </span>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRateClick(roomType.id, dateKey);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RateCalendarView;
