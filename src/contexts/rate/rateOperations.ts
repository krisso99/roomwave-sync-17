
import { toast } from '@/components/ui/use-toast';
import { 
  RateRule, 
  RateChangeLog, 
  Promotion, 
  ChannelRateMapping, 
  DayOfWeek
} from './types';

// Rate Rule CRUD Operations
export const createRateRuleOperations = (
  setRateRules: React.Dispatch<React.SetStateAction<RateRule[]>>,
  setRateChangeLogs: React.Dispatch<React.SetStateAction<RateChangeLog[]>>
) => {
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
    let ruleToDelete: RateRule | undefined;
    
    setRateRules(prev => {
      ruleToDelete = prev.find(rule => rule.id === id);
      if (!ruleToDelete) throw new Error(`Rate rule with ID ${id} not found`);
      return prev.filter(rule => rule.id !== id);
    });
    
    if (!ruleToDelete) throw new Error(`Rate rule with ID ${id} not found`);
    
    toast({
      title: 'Rate rule deleted',
      description: `'${ruleToDelete.name}' has been successfully deleted.`,
    });
    
    return true;
  };

  return {
    addRateRule,
    updateRateRule,
    deleteRateRule
  };
};

// Promotion CRUD Operations
export const createPromotionOperations = (
  setPromotions: React.Dispatch<React.SetStateAction<Promotion[]>>
) => {
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
    let promoToDelete: Promotion | undefined;
    
    setPromotions(prev => {
      promoToDelete = prev.find(promo => promo.id === id);
      if (!promoToDelete) throw new Error(`Promotion with ID ${id} not found`);
      return prev.filter(promo => promo.id !== id);
    });
    
    if (!promoToDelete) throw new Error(`Promotion with ID ${id} not found`);
    
    toast({
      title: 'Promotion deleted',
      description: `'${promoToDelete.name}' has been successfully deleted.`,
    });
    
    return true;
  };

  return {
    addPromotion,
    updatePromotion,
    deletePromotion
  };
};

// Channel Rate Operations
export const createChannelRateOperations = (
  setChannelRateMappings: React.Dispatch<React.SetStateAction<ChannelRateMapping[]>>
) => {
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

  return {
    updateChannelRateMapping
  };
};

// Bulk Operations
export const createBulkOperations = (
  rateRules: RateRule[],
  setRateRules: React.Dispatch<React.SetStateAction<RateRule[]>>,
  setRateChangeLogs: React.Dispatch<React.SetStateAction<RateChangeLog[]>>
) => {
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

  return {
    bulkUpdateRates,
    copyRates
  };
};
