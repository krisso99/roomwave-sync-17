
import React, { useState, useEffect } from 'react';
import { format, isEqual } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useRates, RoomType, Channel } from '@/contexts/RateContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Edit, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();
  
  const [selectedRoomType, setSelectedRoomType] = useState<string>(roomTypes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [ratePreviews, setRatePreviews] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [editingChannel, setEditingChannel] = useState<string | null>(null);
  const [editMarkupValue, setEditMarkupValue] = useState<string>('');
  const [markupIsPercentage, setMarkupIsPercentage] = useState(true);
  
  // Load rate previews for all channels
  useEffect(() => {
    const loadChannelRates = async () => {
      if (!selectedRoomType) return;
      
      setLoading(true);
      const previews: Record<string, number> = {};
      
      for (const channel of channels) {
        try {
          const result = await previewRate(selectedRoomType, selectedDate, channel.id);
          previews[channel.id] = result.finalAmount;
        } catch (error) {
          console.error(`Error loading preview for ${channel.id}:`, error);
          previews[channel.id] = 0;
        }
      }
      
      setRatePreviews(previews);
      setLoading(false);
    };
    
    loadChannelRates();
  }, [selectedRoomType, selectedDate, channels, previewRate]);
  
  // Set selected date when date range changes
  useEffect(() => {
    if (dateRange?.from) {
      setSelectedDate(dateRange.from);
    }
  }, [dateRange]);
  
  // Handle room type selection
  const handleRoomTypeChange = (roomTypeId: string) => {
    setSelectedRoomType(roomTypeId);
  };
  
  // Handle date selection
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };
  
  // Start editing a channel markup
  const startEditing = (channelId: string) => {
    const mapping = channelRateMappings.find(m => 
      m.channelId === channelId && 
      m.rateRuleId === `base-${selectedRoomType}`
    );
    
    setEditingChannel(channelId);
    setEditMarkupValue(mapping ? mapping.markup.toString() : '0');
    setMarkupIsPercentage(mapping ? mapping.isMarkupPercentage : true);
  };
  
  // Save channel markup changes
  const saveChannelMarkup = async (channelId: string) => {
    try {
      const markupValue = parseFloat(editMarkupValue);
      
      if (isNaN(markupValue)) {
        toast({
          title: "Invalid markup value",
          description: "Please enter a valid number for the markup.",
          variant: "destructive"
        });
        return;
      }
      
      // Find existing mapping
      const mappingId = channelRateMappings.find(m => 
        m.channelId === channelId && 
        m.rateRuleId === `base-${selectedRoomType}`
      )?.id;
      
      if (mappingId) {
        // Update existing mapping
        await updateChannelRateMapping(mappingId, {
          markup: markupValue,
          isMarkupPercentage: markupIsPercentage,
        });
      } else {
        // Create new mapping
        const channel = channels.find(c => c.id === channelId);
        
        if (!channel) {
          throw new Error(`Channel with ID ${channelId} not found`);
        }
        
        const newMapping = {
          id: `mapping-${Date.now()}`,
          channelId,
          channelName: channel.name,
          rateRuleId: `base-${selectedRoomType}`,
          markup: markupValue,
          isMarkupPercentage: markupIsPercentage,
          isEnabled: true,
          lastSynced: new Date(),
        };
        
        // In a real app, we'd create the mapping here
        console.log('New mapping would be created:', newMapping);
      }
      
      // Refresh rate previews
      const result = await previewRate(selectedRoomType, selectedDate, channelId);
      setRatePreviews(prev => ({
        ...prev,
        [channelId]: result.finalAmount,
      }));
      
      // Reset editing state
      setEditingChannel(null);
      
      toast({
        title: "Channel rate updated",
        description: "The markup has been successfully updated."
      });
    } catch (error) {
      console.error('Error saving channel markup:', error);
      toast({
        title: "Error updating rate",
        description: "An error occurred while updating the channel rate.",
        variant: "destructive"
      });
    }
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditingChannel(null);
  };
  
  // Check rate parity issues
  const hasParityIssues = () => {
    if (Object.keys(ratePreviews).length < 2) return false;
    
    const rates = Object.values(ratePreviews);
    const minRate = Math.min(...rates);
    const maxRate = Math.max(...rates);
    
    return maxRate > minRate * 1.02; // More than 2% variation
  };
  
  // Get the room type
  const selectedRoomTypeObj = roomTypes.find(rt => rt.id === selectedRoomType);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 md:items-end">
        <div className="flex-1 space-y-2">
          <Label>Room Type</Label>
          <div className="flex flex-wrap gap-2">
            {roomTypes.map(roomType => (
              <Button
                key={roomType.id}
                variant={selectedRoomType === roomType.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleRoomTypeChange(roomType.id)}
              >
                {roomType.name}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 space-y-2">
          <Label>Date</Label>
          <div className="flex flex-wrap gap-2">
            {dateRange?.from && dateRange?.to && (
              Array.from({ length: Math.min(7, Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / (24 * 60 * 60 * 1000))) }, (_, i) => {
                const date = new Date(dateRange.from);
                date.setDate(date.getDate() + i);
                return (
                  <Button
                    key={i}
                    variant={isEqual(selectedDate, date) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleDateChange(date)}
                  >
                    {format(date, 'MMM d')}
                  </Button>
                );
              })
            )}
          </div>
        </div>
      </div>
      
      {hasParityIssues() && (
        <div className="flex items-center gap-2 p-3 border border-yellow-200 bg-yellow-50 rounded-md text-yellow-800">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div className="text-sm">
            <strong>Rate parity issue detected:</strong> There is a significant difference in rates between channels.
            This may violate rate parity agreements with some OTAs.
          </div>
        </div>
      )}
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Channel</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Markup</TableHead>
              <TableHead>Final Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {channels.map(channel => {
              // Check if a mapping exists for this channel + room type combo
              const mapping = channelRateMappings.find(m => 
                m.channelId === channel.id && 
                m.rateRuleId === `base-${selectedRoomType}`
              );
              
              const isEditing = editingChannel === channel.id;
              
              return (
                <TableRow key={channel.id}>
                  <TableCell className="font-medium">{channel.name}</TableCell>
                  <TableCell>{channel.commission}%</TableCell>
                  <TableCell>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          value={editMarkupValue}
                          onChange={e => setEditMarkupValue(e.target.value)}
                          className="w-20"
                        />
                        <div className="flex items-center gap-1">
                          <Switch 
                            checked={markupIsPercentage}
                            onCheckedChange={setMarkupIsPercentage}
                          />
                          <span className="text-sm">%</span>
                        </div>
                      </div>
                    ) : (
                      mapping ? (
                        <span>
                          {mapping.markup}{mapping.isMarkupPercentage ? '%' : ' $'}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Default</span>
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    {loading ? (
                      <Skeleton className="h-6 w-16" />
                    ) : (
                      <span className="font-semibold">
                        ${ratePreviews[channel.id]?.toFixed(2) || '0.00'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {mapping ? (
                      mapping.isEnabled ? (
                        <div className="flex items-center text-green-600 gap-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Active</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Disabled</span>
                      )
                    ) : (
                      <span className="text-muted-foreground">Not configured</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => saveChannelMarkup(channel.id)}
                        >
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={cancelEditing}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => startEditing(channel.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ChannelRatesTable;
