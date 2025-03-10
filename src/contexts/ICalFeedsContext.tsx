
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ICalFeed, 
  ICalEvent, 
  ICalSyncResult, 
  ICalConflict,
  icalService
} from '@/services/api/icalService';
import { toast } from '@/components/ui/use-toast';

type ICalFeedsContextType = {
  feeds: ICalFeed[];
  isLoading: boolean;
  isRefreshing: Record<string, boolean>;
  refreshFeeds: () => Promise<void>;
  addFeed: (feed: Omit<ICalFeed, 'id' | 'createdAt' | 'updatedAt' | 'lastSync' | 'status'>) => Promise<ICalFeed>;
  updateFeed: (id: string, updates: Partial<Omit<ICalFeed, 'id' | 'createdAt'>>) => Promise<ICalFeed | null>;
  deleteFeed: (id: string) => Promise<boolean>;
  syncFeed: (id: string) => Promise<ICalSyncResult>;
  generateExportUrl: (propertyId: string, roomId?: string) => string;
  resolveConflict: (conflict: ICalConflict, resolution: 'keep_existing' | 'use_incoming' | 'manual') => Promise<boolean>;
};

const ICalFeedsContext = createContext<ICalFeedsContextType | undefined>(undefined);

export const ICalFeedsProvider: React.FC<{ children: ReactNode; propertyId?: string }> = ({ 
  children,
  propertyId 
}) => {
  const [feeds, setFeeds] = useState<ICalFeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState<Record<string, boolean>>({});
  
  // Load feeds on mount
  useEffect(() => {
    loadFeeds();
  }, [propertyId]);
  
  // Function to load feeds
  const loadFeeds = async () => {
    setIsLoading(true);
    try {
      const loadedFeeds = await icalService.getFeeds(propertyId);
      setFeeds(loadedFeeds);
    } catch (error) {
      console.error("Error loading iCal feeds:", error);
      toast({
        title: "Failed to load iCal feeds",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to refresh feeds
  const refreshFeeds = async () => {
    try {
      const loadedFeeds = await icalService.getFeeds(propertyId);
      setFeeds(loadedFeeds);
    } catch (error) {
      console.error("Error refreshing iCal feeds:", error);
      toast({
        title: "Failed to refresh iCal feeds",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };
  
  // Function to add a feed
  const addFeed = async (feed: Omit<ICalFeed, 'id' | 'createdAt' | 'updatedAt' | 'lastSync' | 'status'>) => {
    try {
      const newFeed = await icalService.createFeed(feed);
      setFeeds(prevFeeds => [...prevFeeds, newFeed]);
      toast({
        title: "iCal Feed Added",
        description: `${feed.name} has been added successfully.`,
      });
      return newFeed;
    } catch (error) {
      console.error("Error adding iCal feed:", error);
      toast({
        title: "Failed to add iCal feed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  // Function to update a feed
  const updateFeed = async (id: string, updates: Partial<Omit<ICalFeed, 'id' | 'createdAt'>>) => {
    try {
      const updatedFeed = await icalService.updateFeed(id, updates);
      if (updatedFeed) {
        setFeeds(prevFeeds => 
          prevFeeds.map(feed => feed.id === id ? updatedFeed : feed)
        );
        toast({
          title: "iCal Feed Updated",
          description: `${updatedFeed.name} has been updated successfully.`,
        });
      }
      return updatedFeed;
    } catch (error) {
      console.error("Error updating iCal feed:", error);
      toast({
        title: "Failed to update iCal feed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  // Function to delete a feed
  const deleteFeed = async (id: string) => {
    try {
      const feed = feeds.find(f => f.id === id);
      const success = await icalService.deleteFeed(id);
      if (success) {
        setFeeds(prevFeeds => prevFeeds.filter(feed => feed.id !== id));
        toast({
          title: "iCal Feed Removed",
          description: feed ? `${feed.name} has been removed.` : "Feed has been removed.",
        });
      }
      return success;
    } catch (error) {
      console.error("Error deleting iCal feed:", error);
      toast({
        title: "Failed to remove iCal feed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  // Function to sync a feed
  const syncFeed = async (id: string) => {
    setIsRefreshing(prev => ({ ...prev, [id]: true }));
    try {
      const result = await icalService.importICalFeed(id);
      await refreshFeeds(); // Refresh feeds to get the updated status
      return result;
    } catch (error) {
      console.error("Error syncing iCal feed:", error);
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Unknown error during sync",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsRefreshing(prev => ({ ...prev, [id]: false }));
    }
  };
  
  // Function to resolve a conflict
  const resolveConflict = async (conflict: ICalConflict, resolution: 'keep_existing' | 'use_incoming' | 'manual') => {
    try {
      return await icalService.resolveConflict(conflict, resolution);
    } catch (error) {
      console.error("Error resolving conflict:", error);
      toast({
        title: "Failed to resolve conflict",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  // Generate export URL
  const generateExportUrl = (propertyId: string, roomId?: string) => {
    return icalService.generateExportUrl(propertyId, roomId);
  };
  
  const value = {
    feeds,
    isLoading,
    isRefreshing,
    refreshFeeds,
    addFeed,
    updateFeed,
    deleteFeed,
    syncFeed,
    generateExportUrl,
    resolveConflict,
  };
  
  return (
    <ICalFeedsContext.Provider value={value}>
      {children}
    </ICalFeedsContext.Provider>
  );
};

export const useICalFeeds = () => {
  const context = useContext(ICalFeedsContext);
  if (context === undefined) {
    throw new Error('useICalFeeds must be used within an ICalFeedsProvider');
  }
  return context;
};
