
import React, { useState } from "react";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, Plus, MinusCircle, AlertCircle, Lock, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { ScrollArea } from "@/components/ui/scroll-area";

// Types
interface RoomType {
  id: string;
  name: string;
  basePrice: number;
  quantity: number;
}

interface CalendarDay {
  date: Date;
  price: number;
  available: number;
  restrictions?: {
    minStay?: number;
    maxStay?: number;
    closed?: boolean;
  };
  status?: "vacant" | "booked" | "partially-booked" | "closed";
}

interface RoomInventory {
  roomTypeId: string;
  inventory: Record<string, CalendarDay>;
}

// Mock data - in a real app this would come from your API
const mockRoomTypes: RoomType[] = [
  { id: "rt1", name: "Deluxe King Room", basePrice: 150, quantity: 5 },
  { id: "rt2", name: "Standard Double Room", basePrice: 100, quantity: 8 },
  { id: "rt3", name: "Family Suite", basePrice: 200, quantity: 3 },
];

// Mock inventory data - generate for current month
const generateMockInventory = (roomTypes: RoomType[]): RoomInventory[] => {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const days = eachDayOfInterval({ start, end });
  
  return roomTypes.map(roomType => {
    const inventory: Record<string, CalendarDay> = {};
    
    days.forEach(day => {
      // Random availability (0 to max quantity)
      const available = Math.floor(Math.random() * (roomType.quantity + 1));
      // Random price variations
      const priceVariation = Math.floor(Math.random() * 50) - 20; // -20 to +30
      const dateKey = format(day, "yyyy-MM-dd");
      
      inventory[dateKey] = {
        date: day,
        available,
        price: roomType.basePrice + priceVariation,
        status: available === 0 ? "booked" : available < roomType.quantity ? "partially-booked" : "vacant",
        restrictions: {
          minStay: Math.random() > 0.8 ? 2 : undefined,
          closed: Math.random() > 0.95
        }
      };
      
      // Override for closed dates
      if (inventory[dateKey].restrictions?.closed) {
        inventory[dateKey].status = "closed";
        inventory[dateKey].available = 0;
      }
    });
    
    return {
      roomTypeId: roomType.id,
      inventory
    };
  });
};

export function InventoryCalendar() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedRoomType, setSelectedRoomType] = useState<string>(mockRoomTypes[0].id);
  const [inventoryData, setInventoryData] = useState<RoomInventory[]>(generateMockInventory(mockRoomTypes));
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [bulkEditDialogOpen, setBulkEditDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(),
    to: addDays(new Date(), 7)
  });
  
  // Temporary edit state
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editAvailable, setEditAvailable] = useState<number>(0);
  const [editMinStay, setEditMinStay] = useState<number | undefined>(undefined);
  const [editMaxStay, setEditMaxStay] = useState<number | undefined>(undefined);
  const [editClosed, setEditClosed] = useState<boolean>(false);
  
  // Bulk edit state
  const [bulkEditOptions, setBulkEditOptions] = useState({
    updatePrice: false,
    updateAvailability: false,
    updateRestrictions: false,
    price: 0,
    available: 0,
    minStay: 1,
    maxStay: 0,
    closed: false,
  });

  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });
  
  // Find the current room inventory
  const currentRoomInventory = inventoryData.find(
    item => item.roomTypeId === selectedRoomType
  );
  
  const currentRoomType = mockRoomTypes.find(
    rt => rt.id === selectedRoomType
  );

  const getDayInventory = (day: Date): CalendarDay | undefined => {
    if (!currentRoomInventory) return undefined;
    const dateKey = format(day, "yyyy-MM-dd");
    return currentRoomInventory.inventory[dateKey];
  };

  const handleDayClick = (day: Date) => {
    const dayInventory = getDayInventory(day);
    if (dayInventory) {
      setSelectedDay(dayInventory);
      setEditPrice(dayInventory.price);
      setEditAvailable(dayInventory.available);
      setEditMinStay(dayInventory.restrictions?.minStay);
      setEditMaxStay(dayInventory.restrictions?.maxStay);
      setEditClosed(dayInventory.restrictions?.closed || false);
      setEditDialogOpen(true);
    }
  };

  const handleSaveEdit = () => {
    if (!selectedDay || !currentRoomInventory) return;
    
    // Create a copy of the current inventory data
    const updatedInventoryData = inventoryData.map(roomInventory => {
      if (roomInventory.roomTypeId !== selectedRoomType) return roomInventory;
      
      const dateKey = format(selectedDay.date, "yyyy-MM-dd");
      
      // Update the inventory for the selected day
      const updatedInventory = {
        ...roomInventory.inventory,
        [dateKey]: {
          date: selectedDay.date,
          price: editPrice,
          available: editClosed ? 0 : editAvailable,
          restrictions: {
            minStay: editMinStay,
            maxStay: editMaxStay,
            closed: editClosed
          },
          status: editClosed 
            ? "closed" 
            : editAvailable === 0 
              ? "booked" 
              : editAvailable < (currentRoomType?.quantity || 0) 
                ? "partially-booked" 
                : "vacant"
        }
      };
      
      return {
        ...roomInventory,
        inventory: updatedInventory
      };
    });
    
    setInventoryData(updatedInventoryData);
    setEditDialogOpen(false);
    
    toast({
      title: "Inventory updated",
      description: `Changes for ${format(selectedDay.date, "MMMM d, yyyy")} have been saved.`,
    });
  };

  const handleBulkEditSave = () => {
    if (!currentRoomInventory || !dateRange.from || !dateRange.to) return;
    
    const daysInRange = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to
    });
    
    // Create a copy of the current inventory data
    const updatedInventoryData = inventoryData.map(roomInventory => {
      if (roomInventory.roomTypeId !== selectedRoomType) return roomInventory;
      
      const updatedInventory = { ...roomInventory.inventory };
      
      daysInRange.forEach(day => {
        const dateKey = format(day, "yyyy-MM-dd");
        const currentDay = updatedInventory[dateKey] || {
          date: day,
          price: currentRoomType?.basePrice || 0,
          available: currentRoomType?.quantity || 0,
          restrictions: {}
        };
        
        // Update only the fields that are selected
        const updatedDay = {
          ...currentDay,
          price: bulkEditOptions.updatePrice ? bulkEditOptions.price : currentDay.price,
          available: bulkEditOptions.updateAvailability 
            ? (bulkEditOptions.closed ? 0 : bulkEditOptions.available)
            : currentDay.available,
          restrictions: {
            ...currentDay.restrictions,
            ...(bulkEditOptions.updateRestrictions && {
              minStay: bulkEditOptions.minStay || undefined,
              maxStay: bulkEditOptions.maxStay || undefined,
              closed: bulkEditOptions.closed
            })
          }
        };
        
        // Determine the status based on the availability
        const status = bulkEditOptions.closed || updatedDay.restrictions?.closed
          ? "closed"
          : updatedDay.available === 0
            ? "booked"
            : updatedDay.available < (currentRoomType?.quantity || 0)
              ? "partially-booked"
              : "vacant";
        
        updatedInventory[dateKey] = {
          ...updatedDay,
          status
        };
      });
      
      return {
        ...roomInventory,
        inventory: updatedInventory
      };
    });
    
    setInventoryData(updatedInventoryData);
    setBulkEditDialogOpen(false);
    
    toast({
      title: "Bulk update completed",
      description: `Inventory updated for ${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}.`,
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "vacant":
        return "bg-green-100 text-green-800 border-green-300";
      case "partially-booked":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "booked":
        return "bg-red-100 text-red-800 border-red-300";
      case "closed":
        return "bg-slate-100 text-slate-800 border-slate-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold tracking-tight">Inventory Calendar</h2>
        
        <div className="flex space-x-2">
          <Select
            value={selectedRoomType}
            onValueChange={setSelectedRoomType}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select room type" />
            </SelectTrigger>
            <SelectContent>
              {mockRoomTypes.map(roomType => (
                <SelectItem key={roomType.id} value={roomType.id}>
                  {roomType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog open={bulkEditDialogOpen} onOpenChange={setBulkEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Bulk Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Bulk Edit Inventory</DialogTitle>
                <DialogDescription>
                  Update inventory for multiple days at once.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <CalendarDateRangePicker 
                    dateRange={{ from: dateRange.from, to: dateRange.to }}
                    onDateRangeChange={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange({ from: range.from, to: range.to });
                      }
                    }}
                  />
                </div>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="updatePrice" 
                      checked={bulkEditOptions.updatePrice}
                      onCheckedChange={(checked) => 
                        setBulkEditOptions({...bulkEditOptions, updatePrice: !!checked})
                      }
                    />
                    <Label htmlFor="updatePrice">Update Price</Label>
                  </div>
                  
                  {bulkEditOptions.updatePrice && (
                    <div className="pl-6">
                      <Label htmlFor="bulkPrice">Price per night</Label>
                      <Input
                        id="bulkPrice"
                        type="number"
                        value={bulkEditOptions.price}
                        onChange={(e) => 
                          setBulkEditOptions({
                            ...bulkEditOptions, 
                            price: parseInt(e.target.value) || 0
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="updateAvailability" 
                      checked={bulkEditOptions.updateAvailability}
                      onCheckedChange={(checked) => 
                        setBulkEditOptions({...bulkEditOptions, updateAvailability: !!checked})
                      }
                    />
                    <Label htmlFor="updateAvailability">Update Availability</Label>
                  </div>
                  
                  {bulkEditOptions.updateAvailability && (
                    <div className="pl-6">
                      <Label htmlFor="bulkAvailable">Available rooms</Label>
                      <Input
                        id="bulkAvailable"
                        type="number"
                        value={bulkEditOptions.available}
                        onChange={(e) => 
                          setBulkEditOptions({
                            ...bulkEditOptions, 
                            available: parseInt(e.target.value) || 0
                          })
                        }
                        className="mt-1"
                        disabled={bulkEditOptions.closed}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="updateRestrictions" 
                      checked={bulkEditOptions.updateRestrictions}
                      onCheckedChange={(checked) => 
                        setBulkEditOptions({...bulkEditOptions, updateRestrictions: !!checked})
                      }
                    />
                    <Label htmlFor="updateRestrictions">Update Restrictions</Label>
                  </div>
                  
                  {bulkEditOptions.updateRestrictions && (
                    <div className="pl-6 space-y-2">
                      <div>
                        <Label htmlFor="bulkMinStay">Minimum stay (nights)</Label>
                        <Input
                          id="bulkMinStay"
                          type="number"
                          value={bulkEditOptions.minStay}
                          onChange={(e) => 
                            setBulkEditOptions({
                              ...bulkEditOptions, 
                              minStay: parseInt(e.target.value) || 0
                            })
                          }
                          className="mt-1"
                          disabled={bulkEditOptions.closed}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="bulkMaxStay">Maximum stay (nights, 0 for no limit)</Label>
                        <Input
                          id="bulkMaxStay"
                          type="number"
                          value={bulkEditOptions.maxStay}
                          onChange={(e) => 
                            setBulkEditOptions({
                              ...bulkEditOptions, 
                              maxStay: parseInt(e.target.value) || 0
                            })
                          }
                          className="mt-1"
                          disabled={bulkEditOptions.closed}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="bulkClosed" 
                          checked={bulkEditOptions.closed}
                          onCheckedChange={(checked) => 
                            setBulkEditOptions({...bulkEditOptions, closed: !!checked})
                          }
                        />
                        <Label htmlFor="bulkClosed">Close these dates for booking</Label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setBulkEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleBulkEditSave}>
                  Apply Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader className="px-6 py-4 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">{format(currentMonth, 'MMMM yyyy')}</CardTitle>
          <div className="flex space-x-1">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(new Date())}>
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="px-0">
          <ScrollArea className="h-[500px]">
            <div className="grid grid-cols-7 border-t">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="py-2 px-3 text-center text-sm font-medium border-b">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {days.map((day, dayIdx) => {
                const dayInventory = getDayInventory(day);
                return (
                  <div
                    key={day.toString()}
                    className={`min-h-[100px] p-2 border-b border-r ${
                      dayIdx % 7 === 0 ? 'border-l' : ''
                    } ${
                      !isSameMonth(day, currentMonth) ? 'bg-muted/30' : ''
                    } relative hover:bg-muted/40 cursor-pointer transition-colors`}
                    onClick={() => handleDayClick(day)}
                  >
                    <div className="text-right font-medium text-sm">
                      {format(day, 'd')}
                    </div>
                    
                    {dayInventory && (
                      <div className="mt-2 space-y-1">
                        <div className={`text-sm font-medium px-1.5 py-0.5 rounded ${getStatusColor(dayInventory.status)}`}>
                          ${dayInventory.price}
                        </div>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-xs font-medium text-muted-foreground">
                                {dayInventory.status === 'closed' ? (
                                  <Badge variant="outline" className="text-xs">Closed</Badge>
                                ) : (
                                  <>Available: {dayInventory.available}/{currentRoomType?.quantity}</>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{dayInventory.status === 'closed' ? 'Date is closed for booking' : `${dayInventory.available} out of ${currentRoomType?.quantity} rooms available`}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        {dayInventory.restrictions && (
                          <div className="flex gap-1 flex-wrap">
                            {dayInventory.restrictions.minStay && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge variant="outline" className="text-[10px] bg-blue-50">
                                      Min {dayInventory.restrictions.minStay}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Minimum stay: {dayInventory.restrictions.minStay} nights</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            
                            {dayInventory.restrictions.maxStay && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge variant="outline" className="text-[10px] bg-purple-50">
                                      Max {dayInventory.restrictions.maxStay}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Maximum stay: {dayInventory.restrictions.maxStay} nights</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            
                            {dayInventory.restrictions.closed && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge variant="outline" className="text-[10px] bg-red-50">
                                      <Lock className="h-2.5 w-2.5 mr-0.5" />
                                      Closed
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>This date is closed for booking</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 absolute top-1 left-1 opacity-0 hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDayClick(day);
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Day edit dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Inventory</DialogTitle>
            <DialogDescription>
              {selectedDay && format(selectedDay.date, "MMMM d, yyyy")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                  disabled={editClosed}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="available">Available Rooms</Label>
                <Input
                  id="available"
                  type="number"
                  value={editAvailable}
                  onChange={(e) => setEditAvailable(parseInt(e.target.value) || 0)}
                  max={currentRoomType?.quantity}
                  disabled={editClosed}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minStay">Minimum Stay (nights)</Label>
                <Input
                  id="minStay"
                  type="number"
                  value={editMinStay || ""}
                  onChange={(e) => {
                    const value = e.target.value === "" ? undefined : parseInt(e.target.value);
                    setEditMinStay(value);
                  }}
                  disabled={editClosed}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxStay">Maximum Stay (nights)</Label>
                <Input
                  id="maxStay"
                  type="number"
                  value={editMaxStay || ""}
                  onChange={(e) => {
                    const value = e.target.value === "" ? undefined : parseInt(e.target.value);
                    setEditMaxStay(value);
                  }}
                  disabled={editClosed}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="closedDate" 
                checked={editClosed}
                onCheckedChange={(checked) => setEditClosed(!!checked)}
              />
              <Label htmlFor="closedDate">Close this date for booking</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
