
import React, { useState } from 'react';
import { format, addDays, isEqual } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useRates, RoomType, RateRule, Channel, Promotion } from '@/contexts/RateContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, List, Tag, Receipt } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Import refactored components
import RateManagementHeader from '@/components/rates/RateManagementHeader';
import RoomTypeFilters from '@/components/rates/RoomTypeFilters';
import DateRangeFilterCard from '@/components/rates/DateRangeFilterCard';
import CalendarTabContent from '@/components/rates/CalendarTabContent';
import RateListTabContent from '@/components/rates/RateListTabContent';
import PromotionsTabContent from '@/components/rates/PromotionsTabContent';
import ChannelRatesTabContent from '@/components/rates/ChannelRatesTabContent';
import RateDialogs from '@/components/rates/RateDialogs';

const RateManagement: React.FC = () => {
  // Get rates context
  const { 
    roomTypes, 
    channels, 
    rateRules, 
    promotions,
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
  
  // Get active room types (either selected or all if none selected)
  const activeRoomTypes = selectedRoomTypes.length > 0 
    ? roomTypes.filter(rt => selectedRoomTypes.includes(rt.id))
    : roomTypes;
  
  return (
    <div className="h-full w-full max-w-full overflow-x-hidden">
      <div className="px-4 py-6 space-y-6">
        {/* Header with action buttons */}
        <RateManagementHeader 
          onBulkUpdateOpen={() => setIsBulkUpdateOpen(true)}
          onCheckRateParity={handleCheckRateParity}
          onHistoryLogOpen={() => setIsHistoryLogOpen(true)}
          onNewPromotion={() => handleEditPromotion(null)}
        />
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
          
          {/* Tab Contents */}
          <TabsContent value="calendar">
            <CalendarTabContent
              roomTypes={activeRoomTypes}
              dateRange={dateRange}
              selectedChannel={selectedChannel}
              onEditRate={handleEditRate}
            />
          </TabsContent>
          
          <TabsContent value="list">
            <RateListTabContent
              roomTypes={roomTypes}
              rateRules={rateRules}
              selectedRoomTypes={selectedRoomTypes}
              onEditRate={handleEditRate}
              onDeleteRate={deleteRateRule}
            />
          </TabsContent>
          
          <TabsContent value="promotions">
            <PromotionsTabContent
              promotions={promotions}
              onEditPromotion={handleEditPromotion}
            />
          </TabsContent>
          
          <TabsContent value="channels">
            <ChannelRatesTabContent
              roomTypes={activeRoomTypes}
              channels={channels}
              dateRange={dateRange}
            />
          </TabsContent>
        </Tabs>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Room Type Filter */}
          <RoomTypeFilters
            roomTypes={roomTypes}
            selectedRoomTypes={selectedRoomTypes}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRoomTypeToggle={handleRoomTypeToggle}
            onCreateRate={handleCreateRate}
          />
          
          {/* Date Range Filter */}
          <DateRangeFilterCard
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>
        
        {/* Dialogs */}
        <RateDialogs
          roomTypes={roomTypes}
          channels={channels}
          selectedRoomTypes={selectedRoomTypes}
          dateRange={dateRange}
          isRateEditorOpen={isRateEditorOpen}
          setIsRateEditorOpen={setIsRateEditorOpen}
          isPromotionFormOpen={isPromotionFormOpen}
          setIsPromotionFormOpen={setIsPromotionFormOpen}
          isHistoryLogOpen={isHistoryLogOpen}
          setIsHistoryLogOpen={setIsHistoryLogOpen}
          isBulkUpdateOpen={isBulkUpdateOpen}
          setIsBulkUpdateOpen={setIsBulkUpdateOpen}
          selectedRateRule={selectedRateRule}
          selectedPromotion={selectedPromotion}
        />
      </div>
    </div>
  );
};

export default RateManagement;
