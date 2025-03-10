
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { RoomType, Channel, useRates } from '@/contexts/RateContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, ExternalLink, Check, X, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface ChannelRatesTableProps {
  roomTypes: RoomType[];
  channels: Channel[];
  dateRange: DateRange | undefined;
}

const ChannelRatesTable: React.FC<ChannelRatesTableProps> = ({
  roomTypes,
  channels,
  dateRange,
}) => {
  const { channelRateMappings, updateChannelRateMapping, previewRate } = useRates();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editMapping, setEditMapping] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ markup: number; isMarkupPercentage: boolean }>({
    markup: 0,
    isMarkupPercentage: true,
  });
  const [rateData, setRateData] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(true);
  
  // Set selected date to the start of date range if available
  useEffect(() => {
    if (dateRange?.from) {
      setSelectedDate(dateRange.from);
    }
  }, [dateRange]);
  
  // Load rate data for the selected date
  useEffect(() => {
    const loadRateData = async () => {
      if (!roomTypes.length || !channels.length) {
        setRateData({});
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      const data: Record<string, Record<string, number>> = {};
      
      for (const roomType of roomTypes) {
        data[roomType.id] = {};
        
        for (const channel of channels) {
          try {
            const result = await previewRate(roomType.id, selectedDate, channel.id);
            data[roomType.id][channel.id] = result.finalAmount;
          } catch (error) {
            console.error(`Error loading rate for ${roomType.id} on channel ${channel.id}:`, error);
            data[roomType.id][channel.id] = 0;
          }
        }
      }
      
      setRateData(data);
      setLoading(false);
    };
    
    loadRateData();
  }, [roomTypes, channels, selectedDate, previewRate]);
  
  const handleDateChange = (date: string) => {
    setSelectedDate(new Date(date));
  };
  
  const startEditing = (mapping: any) => {
    setEditMapping(mapping.id);
    setEditValues({
      markup: mapping.markup,
      isMarkupPercentage: mapping.isMarkupPercentage,
    });
  };
  
  const cancelEditing = () => {
    setEditMapping(null);
  };
  
  const saveEditing = async (mappingId: string) => {
    try {
      await updateChannelRateMapping(mappingId, editValues);
      setEditMapping(null);
      toast({
        title: 'Channel rate updated',
        description: 'The rate adjustment has been saved.',
      });
    } catch (error) {
      console.error('Error updating channel rate:', error);
      toast({
        title: 'Update failed',
        description: 'There was an error updating the channel rate.',
        variant: 'destructive',
      });
    }
  };
  
  // Generate available dates from dateRange
  const availableDates = () => {
    if (!dateRange?.from || !dateRange?.to) {
      return [new Date()];
    }
    
    const dates: Date[] = [];
    let currentDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };
  
  // Check if there's a rate parity issue
  const checkRateParity = (roomTypeId: string) => {
    if (!rateData[roomTypeId]) return false;
    
    const rates = Object.values(rateData[roomTypeId]);
    const validRates = rates.filter(rate => rate > 0);
    
    if (validRates.length <= 1) return false;
    
    const minRate = Math.min(...validRates);
    const maxRate = Math.max(...validRates);
    
    // If rates differ by more than 2%, flag it
    return maxRate > minRate * 1.02;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full md:w-auto">
          <label className="text-sm font-medium">Select Date</label>
          <Select 
            value={selectedDate.toISOString().split('T')[0]}
            onValueChange={handleDateChange}
          >
            <SelectTrigger className="w-full md:w-[240px]">
              <SelectValue placeholder="Select date" />
            </SelectTrigger>
            <SelectContent>
              {availableDates().map(date => (
                <SelectItem key={date.toISOString()} value={date.toISOString().split('T')[0]}>
                  {format(date, 'EEEE, MMM d, yyyy')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Room Type</TableHead>
                {channels.map(channel => (
                  <TableHead key={channel.id} className="text-center min-w-[160px]">
                    {channel.name}
                    {channel.commission > 0 && (
                      <span className="block text-xs font-normal">
                        ({channel.commission}% commission)
                      </span>
                    )}
                  </TableHead>
                ))}
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roomTypes.map(roomType => (
                <TableRow key={roomType.id}>
                  <TableCell className="font-medium">
                    {roomType.name}
                    <div className="text-xs text-muted-foreground">
                      Base: ${roomType.baseRate}
                    </div>
                  </TableCell>
                  
                  {channels.map(channel => {
                    const rate = rateData[roomType.id]?.[channel.id] || 0;
                    const mapping = channelRateMappings.find(
                      m => m.rateRuleId.includes(roomType.id) && m.channelId === channel.id
                    );
                    
                    return (
                      <TableCell key={channel.id} className="text-center">
                        {rate > 0 ? (
                          <div className="font-semibold">${rate.toFixed(2)}</div>
                        ) : (
                          <div className="text-muted-foreground">N/A</div>
                        )}
                        
                        {mapping && (
                          <div className="mt-2">
                            {editMapping === mapping.id ? (
                              <div className="flex flex-col gap-2">
                                <div className="flex gap-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    step={editValues.isMarkupPercentage ? '1' : '0.01'}
                                    value={editValues.markup}
                                    onChange={(e) => setEditValues({
                                      ...editValues,
                                      markup: parseFloat(e.target.value),
                                    })}
                                    className="w-20 h-8 text-xs"
                                  />
                                  <Select
                                    value={editValues.isMarkupPercentage ? 'percent' : 'fixed'}
                                    onValueChange={(v) => setEditValues({
                                      ...editValues,
                                      isMarkupPercentage: v === 'percent',
                                    })}
                                  >
                                    <SelectTrigger className="w-20 h-8 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="percent">%</SelectItem>
                                      <SelectItem value="fixed">$</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex justify-center gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7"
                                    onClick={() => saveEditing(mapping.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7"
                                    onClick={cancelEditing}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-xs space-y-1">
                                <Badge variant="outline" className="font-normal">
                                  {mapping.isMarkupPercentage
                                    ? `+${mapping.markup}%`
                                    : `+$${mapping.markup}`}
                                </Badge>
                                <div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2"
                                    onClick={() => startEditing(mapping)}
                                  >
                                    <Edit className="h-3 w-3 mr-1" />
                                    <span className="text-xs">Edit</span>
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                  
                  <TableCell className="text-center">
                    {checkRateParity(roomType.id) ? (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Parity Issue
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-emerald-600 bg-emerald-50">
                        In Parity
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <div className="text-sm text-muted-foreground">
        <p>
          <span className="font-semibold">Note:</span> Channel rates shown are the final rates that will be displayed to guests on each platform.
        </p>
      </div>
    </div>
  );
};

export default ChannelRatesTable;
