
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export type RateType = 'base' | 'seasonal' | 'special' | 'promotion';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type DiscountType = 'percentage' | 'fixed';
export type PromotionStatus = 'active' | 'scheduled' | 'expired' | 'draft';

export interface RateRule {
  id: string;
  name: string;
  type: RateType;
  roomTypeId: string;
  amount: number;
  currency: string;
  startDate?: Date;
  endDate?: Date;
  daysOfWeek?: DayOfWeek[];
  minimumStay?: number;
  notes?: string;
  createdAt: Date;
  lastModified: Date;
}

export interface SeasonalRate extends RateRule {
  type: 'seasonal';
  seasonName: string;
}

export interface SpecialEventRate extends RateRule {
  type: 'special';
  eventName: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: Date;
  endDate: Date;
  minimumStay?: number;
  minimumAdvanceBooking?: number;
  maxUsage?: number;
  currentUsage: number;
  promoCode?: string;
  status: PromotionStatus;
  applicableRoomTypes: string[];
  applicableChannels: string[];
  createdAt: Date;
  lastModified: Date;
}

export interface ChannelRateMapping {
  id: string;
  channelId: string;
  channelName: string;
  rateRuleId: string;
  markup: number;
  isMarkupPercentage: boolean;
  isEnabled: boolean;
  lastSynced?: Date;
  notes?: string;
}

export interface RateChangeLog {
  id: string;
  rateRuleId: string;
  roomTypeId: string;
  dateChanged: Date;
  changedBy: string;
  previousValue: number;
  newValue: number;
  reason?: string;
}

export interface RoomType {
  id: string;
  name: string;
  baseRate: number;
  maxOccupancy: number;
}

export interface Channel {
  id: string;
  name: string;
  commission: number;
}

// Mock data generators
const generateMockRoomTypes = (): RoomType[] => [
  { id: '1', name: 'Standard Room', baseRate: 100, maxOccupancy: 2 },
  { id: '2', name: 'Deluxe Room', baseRate: 150, maxOccupancy: 2 },
  { id: '3', name: 'Suite', baseRate: 250, maxOccupancy: 4 },
  { id: '4', name: 'Family Room', baseRate: 200, maxOccupancy: 5 },
];

const generateMockChannels = (): Channel[] => [
  { id: '1', name: 'Direct', commission: 0 },
  { id: '2', name: 'Booking.com', commission: 15 },
  { id: '3', name: 'Expedia', commission: 12 },
  { id: '4', name: 'Airbnb', commission: 3 },
];

const generateMockRateRules = (): RateRule[] => {
  const roomTypes = generateMockRoomTypes();
  const baseRules: RateRule[] = roomTypes.map(room => ({
    id: `base-${room.id}`,
    name: `Base Rate - ${room.name}`,
    type: 'base',
    roomTypeId: room.id,
    amount: room.baseRate,
    currency: 'USD',
    createdAt: new Date('2023-01-01'),
    lastModified: new Date('2023-01-01')
  }));

  // Add some seasonal rates
  const summerRates: SeasonalRate[] = roomTypes.map(room => ({
    id: `summer-${room.id}`,
    name: `Summer Rate - ${room.name}`,
    type: 'seasonal',
    seasonName: 'Summer 2023',
    roomTypeId: room.id,
    amount: room.baseRate * 1.25, // 25% more than base rate
    currency: 'USD',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-08-31'),
    createdAt: new Date('2023-01-15'),
    lastModified: new Date('2023-01-15')
  }));

  // Add some special event rates
  const holidayRates: SpecialEventRate[] = roomTypes.map(room => ({
    id: `holiday-${room.id}`,
    name: `Holiday Rate - ${room.name}`,
    type: 'special',
    eventName: 'New Year\'s Eve',
    roomTypeId: room.id,
    amount: room.baseRate * 1.5, // 50% more than base rate
    currency: 'USD',
    startDate: new Date('2023-12-29'),
    endDate: new Date('2024-01-02'),
    createdAt: new Date('2023-09-01'),
    lastModified: new Date('2023-09-01')
  }));

  // Weekend rates
  const weekendRates: RateRule[] = roomTypes.map(room => ({
    id: `weekend-${room.id}`,
    name: `Weekend Rate - ${room.name}`,
    type: 'base',
    roomTypeId: room.id,
    amount: room.baseRate * 1.2, // 20% more than base rate
    currency: 'USD',
    daysOfWeek: ['friday', 'saturday'],
    createdAt: new Date('2023-01-10'),
    lastModified: new Date('2023-01-10')
  }));

  return [...baseRules, ...summerRates, ...holidayRates, ...weekendRates];
};

const generateMockPromotions = (): Promotion[] => [
  {
    id: '1',
    name: 'Early Bird Discount',
    description: 'Book at least 60 days in advance to get 15% off',
    discountType: 'percentage',
    discountValue: 15,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    minimumAdvanceBooking: 60,
    maxUsage: 100,
    currentUsage: 25,
    status: 'active',
    applicableRoomTypes: ['1', '2', '3', '4'],
    applicableChannels: ['1', '2', '3', '4'],
    createdAt: new Date('2022-11-15'),
    lastModified: new Date('2022-11-15'),
  },
  {
    id: '2',
    name: 'Summer Special',
    description: 'Get $50 off on all bookings during summer',
    discountType: 'fixed',
    discountValue: 50,
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-08-31'),
    minimumStay: 3,
    maxUsage: 50,
    currentUsage: 10,
    promoCode: 'SUMMER23',
    status: 'scheduled',
    applicableRoomTypes: ['2', '3'],
    applicableChannels: ['1', '4'],
    createdAt: new Date('2023-03-10'),
    lastModified: new Date('2023-03-10'),
  },
  {
    id: '3',
    name: 'Last Minute Deal',
    description: 'Book within 3 days of arrival and get 20% off',
    discountType: 'percentage',
    discountValue: 20,
    startDate: new Date('2023-02-01'),
    endDate: new Date('2023-12-31'),
    minimumAdvanceBooking: 0,
    maxUsage: 200,
    currentUsage: 45,
    status: 'active',
    applicableRoomTypes: ['1', '2', '4'],
    applicableChannels: ['1', '2', '3'],
    createdAt: new Date('2023-01-20'),
    lastModified: new Date('2023-01-20'),
  },
];

const generateMockChannelRateMappings = (): ChannelRateMapping[] => {
  const rateRules = generateMockRateRules();
  const channels = generateMockChannels();
  
  const mappings: ChannelRateMapping[] = [];
  
  rateRules.forEach(rule => {
    channels.forEach(channel => {
      if (channel.id !== '1') { // Skip direct channel for simplicity
        mappings.push({
          id: `${rule.id}-${channel.id}`,
          channelId: channel.id,
          channelName: channel.name,
          rateRuleId: rule.id,
          markup: channel.commission,
          isMarkupPercentage: true,
          isEnabled: true,
          lastSynced: new Date(),
          notes: `Auto-generated markup based on ${channel.name} commission.`
        });
      }
    });
  });
  
  return mappings;
};

const generateMockRateChangeLogs = (): RateChangeLog[] => {
  const logs: RateChangeLog[] = [];
  const rateRules = generateMockRateRules();
  
  // Create some sample change logs
  rateRules.slice(0, 5).forEach((rule, index) => {
    logs.push({
      id: `log-${index + 1}`,
      rateRuleId: rule.id,
      roomTypeId: rule.roomTypeId,
      dateChanged: new Date(Date.now() - (index * 86400000)), // Each log is a day apart
      changedBy: 'System Administrator',
      previousValue: rule.amount * 0.9, // Previous value was 10% less
      newValue: rule.amount,
      reason: 'Annual rate adjustment'
    });
  });
  
  return logs;
};

// Create the context interface
interface RateContextType {
  roomTypes: RoomType[];
  channels: Channel[];
  rateRules: RateRule[];
  promotions: Promotion[];
  channelRateMappings: ChannelRateMapping[];
  rateChangeLogs: RateChangeLog[];
  // CRUD operations for rate rules
  addRateRule: (rule: Omit<RateRule, 'id' | 'createdAt' | 'lastModified'>) => Promise<RateRule>;
  updateRateRule: (id: string, updates: Partial<RateRule>) => Promise<RateRule>;
  deleteRateRule: (id: string) => Promise<boolean>;
  // CRUD operations for promotions
  addPromotion: (promotion: Omit<Promotion, 'id' | 'createdAt' | 'lastModified' | 'currentUsage'>) => Promise<Promotion>;
  updatePromotion: (id: string, updates: Partial<Promotion>) => Promise<Promotion>;
  deletePromotion: (id: string) => Promise<boolean>;
  // Channel rate operations
  updateChannelRateMapping: (id: string, updates: Partial<ChannelRateMapping>) => Promise<ChannelRateMapping>;
  // Bulk operations
  bulkUpdateRates: (roomTypeIds: string[], dateRange: { start: Date, end: Date }, amount: number, isPercentage: boolean) => Promise<number>;
  copyRates: (sourceRoomTypeId: string, targetRoomTypeIds: string[], dateRange: { start: Date, end: Date }) => Promise<number>;
  // Rate preview
  previewRate: (roomTypeId: string, date: Date, channelId?: string, promotionId?: string, lengthOfStay?: number, bookingDate?: Date) => Promise<{ baseAmount: number, finalAmount: number, breakdown: { [key: string]: number } }>;
  // Utility functions
  generatePromoCode: () => string;
  checkRateParity: () => Promise<{ hasDisparity: boolean, disparities: Array<{ roomTypeId: string, date: Date, channelRates: Array<{ channelId: string, rate: number }> }> }>;
}

// Create the context with default values
const RateContext = createContext<RateContextType | undefined>(undefined);

// Create a provider component
export const RateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // Set up state for all the data
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [rateRules, setRateRules] = useState<RateRule[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [channelRateMappings, setChannelRateMappings] = useState<ChannelRateMapping[]>([]);
  const [rateChangeLogs, setRateChangeLogs] = useState<RateChangeLog[]>([]);

  // Load mock data on component mount
  useEffect(() => {
    const loadMockData = () => {
      setRoomTypes(generateMockRoomTypes());
      setChannels(generateMockChannels());
      setRateRules(generateMockRateRules());
      setPromotions(generateMockPromotions());
      setChannelRateMappings(generateMockChannelRateMappings());
      setRateChangeLogs(generateMockRateChangeLogs());
    };

    loadMockData();
  }, []);

  // CRUD operations for rate rules
  const addRateRule = async (rule: Omit<RateRule, 'id' | 'createdAt' | 'lastModified'>): Promise<RateRule> => {
    const now = new Date();
    const newRule: RateRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: now,
      lastModified: now,
    };
    
    setRateRules(prev => [...prev, newRule]);
    
    toast({
      title: 'Rate rule created',
      description: `'${newRule.name}' has been successfully created.`,
    });
    
    return newRule;
  };

  const updateRateRule = async (id: string, updates: Partial<RateRule>): Promise<RateRule> => {
    let updatedRule: RateRule | undefined;
    
    setRateRules(prev => {
      const index = prev.findIndex(rule => rule.id === id);
      if (index === -1) throw new Error(`Rate rule with ID ${id} not found`);
      
      const oldAmount = prev[index].amount;
      const updatedRules = [...prev];
      updatedRules[index] = {
        ...updatedRules[index],
        ...updates,
        lastModified: new Date(),
      };
      
      updatedRule = updatedRules[index];
      
      // Create a log entry if the rate amount changed
      if (updates.amount !== undefined && updates.amount !== oldAmount) {
        const logEntry: RateChangeLog = {
          id: `log-${Date.now()}`,
          rateRuleId: id,
          roomTypeId: updatedRule.roomTypeId,
          dateChanged: new Date(),
          changedBy: 'System User', // In a real app, this would be the current user
          previousValue: oldAmount,
          newValue: updates.amount,
          reason: updates.notes || 'Rate updated',
        };
        
        setRateChangeLogs(prevLogs => [...prevLogs, logEntry]);
      }
      
      return updatedRules;
    });
    
    if (!updatedRule) throw new Error(`Failed to update rate rule with ID ${id}`);
    
    toast({
      title: 'Rate rule updated',
      description: `'${updatedRule.name}' has been successfully updated.`,
    });
    
    return updatedRule;
  };

  const deleteRateRule = async (id: string): Promise<boolean> => {
    const ruleToDelete = rateRules.find(rule => rule.id === id);
    if (!ruleToDelete) throw new Error(`Rate rule with ID ${id} not found`);
    
    setRateRules(prev => prev.filter(rule => rule.id !== id));
    
    toast({
      title: 'Rate rule deleted',
      description: `'${ruleToDelete.name}' has been successfully deleted.`,
    });
    
    return true;
  };

  // CRUD operations for promotions
  const addPromotion = async (promotion: Omit<Promotion, 'id' | 'createdAt' | 'lastModified' | 'currentUsage'>): Promise<Promotion> => {
    const now = new Date();
    const newPromotion: Promotion = {
      ...promotion,
      id: `promo-${Date.now()}`,
      currentUsage: 0,
      createdAt: now,
      lastModified: now,
    };
    
    setPromotions(prev => [...prev, newPromotion]);
    
    toast({
      title: 'Promotion created',
      description: `'${newPromotion.name}' has been successfully created.`,
    });
    
    return newPromotion;
  };

  const updatePromotion = async (id: string, updates: Partial<Promotion>): Promise<Promotion> => {
    let updatedPromotion: Promotion | undefined;
    
    setPromotions(prev => {
      const index = prev.findIndex(promo => promo.id === id);
      if (index === -1) throw new Error(`Promotion with ID ${id} not found`);
      
      const updatedPromotions = [...prev];
      updatedPromotions[index] = {
        ...updatedPromotions[index],
        ...updates,
        lastModified: new Date(),
      };
      
      updatedPromotion = updatedPromotions[index];
      return updatedPromotions;
    });
    
    if (!updatedPromotion) throw new Error(`Failed to update promotion with ID ${id}`);
    
    toast({
      title: 'Promotion updated',
      description: `'${updatedPromotion.name}' has been successfully updated.`,
    });
    
    return updatedPromotion;
  };

  const deletePromotion = async (id: string): Promise<boolean> => {
    const promoToDelete = promotions.find(promo => promo.id === id);
    if (!promoToDelete) throw new Error(`Promotion with ID ${id} not found`);
    
    setPromotions(prev => prev.filter(promo => promo.id !== id));
    
    toast({
      title: 'Promotion deleted',
      description: `'${promoToDelete.name}' has been successfully deleted.`,
    });
    
    return true;
  };

  // Channel rate operations
  const updateChannelRateMapping = async (id: string, updates: Partial<ChannelRateMapping>): Promise<ChannelRateMapping> => {
    let updatedMapping: ChannelRateMapping | undefined;
    
    setChannelRateMappings(prev => {
      const index = prev.findIndex(mapping => mapping.id === id);
      if (index === -1) throw new Error(`Channel rate mapping with ID ${id} not found`);
      
      const updatedMappings = [...prev];
      updatedMappings[index] = {
        ...updatedMappings[index],
        ...updates,
        lastSynced: updates.markup !== undefined ? new Date() : updatedMappings[index].lastSynced,
      };
      
      updatedMapping = updatedMappings[index];
      return updatedMappings;
    });
    
    if (!updatedMapping) throw new Error(`Failed to update channel rate mapping with ID ${id}`);
    
    toast({
      title: 'Channel rate updated',
      description: `Rate for ${updatedMapping.channelName} has been successfully updated.`,
    });
    
    return updatedMapping;
  };

  // Bulk operations
  const bulkUpdateRates = async (
    roomTypeIds: string[], 
    dateRange: { start: Date, end: Date }, 
    amount: number, 
    isPercentage: boolean
  ): Promise<number> => {
    // Count how many rules we update
    let updatedCount = 0;
    
    // Find all rate rules that apply to the selected room types and date range
    setRateRules(prev => {
      const updatedRules = prev.map(rule => {
        // Skip rules that don't match our criteria
        if (!roomTypeIds.includes(rule.roomTypeId)) return rule;
        
        // For base rates without date ranges
        if (rule.type === 'base' && !rule.startDate && !rule.endDate) {
          updatedCount++;
          const newAmount = isPercentage 
            ? rule.amount * (1 + amount / 100) 
            : rule.amount + amount;
            
          return {
            ...rule,
            amount: newAmount,
            lastModified: new Date(),
          };
        }
        
        // For rules with date ranges, check if they overlap with our target range
        if (rule.startDate && rule.endDate) {
          const ruleStart = new Date(rule.startDate);
          const ruleEnd = new Date(rule.endDate);
          
          // Check if date ranges overlap
          if (
            (ruleStart <= dateRange.end) && 
            (ruleEnd >= dateRange.start)
          ) {
            updatedCount++;
            const newAmount = isPercentage 
              ? rule.amount * (1 + amount / 100) 
              : rule.amount + amount;
              
            return {
              ...rule,
              amount: newAmount,
              lastModified: new Date(),
            };
          }
        }
        
        return rule;
      });
      
      return updatedRules;
    });
    
    // Add an entry to the change log for the bulk update
    const logEntry: RateChangeLog = {
      id: `log-bulk-${Date.now()}`,
      rateRuleId: 'bulk-update',
      roomTypeId: roomTypeIds.join(','),
      dateChanged: new Date(),
      changedBy: 'System User',
      previousValue: 0, // Not applicable for bulk
      newValue: isPercentage ? amount : 0, // Store percentage if applicable
      reason: `Bulk update: ${isPercentage ? `${amount}% adjustment` : `${amount} flat adjustment`} for ${roomTypeIds.length} room types`,
    };
    
    setRateChangeLogs(prevLogs => [...prevLogs, logEntry]);
    
    toast({
      title: 'Bulk rate update completed',
      description: `Successfully updated ${updatedCount} rate rules.`,
    });
    
    return updatedCount;
  };

  const copyRates = async (
    sourceRoomTypeId: string, 
    targetRoomTypeIds: string[], 
    dateRange: { start: Date, end: Date }
  ): Promise<number> => {
    // Find all source room type rules within the date range
    const sourceRules = rateRules.filter(rule => {
      if (rule.roomTypeId !== sourceRoomTypeId) return false;
      
      // For base rates without date ranges
      if (rule.type === 'base' && !rule.startDate && !rule.endDate) {
        return true;
      }
      
      // For rules with date ranges, check if they overlap with our target range
      if (rule.startDate && rule.endDate) {
        const ruleStart = new Date(rule.startDate);
        const ruleEnd = new Date(rule.endDate);
        
        // Check if date ranges overlap
        return (ruleStart <= dateRange.end) && (ruleEnd >= dateRange.start);
      }
      
      return false;
    });
    
    if (sourceRules.length === 0) {
      toast({
        title: 'Copy failed',
        description: 'No source rates found for the selected room type and date range.',
        variant: 'destructive',
      });
      return 0;
    }
    
    // Generate new rules for each target room type
    const newRules: RateRule[] = [];
    
    targetRoomTypeIds.forEach(targetRoomTypeId => {
      sourceRules.forEach(sourceRule => {
        const now = new Date();
        
        newRules.push({
          ...sourceRule,
          id: `rule-${Date.now()}-${targetRoomTypeId}-${Math.random().toString(36).substring(2, 9)}`,
          roomTypeId: targetRoomTypeId,
          name: sourceRule.name.replace(sourceRoomTypeId, targetRoomTypeId),
          createdAt: now,
          lastModified: now,
        });
      });
    });
    
    setRateRules(prev => [...prev, ...newRules]);
    
    toast({
      title: 'Rates copied successfully',
      description: `Copied ${sourceRules.length} rate rules to ${targetRoomTypeIds.length} room types.`,
    });
    
    return newRules.length;
  };

  // Rate preview function
  const previewRate = async (
    roomTypeId: string, 
    date: Date, 
    channelId?: string, 
    promotionId?: string, 
    lengthOfStay?: number, 
    bookingDate?: Date
  ): Promise<{ baseAmount: number, finalAmount: number, breakdown: { [key: string]: number } }> => {
    // Find the room type
    const roomType = roomTypes.find(rt => rt.id === roomTypeId);
    if (!roomType) throw new Error(`Room type with ID ${roomTypeId} not found`);
    
    // Start with the base rate
    let baseAmount = roomType.baseRate;
    const breakdown: { [key: string]: number } = {
      'Base Rate': baseAmount,
    };
    
    // Get the day of week for the date
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()] as DayOfWeek;
    
    // Find applicable rate rules
    const applicableRules = rateRules.filter(rule => {
      // Must match room type
      if (rule.roomTypeId !== roomTypeId) return false;
      
      // Check date range if applicable
      if (rule.startDate && rule.endDate) {
        const ruleStart = new Date(rule.startDate);
        const ruleEnd = new Date(rule.endDate);
        if (date < ruleStart || date > ruleEnd) return false;
      }
      
      // Check day of week if applicable
      if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
        if (!rule.daysOfWeek.includes(dayOfWeek)) return false;
      }
      
      // Check minimum stay if applicable
      if (rule.minimumStay && lengthOfStay && lengthOfStay < rule.minimumStay) return false;
      
      return true;
    });
    
    // Apply the highest priority rule
    // Priority: special > seasonal > weekend/weekday > base
    let appliedRule: RateRule | undefined;
    
    // First check for special event rates
    appliedRule = applicableRules.find(rule => rule.type === 'special');
    
    // Then check for seasonal rates
    if (!appliedRule) {
      appliedRule = applicableRules.find(rule => rule.type === 'seasonal');
    }
    
    // Then check for day-specific rates (weekend/weekday)
    if (!appliedRule) {
      appliedRule = applicableRules.find(rule => 
        rule.type === 'base' && rule.daysOfWeek && rule.daysOfWeek.length > 0
      );
    }
    
    // Finally fall back to base rate
    if (!appliedRule) {
      appliedRule = applicableRules.find(rule => 
        rule.type === 'base' && (!rule.daysOfWeek || rule.daysOfWeek.length === 0)
      );
    }
    
    // Apply the rule
    if (appliedRule) {
      baseAmount = appliedRule.amount;
      breakdown[appliedRule.name] = appliedRule.amount;
    }
    
    // Apply channel markup if specified
    let finalAmount = baseAmount;
    
    if (channelId) {
      const channel = channels.find(c => c.id === channelId);
      if (channel) {
        // Find channel-specific mapping
        const mapping = channelRateMappings.find(m => 
          m.channelId === channelId && 
          m.rateRuleId === (appliedRule?.id || `base-${roomTypeId}`) &&
          m.isEnabled
        );
        
        if (mapping) {
          const markup = mapping.markup;
          if (mapping.isMarkupPercentage) {
            const markupAmount = baseAmount * (markup / 100);
            finalAmount += markupAmount;
            breakdown[`${channel.name} Markup (${markup}%)`] = markupAmount;
          } else {
            finalAmount += markup;
            breakdown[`${channel.name} Markup`] = markup;
          }
        } else if (channel.commission > 0) {
          // Apply default channel commission
          const commissionAmount = baseAmount * (channel.commission / 100);
          finalAmount += commissionAmount;
          breakdown[`${channel.name} Commission (${channel.commission}%)`] = commissionAmount;
        }
      }
    }
    
    // Apply promotion if specified
    if (promotionId) {
      const promotion = promotions.find(p => 
        p.id === promotionId && 
        p.status === 'active' && 
        new Date() >= promotion.startDate && 
        new Date() <= promotion.endDate && 
        p.applicableRoomTypes.includes(roomTypeId) && 
        (!channelId || p.applicableChannels.includes(channelId)) &&
        (!p.minimumStay || !lengthOfStay || lengthOfStay >= p.minimumStay) &&
        p.currentUsage < (p.maxUsage || Infinity)
      );
      
      if (promotion) {
        // Check advance booking days if applicable
        const daysInAdvance = bookingDate 
          ? Math.ceil((date.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24))
          : Infinity;
          
        if (!promotion.minimumAdvanceBooking || daysInAdvance >= promotion.minimumAdvanceBooking) {
          // Apply the discount
          if (promotion.discountType === 'percentage') {
            const discountAmount = finalAmount * (promotion.discountValue / 100);
            finalAmount -= discountAmount;
            breakdown[`${promotion.name} (${promotion.discountValue}% off)`] = -discountAmount;
          } else {
            finalAmount -= promotion.discountValue;
            breakdown[`${promotion.name} ($${promotion.discountValue} off)`] = -promotion.discountValue;
          }
        }
      }
    }
    
    return {
      baseAmount,
      finalAmount,
      breakdown,
    };
  };

  // Utility functions
  const generatePromoCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    
    // Generate a 8-character promo code
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return code;
  };

  const checkRateParity = async () => {
    const disparities: Array<{ 
      roomTypeId: string, 
      date: Date, 
      channelRates: Array<{ channelId: string, rate: number }> 
    }> = [];
    
    // Get all room types
    for (const roomType of roomTypes) {
      // Check for a few sample dates (in a real application, this would be more comprehensive)
      const today = new Date();
      const sampleDates = [
        today,
        new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      ];
      
      for (const date of sampleDates) {
        const channelRates: Array<{ channelId: string, rate: number }> = [];
        
        // Check rate on each channel
        for (const channel of channels) {
          const result = await previewRate(roomType.id, date, channel.id);
          channelRates.push({
            channelId: channel.id,
            rate: result.finalAmount,
          });
        }
        
        // Check if rates are different across channels
        const rates = channelRates.map(cr => cr.rate);
        const minRate = Math.min(...rates);
        const maxRate = Math.max(...rates);
        
        if (maxRate > minRate * 1.02) { // More than 2% variation
          disparities.push({
            roomTypeId: roomType.id,
            date,
            channelRates,
          });
        }
      }
    }
    
    return {
      hasDisparity: disparities.length > 0,
      disparities,
    };
  };

  // Combine all the context values
  const contextValue: RateContextType = {
    roomTypes,
    channels,
    rateRules,
    promotions,
    channelRateMappings,
    rateChangeLogs,
    addRateRule,
    updateRateRule,
    deleteRateRule,
    addPromotion,
    updatePromotion,
    deletePromotion,
    updateChannelRateMapping,
    bulkUpdateRates,
    copyRates,
    previewRate,
    generatePromoCode,
    checkRateParity,
  };

  return (
    <RateContext.Provider value={contextValue}>
      {children}
    </RateContext.Provider>
  );
};

// Create a custom hook to use the context
export const useRates = () => {
  const context = useContext(RateContext);
  if (context === undefined) {
    throw new Error('useRates must be used within a RateProvider');
  }
  return context;
};
