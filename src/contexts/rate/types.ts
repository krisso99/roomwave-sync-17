
// Define all types for the rate management system
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

// Context type definition
export interface RateContextType {
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
