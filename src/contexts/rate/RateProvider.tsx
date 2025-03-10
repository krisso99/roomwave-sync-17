
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

import { 
  RateContextType, 
  RoomType, 
  Channel, 
  RateRule, 
  Promotion, 
  ChannelRateMapping, 
  RateChangeLog 
} from './types';

import { 
  generateMockRoomTypes, 
  generateMockChannels, 
  generateMockRateRules, 
  generateMockPromotions, 
  generateMockChannelRateMappings, 
  generateMockRateChangeLogs 
} from './mockData';

import { 
  createRateRuleOperations, 
  createPromotionOperations, 
  createChannelRateOperations, 
  createBulkOperations 
} from './rateOperations';

import { createRatePreviewOperations } from './ratePreview';
import { generatePromoCode, createRateParityCheck } from './utilities';

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

  // Create operations
  const rateRuleOps = createRateRuleOperations(setRateRules, setRateChangeLogs);
  const promotionOps = createPromotionOperations(setPromotions);
  const channelRateOps = createChannelRateOperations(setChannelRateMappings);
  const bulkOps = createBulkOperations(rateRules, setRateRules, setRateChangeLogs);
  
  // Create preview operations
  const previewOps = createRatePreviewOperations(roomTypes, channels, rateRules, promotions);
  
  // Create rate parity check
  const parityCheck = createRateParityCheck(roomTypes, channels, previewOps.previewRate);

  // Combine all the context values
  const contextValue: RateContextType = {
    roomTypes,
    channels,
    rateRules,
    promotions,
    channelRateMappings,
    rateChangeLogs,
    ...rateRuleOps,
    ...promotionOps,
    ...channelRateOps,
    ...bulkOps,
    ...previewOps,
    generatePromoCode,
    ...parityCheck,
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
