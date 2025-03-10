
import React, { useState, useEffect } from 'react';
import { format, eachDayOfInterval, isEqual, addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { RoomType, Channel, useRates } from '@/contexts/RateContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertTriangle, Edit, Percent, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

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
  const { previewRate, updateChannelRateMapping, channelRateMappings } = useRates();
  const [selectedRoomType, setSelectedRoomType] = useState<string>(roomTypes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(dateRange?.from || new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [rateData, setRateData] = useState<Record<string, { finalAmount: number; baseAmount: number; parity: boolean }>>({});
  const [editMode, setEditMode] = useState<{ channelId: string; markup: number; isPercentage: boolean } | null>(null);
  
  // Load rate data for selected room type and date
  useEffect(() => {
    const loadRateData = async () => {
      if (!selectedRoomType || !selectedDate) return;
      
      setIsLoading(true);
      
      try {
        const data: Record<string, { finalAmount: number; baseAmount: number; parity: boolean }> = {};
        
        // Get direct channel rate as baseline
        const directRate = await previewRate(selectedRoomType, selectedDate, '1');
        data['1'] = { ...directRate, parity: true };
        
        // Get rates for other channels
        for (const channel of channels) {
          if (channel.id === '1') continue; // Skip direct channel
          
          const channelRate = await previewRate(selectedRoomType, selectedDate, channel.id);
          
          // Check rate parity
          const parity = Math.abs(channelRate.finalAmount - directRate.finalAmount) < 0.01;
          
          data[channel.id] = {
            ...channelRate,
            parity,
          };
        }
        
        setRateData(data);
      } catch (error) {
        console.error('Error loading channel rates:', error);
        toast({
          title: 'Error',
          description: 'Failed to load channel rates',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRateData();
  }, [selectedRoomType, selectedDate, channels, previewRate]);
  
  // Handle room type change
  const handleRoomTypeChange = (value: string) => {
    setSelectedRoomType(value);
  };
  
  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  
  // Start editing a channel markup
  const handleStartEdit = (channelId: string) => {
    const mapping = channelRateMappings.find(
      m => m.channelId === channelId && 
      m.rateRuleId.includes(selectedRoomType)
    );
    
    setEditMode({
      channelId,
      markup: mapping?.markup || 0,
      isPercentage: mapping?.isMarkupPercentage !== false,
    });
  };
  
  // Save channel markup
  const handleSaveMarkup = async () => {
    if (!editMode) return;
    
    try {
      const { channelId, markup, isPercentage } = editMode;
      
      // Find existing mapping or create new mapping ID
      const existingMapping = channelRateMappings.find(
        m => m.channelId === channelId && 
        m.rateRuleId.includes(selectedRoomType)
      );
      
      const mappingId = existingMapping?.id || `${selectedRoomType}-${channelId}-${Date.now()}`;
      
      await updateChannelRateMapping(mappingId, {
        channelId,
        channelName: channels.find(c => c.id === channelId)?.name || 'Unknown',
        rateRuleId: selectedRoomType,
        markup,
        isMarkupPercentage: isPercentage,
        isEnabled: true,
        lastSynced: new Date(),
      });
      
      // Reset edit mode
      setEditMode(null);
      
      // Reload rates
      const updatedData = { ...rateData };
      const directRate = updatedData['1'];
      
      // Update the rate for this channel
      const channelRate = await previewRate(selectedRoomType, selectedDate as Date, channelId);
      const parity = Math.abs(channelRate.finalAmount - directRate.finalAmount) < 0.01;
      
      updatedData[channelId] = {
        ...channelRate,
        parity,
      };
      
      setRateData(updatedData);
      
      toast({
        title: 'Markup updated',
        description: 'Channel rates have been updated successfully',
      });
    } catch (error) {
      console.error('Error updating channel markup:', error);
      toast({
        title: 'Error',
        description: 'Failed to update channel markup',
        variant: 'destructive',
      });
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditMode(null);
  };
  
  // Room type object
  const roomType = roomTypes.find(rt => rt.id === selectedRoomType);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="room-type">Room Type</Label>
          <Select
            value={selectedRoomType}
            onValueChange={handleRoomTypeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a room type" />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map(rt => (
                <SelectItem key={rt.id} value={rt.id}>{rt.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                id="date"
              >
                {selectedDate ? (
                  format(selectedDate, 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3">
                <div className="space-y-2">
                  <h4 className="font-medium">Navigate to date</h4>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDateChange(new Date())}
                    >
                      Today
                    </Button>
                    {dateRange?.from && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDateChange(dateRange.from)}
                      >
                        Start Date
                      </Button>
                    )}
                    {dateRange?.to && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDateChange(dateRange.to)}
                      >
                        End Date
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => selectedDate && handleDateChange(addDays(selectedDate, -1))}
                    className="mr-1"
                  >
                    Prev
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => selectedDate && handleDateChange(addDays(selectedDate, 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Channel</TableHead>
              <TableHead>Base Rate</TableHead>
              <TableHead>Markup</TableHead>
              <TableHead>Final Rate</TableHead>
              <TableHead>Parity</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex justify-center py-4">
                    <Skeleton className="h-8 w-full max-w-md" />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              channels.map(channel => {
                const data = rateData[channel.id];
                const isDirectChannel = channel.id === '1';
                const isEditing = editMode?.channelId === channel.id;
                
                // Find the channel mapping for this room and channel
                const mapping = channelRateMappings.find(
                  m => m.channelId === channel.id && 
                  m.rateRuleId.includes(selectedRoomType)
                );
                
                return (
                  <TableRow key={channel.id}>
                    <TableCell>
                      <div className="font-medium">{channel.name}</div>
                      {!isDirectChannel && (
                        <div className="text-xs text-muted-foreground">
                          Commission: {channel.commission}%
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      ${data?.baseAmount.toFixed(2) || '-'}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={editMode.markup}
                            onChange={e => setEditMode({
                              ...editMode,
                              markup: parseFloat(e.target.value) || 0,
                            })}
                            className="w-20"
                          />
                          <Select
                            value={editMode.isPercentage ? 'percentage' : 'fixed'}
                            onValueChange={value => setEditMode({
                              ...editMode,
                              isPercentage: value === 'percentage',
                            })}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">%</SelectItem>
                              <SelectItem value="fixed">$</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <>
                          {isDirectChannel ? (
                            <span className="text-muted-foreground">N/A</span>
                          ) : (
                            mapping ? (
                              <span>
                                {mapping.markup}{mapping.isMarkupPercentage ? '%' : '$'}
                              </span>
                            ) : (
                              <span>Default ({channel.commission}%)</span>
                            )
                          )}
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      ${data?.finalAmount.toFixed(2) || '-'}
                    </TableCell>
                    <TableCell>
                      {isDirectChannel ? (
                        <Badge variant="outline">Base</Badge>
                      ) : (
                        data?.parity ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Check className="h-3 w-3 mr-1" /> Parity
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Disparity
                          </Badge>
                        )
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <div className="flex space-x-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={handleSaveMarkup}
                          >
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        !isDirectChannel && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleStartEdit(channel.id)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        )
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="bg-muted rounded-md p-4">
        <h3 className="text-sm font-medium mb-2">About Channel Rates</h3>
        <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
          <li>Direct channel is your base rate without markups or commissions</li>
          <li>Other channels can have custom markups (fixed amount or percentage)</li>
          <li>Default markup is based on the channel's standard commission rate</li>
          <li>Rate parity means prices are consistent across channels</li>
        </ul>
      </div>
    </div>
  );
};

export default ChannelRatesTable;
