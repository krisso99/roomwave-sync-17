
import { RoomType, Channel, RateRule, Promotion, DayOfWeek } from './types';

export const createRatePreviewOperations = (
  roomTypes: RoomType[],
  channels: Channel[],
  rateRules: RateRule[],
  promotions: Promotion[]
) => {
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
        const channelRateMappings = []; // This would be passed as a parameter in a real implementation
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

  return { previewRate };
};
