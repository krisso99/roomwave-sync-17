
import { RoomType, Channel, RateRule } from './types';

export const generatePromoCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  // Generate a 8-character promo code
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
};

export const createRateParityCheck = (
  roomTypes: RoomType[],
  channels: Channel[],
  previewRate: (roomTypeId: string, date: Date, channelId?: string) => Promise<{ baseAmount: number, finalAmount: number, breakdown: { [key: string]: number } }>
) => {
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

  return { checkRateParity };
};
