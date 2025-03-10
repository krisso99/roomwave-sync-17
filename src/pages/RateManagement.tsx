
import React, { useState } from 'react';
import { format, addDays, isEqual } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useRates, RoomType, RateRule, Channel, Promotion } from '@/contexts/RateContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DateRangePickerInline } from '@/components/ui/date-range-picker-inline';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, CalendarDays, Copy, DollarSign, Edit, Euro, Gift, Layers, List, Percent, Plus, Receipt, RefreshCw, Tag, Trash2, History } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import RateCalendarView from '@/components/rates/RateCalendarView';
import RateEditor from '@/components/rates/RateEditor';
import PromotionForm from '@/components/rates/PromotionForm';
import RateHistoryLog from '@/components/rates/RateHistoryLog';
import ChannelRatesTable from '@/components/rates/ChannelRatesTable';
import BulkRateUpdate from '@/components/rates/BulkRateUpdate';

const RateManagement: React.FC = () => {
  // Get rates context
  const { 
    roomTypes, 
    channels, 
    rateRules, 
    promotions,
    addRateRule,
    updateRateRule,
    deleteRateRule,
    checkRateParity
  } = useRates();
  
  // State for filters and active tab
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('1'); // Default to direct channel
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for date range
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });
  
  // Dialogs state
  const [isRateEditorOpen, setIsRateEditorOpen] = useState(false);
  const [isPromotionFormOpen, setIsPromotionFormOpen] = useState(false);
  const [isHistoryLogOpen, setIsHistoryLogOpen] = useState(false);
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false);
  const [selectedRateRule, setSelectedRateRule] = useState<RateRule | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  
  // Handle room type selection
  const handleRoomTypeToggle = (roomTypeId: string) => {
    setSelectedRoomTypes(prev => {
      if (prev.includes(roomTypeId)) {
        return prev.filter(id => id !== roomTypeId);
      } else {
        return [...prev, roomTypeId];
      }
    });
  };
  
  // Handle channel selection
  const handleChannelChange = (channelId: string) => {
    setSelectedChannel(channelId);
  };
  
  // Handle date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };
  
  // Handle rate edit
  const handleEditRate = (rateRule: RateRule) => {
    setSelectedRateRule(rateRule);
    setIsRateEditorOpen(true);
  };
  
  // Handle rate creation
  const handleCreateRate = (roomTypeId: string) => {
    const roomType = roomTypes.find(rt => rt.id === roomTypeId);
    if (!roomType) return;
    
    // Create a template for the new rate rule
    const newRateTemplate: Omit<RateRule, 'id' | 'createdAt' | 'lastModified'> = {
      name: `New Rate for ${roomType.name}`,
      type: 'base',
      roomTypeId,
      amount: roomType.baseRate,
      currency: 'USD',
    };
    
    setSelectedRateRule(newRateTemplate as RateRule);
    setIsRateEditorOpen(true);
  };
  
  // Handle promotion edit/create
  const handleEditPromotion = (promotion: Promotion | null = null) => {
    setSelectedPromotion(promotion);
    setIsPromotionFormOpen(true);
  };
  
  // Handle rate parity check
  const handleCheckRateParity = async () => {
    try {
      const result = await checkRateParity();
      
      if (result.hasDisparity) {
        toast({
          title: 'Rate parity issues detected',
          description: `Found ${result.disparities.length} dates with pricing inconsistencies across channels.`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Rate parity check passed',
          description: 'No pricing inconsistencies detected across your distribution channels.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error checking rate parity',
        description: 'An error occurred while checking rate parity.',
        variant: 'destructive',
      });
    }
  };
  
  // Filter room types based on search
  const filteredRoomTypes = roomTypes.filter(roomType => 
    roomType.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get active room types (either selected or all if none selected)
  const activeRoomTypes = selectedRoomTypes.length > 0 
    ? roomTypes.filter(rt => selectedRoomTypes.includes(rt.id))
    : roomTypes;
  
  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-display font-bold">Rate Management</h1>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsBulkUpdateOpen(true)}>
            <Layers className="mr-2 h-4 w-4" />
            Bulk Update
          </Button>
          <Button variant="outline" size="sm" onClick={handleCheckRateParity}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Check Parity
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsHistoryLogOpen(true)}>
            <History className="mr-2 h-4 w-4" />
            Rate History
          </Button>
          <Button onClick={() => handleEditPromotion(null)}>
            <Gift className="mr-2 h-4 w-4" />
            New Promotion
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="calendar">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="promotions">
            <Tag className="mr-2 h-4 w-4" />
            Promotions
          </TabsTrigger>
          <TabsTrigger value="channels">
            <Receipt className="mr-2 h-4 w-4" />
            Channel Rates
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Room Type Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Room Types</CardTitle>
            <CardDescription>
              Select room types to view or edit rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  placeholder="Search room types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-2"
                />
              </div>
              <div className="max-h-[200px] overflow-y-auto space-y-1">
                {filteredRoomTypes.length > 0 ? (
                  filteredRoomTypes.map((roomType) => (
                    <div key={roomType.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`room-${roomType.id}`}
                        checked={selectedRoomTypes.includes(roomType.id)}
                        onChange={() => handleRoomTypeToggle(roomType.id)}
                        className="rounded border-gray-300"
                      />
                      <label 
                        htmlFor={`room-${roomType.id}`}
                        className="flex-1 text-sm cursor-pointer"
                      >
                        {roomType.name}
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleCreateRate(roomType.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground py-2">
                    No room types match your search
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Date Range Filter */}
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
                onDateRangeChange={handleDateRangeChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tab Contents */}
      <div className="mt-6">
        {activeTab === 'calendar' && (
          <Card>
            <CardHeader>
              <CardTitle>Rate Calendar</CardTitle>
              <CardDescription>
                Visual calendar view of rates for selected room types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RateCalendarView
                roomTypes={activeRoomTypes}
                dateRange={dateRange}
                selectedChannel={selectedChannel}
                onEditRate={handleEditRate}
              />
            </CardContent>
          </Card>
        )}
        
        {activeTab === 'list' && (
          <Card>
            <CardHeader>
              <CardTitle>Rate List</CardTitle>
              <CardDescription>
                Detailed list of all rate rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room Type</TableHead>
                      <TableHead>Rate Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rateRules.filter(rule => 
                      (selectedRoomTypes.length === 0 || selectedRoomTypes.includes(rule.roomTypeId))
                    ).map(rule => {
                      const roomType = roomTypes.find(rt => rt.id === rule.roomTypeId);
                      
                      return (
                        <TableRow key={rule.id}>
                          <TableCell>{roomType?.name || 'Unknown'}</TableCell>
                          <TableCell>{rule.name}</TableCell>
                          <TableCell>
                            <Badge variant={
                              rule.type === 'special' ? 'destructive' : 
                              rule.type === 'seasonal' ? 'default' : 
                              'outline'
                            }>
                              {rule.type.charAt(0).toUpperCase() + rule.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>${rule.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            {rule.startDate && rule.endDate ? (
                              <span className="text-sm">
                                {format(new Date(rule.startDate), 'MMM d, yyyy')} - {format(new Date(rule.endDate), 'MMM d, yyyy')}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">Standard</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditRate(rule)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this rate rule?')) {
                                    deleteRateRule(rule.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
        
        {activeTab === 'promotions' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Promotions</CardTitle>
                <CardDescription>
                  Manage special offers and discounts
                </CardDescription>
              </div>
              <Button onClick={() => handleEditPromotion()}>
                <Plus className="mr-2 h-4 w-4" />
                New Promotion
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {promotions.map(promotion => (
                  <Card key={promotion.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{promotion.name}</CardTitle>
                        <Badge variant={
                          promotion.status === 'active' ? 'default' :
                          promotion.status === 'scheduled' ? 'outline' :
                          promotion.status === 'expired' ? 'secondary' :
                          'destructive'
                        }>
                          {promotion.status.charAt(0).toUpperCase() + promotion.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription>
                        {promotion.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-2">
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Discount:</span>
                          <span className="font-medium">
                            {promotion.discountType === 'percentage' ? 
                              `${promotion.discountValue}%` : 
                              `$${promotion.discountValue.toFixed(2)}`
                            }
                          </span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Valid Until:</span>
                          <span>{format(new Date(promotion.endDate), 'PP')}</span>
                        </div>
                        {promotion.minimumStay && (
                          <div className="flex justify-between mb-1">
                            <span className="text-muted-foreground">Min Stay:</span>
                            <span>{promotion.minimumStay} nights</span>
                          </div>
                        )}
                        {promotion.promoCode && (
                          <div className="flex justify-between mb-1">
                            <span className="text-muted-foreground">Promo Code:</span>
                            <span className="font-mono">{promotion.promoCode}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Usage:</span>
                          <span>{promotion.currentUsage} / {promotion.maxUsage || '∞'}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2 border-t bg-muted/20 py-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditPromotion(promotion)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {activeTab === 'channels' && (
          <Card>
            <CardHeader>
              <CardTitle>Channel Rates</CardTitle>
              <CardDescription>
                Manage rates across different distribution channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChannelRatesTable
                roomTypes={activeRoomTypes}
                channels={channels}
                dateRange={dateRange}
              />
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Rate Editor Dialog */}
      <Dialog open={isRateEditorOpen} onOpenChange={setIsRateEditorOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRateRule && 'id' in selectedRateRule ? 'Edit Rate' : 'Create New Rate'}
            </DialogTitle>
          </DialogHeader>
          <RateEditor
            rateRule={selectedRateRule}
            roomTypes={roomTypes}
            onSave={() => setIsRateEditorOpen(false)}
            onCancel={() => setIsRateEditorOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Promotion Form Dialog */}
      <Dialog open={isPromotionFormOpen} onOpenChange={setIsPromotionFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPromotion ? 'Edit Promotion' : 'Create New Promotion'}
            </DialogTitle>
          </DialogHeader>
          <PromotionForm
            promotion={selectedPromotion}
            roomTypes={roomTypes}
            channels={channels}
            onSave={() => setIsPromotionFormOpen(false)}
            onCancel={() => setIsPromotionFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Rate History Dialog */}
      <Dialog open={isHistoryLogOpen} onOpenChange={setIsHistoryLogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Rate Change History</DialogTitle>
          </DialogHeader>
          <RateHistoryLog roomTypes={roomTypes} />
        </DialogContent>
      </Dialog>
      
      {/* Bulk Update Dialog */}
      <Dialog open={isBulkUpdateOpen} onOpenChange={setIsBulkUpdateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Rate Update</DialogTitle>
            <DialogDescription>
              Update multiple rates at once
            </DialogDescription>
          </DialogHeader>
          <BulkRateUpdate
            roomTypes={roomTypes}
            selectedRoomTypes={selectedRoomTypes}
            dateRange={dateRange}
            onComplete={() => setIsBulkUpdateOpen(false)}
            onCancel={() => setIsBulkUpdateOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RateManagement;
