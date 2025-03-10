
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Copy } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useRates, RoomType } from '@/contexts/RateContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface BulkRateUpdateProps {
  roomTypes: RoomType[];
  selectedRoomTypes: string[];
  dateRange: DateRange | undefined;
  onComplete: () => void;
  onCancel: () => void;
}

const BulkRateUpdate: React.FC<BulkRateUpdateProps> = ({
  roomTypes,
  selectedRoomTypes,
  dateRange,
  onComplete,
  onCancel,
}) => {
  const { bulkUpdateRates, copyRates } = useRates();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('update');
  const [updateAmount, setUpdateAmount] = useState('10');
  const [isPercentage, setIsPercentage] = useState(true);
  const [updateRoomTypes, setUpdateRoomTypes] = useState<string[]>(selectedRoomTypes);
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(dateRange);
  
  // Copy rates specific state
  const [sourceRoomType, setSourceRoomType] = useState<string>(roomTypes[0]?.id || '');
  const [targetRoomTypes, setTargetRoomTypes] = useState<string[]>([]);
  const [copyDateRange, setCopyDateRange] = useState<DateRange | undefined>(dateRange);
  
  // Toggle room type selection for updates
  const handleRoomTypeToggle = (roomTypeId: string) => {
    setUpdateRoomTypes(prev => {
      if (prev.includes(roomTypeId)) {
        return prev.filter(id => id !== roomTypeId);
      } else {
        return [...prev, roomTypeId];
      }
    });
  };
  
  // Toggle target room type selection for copy
  const handleTargetRoomTypeToggle = (roomTypeId: string) => {
    setTargetRoomTypes(prev => {
      if (prev.includes(roomTypeId)) {
        return prev.filter(id => id !== roomTypeId);
      } else {
        return [...prev, roomTypeId];
      }
    });
  };
  
  // Handle bulk update submission
  const handleBulkUpdate = async () => {
    if (!localDateRange?.from || !localDateRange?.to) {
      toast({
        title: "Missing date range",
        description: "Please select a date range for the bulk update.",
        variant: "destructive"
      });
      return;
    }
    
    if (updateRoomTypes.length === 0) {
      toast({
        title: "No room types selected",
        description: "Please select at least one room type to update.",
        variant: "destructive"
      });
      return;
    }
    
    const amount = parseFloat(updateAmount);
    
    if (isNaN(amount)) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid number for the update amount.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const updatedCount = await bulkUpdateRates(
        updateRoomTypes,
        { start: localDateRange.from, end: localDateRange.to },
        amount,
        isPercentage
      );
      
      toast({
        title: "Bulk update successful",
        description: `Updated rates for ${updatedCount} rules.`,
      });
      
      onComplete();
    } catch (error) {
      console.error('Error performing bulk update:', error);
      toast({
        title: "Error updating rates",
        description: "An error occurred during the bulk update operation.",
        variant: "destructive"
      });
    }
  };
  
  // Handle copy rates submission
  const handleCopyRates = async () => {
    if (!copyDateRange?.from || !copyDateRange?.to) {
      toast({
        title: "Missing date range",
        description: "Please select a date range for copying rates.",
        variant: "destructive"
      });
      return;
    }
    
    if (!sourceRoomType) {
      toast({
        title: "No source room type",
        description: "Please select a source room type to copy rates from.",
        variant: "destructive"
      });
      return;
    }
    
    if (targetRoomTypes.length === 0) {
      toast({
        title: "No target room types",
        description: "Please select at least one target room type to copy rates to.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const copiedCount = await copyRates(
        sourceRoomType,
        targetRoomTypes,
        { start: copyDateRange.from, end: copyDateRange.to }
      );
      
      toast({
        title: "Copy operation successful",
        description: `Copied ${copiedCount} rate rules to ${targetRoomTypes.length} room types.`,
      });
      
      onComplete();
    } catch (error) {
      console.error('Error copying rates:', error);
      toast({
        title: "Error copying rates",
        description: "An error occurred during the copy operation.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="update">Bulk Update</TabsTrigger>
          <TabsTrigger value="copy">Copy Rates</TabsTrigger>
        </TabsList>
        
        {/* Bulk Update Tab */}
        <TabsContent value="update" className="space-y-4">
          <div className="space-y-2">
            <Label>Update Method</Label>
            <RadioGroup 
              defaultValue={isPercentage ? "percentage" : "fixed"} 
              onValueChange={(v) => setIsPercentage(v === "percentage")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage">Percentage adjustment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed">Fixed amount adjustment</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex items-center">
              {isPercentage && <span className="mr-2">%</span>}
              {!isPercentage && <span className="mr-2">$</span>}
              <Input 
                id="amount"
                type="number" 
                value={updateAmount}
                onChange={(e) => setUpdateAmount(e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {isPercentage 
                ? 'Use negative values (e.g., -10) to decrease rates' 
                : 'Use negative values (e.g., -5.50) to decrease rates'}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Room Types</Label>
            <div className="border rounded-md p-4 max-h-[150px] overflow-y-auto grid grid-cols-2 gap-2">
              {roomTypes.map((roomType) => (
                <div key={roomType.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`update-${roomType.id}`}
                    checked={updateRoomTypes.includes(roomType.id)}
                    onCheckedChange={() => handleRoomTypeToggle(roomType.id)}
                  />
                  <Label htmlFor={`update-${roomType.id}`} className="cursor-pointer">
                    {roomType.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !localDateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {localDateRange?.from ? (
                    localDateRange.to ? (
                      <>
                        {format(localDateRange.from, "LLL dd, y")} -{" "}
                        {format(localDateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(localDateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={localDateRange?.from}
                  selected={localDateRange}
                  onSelect={setLocalDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleBulkUpdate}>
              Update Rates
            </Button>
          </div>
        </TabsContent>
        
        {/* Copy Rates Tab */}
        <TabsContent value="copy" className="space-y-4">
          <div className="space-y-2">
            <Label>Source Room Type</Label>
            <div className="border rounded-md p-4 max-h-[100px] overflow-y-auto">
              {roomTypes.map((roomType) => (
                <div key={roomType.id} className="flex items-center space-x-2 py-1">
                  <RadioGroup 
                    value={sourceRoomType} 
                    onValueChange={setSourceRoomType}
                    className="flex"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={roomType.id} id={`source-${roomType.id}`} />
                      <Label htmlFor={`source-${roomType.id}`} className="cursor-pointer">
                        {roomType.name}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Target Room Types</Label>
            <div className="border rounded-md p-4 max-h-[150px] overflow-y-auto grid grid-cols-2 gap-2">
              {roomTypes
                .filter(rt => rt.id !== sourceRoomType)
                .map((roomType) => (
                  <div key={roomType.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`target-${roomType.id}`}
                      checked={targetRoomTypes.includes(roomType.id)}
                      onCheckedChange={() => handleTargetRoomTypeToggle(roomType.id)}
                    />
                    <Label htmlFor={`target-${roomType.id}`} className="cursor-pointer">
                      {roomType.name}
                    </Label>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !copyDateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {copyDateRange?.from ? (
                    copyDateRange.to ? (
                      <>
                        {format(copyDateRange.from, "LLL dd, y")} -{" "}
                        {format(copyDateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(copyDateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={copyDateRange?.from}
                  selected={copyDateRange}
                  onSelect={setCopyDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleCopyRates}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Rates
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BulkRateUpdate;
