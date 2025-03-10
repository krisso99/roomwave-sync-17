
import { 
  RoomType, 
  Channel, 
  RateRule, 
  SeasonalRate, 
  SpecialEventRate, 
  Promotion, 
  ChannelRateMapping, 
  RateChangeLog 
} from './types';

// Mock data generators
export const generateMockRoomTypes = (): RoomType[] => [
  { id: '1', name: 'Standard Room', baseRate: 100, maxOccupancy: 2 },
  { id: '2', name: 'Deluxe Room', baseRate: 150, maxOccupancy: 2 },
  { id: '3', name: 'Suite', baseRate: 250, maxOccupancy: 4 },
  { id: '4', name: 'Family Room', baseRate: 200, maxOccupancy: 5 },
];

export const generateMockChannels = (): Channel[] => [
  { id: '1', name: 'Direct', commission: 0 },
  { id: '2', name: 'Booking.com', commission: 15 },
  { id: '3', name: 'Expedia', commission: 12 },
  { id: '4', name: 'Airbnb', commission: 3 },
];

export const generateMockRateRules = (): RateRule[] => {
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

export const generateMockPromotions = (): Promotion[] => [
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

export const generateMockChannelRateMappings = (): ChannelRateMapping[] => {
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

export const generateMockRateChangeLogs = (): RateChangeLog[] => {
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
