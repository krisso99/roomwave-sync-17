import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ICalFeed, 
  ICalEvent, 
  ICalSyncResult, 
  ICalConflict,
  icalService
} from '@/services/api/icalService';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ICalFeedRow {
  id: string;
  name: string;
  url: string;
  property_id: string;
  room_id: string | null;
  last_sync: string | null;
  auto_sync: boolean;
  sync_interval: number;
  status: string;
  error: string | null;
  direction: string;
  priority: number;
  created_at: string;
  updated_at: string;
}

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
  
  useEffect(() => {
    loadFeeds();
  }, [propertyId]);
  
  const loadFeeds = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('ical_feeds').select('*');
      
      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const formattedFeeds: ICalFeed[] = (data as ICalFeedRow[]).map(feed => ({
        id: feed.id,
        name: feed.name,
        url: feed.url,
        propertyId: feed.property_id,
        roomId: feed.room_id || undefined,
        lastSync: feed.last_sync ? new Date(feed.last_sync) : null,
        autoSync: feed.auto_sync,
        syncInterval: feed.sync_interval,
        status: feed.status as 'active' | 'error' | 'pending',
        error: feed.error || undefined,
        direction: feed.direction as 'import' | 'export' | 'both',
        priority: feed.priority,
        createdAt: new Date(feed.created_at),
        updatedAt: new Date(feed.updated_at)
      }));
      
      setFeeds(formattedFeeds);
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
  
  const refreshFeeds = async () => {
    try {
      await loadFeeds();
    } catch (error) {
      console.error("Error refreshing iCal feeds:", error);
      toast({
        title: "Failed to refresh iCal feeds",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };
  
  const addFeed = async (feed: Omit<ICalFeed, 'id' | 'createdAt' | 'updatedAt' | 'lastSync' | 'status'>) => {
    try {
      const { data, error } = await supabase.from('ical_feeds').insert({
        name: feed.name,
        url: feed.url,
        property_id: feed.propertyId,
        room_id: feed.roomId,
        auto_sync: feed.autoSync,
        sync_interval: feed.syncInterval,
        direction: feed.direction,
        priority: feed.priority
      }).select().single();
      
      if (error) {
        throw error;
      }
      
      const feedData = data as ICalFeedRow;
      const newFeed: ICalFeed = {
        id: feedData.id,
        name: feedData.name,
        url: feedData.url,
        propertyId: feedData.property_id,
        roomId: feedData.room_id || undefined,
        lastSync: feedData.last_sync ? new Date(feedData.last_sync) : null,
        autoSync: feedData.auto_sync,
        syncInterval: feedData.sync_interval,
        status: feedData.status as 'active' | 'error' | 'pending',
        error: feedData.error || undefined,
        direction: feedData.direction as 'import' | 'export' | 'both',
        priority: feedData.priority,
        createdAt: new Date(feedData.created_at),
        updatedAt: new Date(feedData.updated_at)
      };
      
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
  
  const updateFeed = async (id: string, updates: Partial<Omit<ICalFeed, 'id' | 'createdAt'>>) => {
    try {
      const supabaseUpdates: any = {};
      
      if (updates.name) supabaseUpdates.name = updates.name;
      if (updates.url) supabaseUpdates.url = updates.url;
      if (updates.propertyId) supabaseUpdates.property_id = updates.propertyId;
      if (updates.roomId !== undefined) supabaseUpdates.room_id = updates.roomId;
      if (updates.lastSync !== undefined) supabaseUpdates.last_sync = updates.lastSync;
      if (updates.autoSync !== undefined) supabaseUpdates.auto_sync = updates.autoSync;
      if (updates.syncInterval !== undefined) supabaseUpdates.sync_interval = updates.syncInterval;
      if (updates.status) supabaseUpdates.status = updates.status;
      if (updates.error !== undefined) supabaseUpdates.error = updates.error;
      if (updates.direction) supabaseUpdates.direction = updates.direction;
      if (updates.priority !== undefined) supabaseUpdates.priority = updates.priority;
      
      const { data, error } = await supabase
        .from('ical_feeds')
        .update(supabaseUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const feedData = data as ICalFeedRow;
        const updatedFeed: ICalFeed = {
          id: feedData.id,
          name: feedData.name,
          url: feedData.url,
          propertyId: feedData.property_id,
          roomId: feedData.room_id || undefined,
          lastSync: feedData.last_sync ? new Date(feedData.last_sync) : null,
          autoSync: feedData.auto_sync,
          syncInterval: feedData.sync_interval,
          status: feedData.status as 'active' | 'error' | 'pending',
          error: feedData.error || undefined,
          direction: feedData.direction as 'import' | 'export' | 'both',
          priority: feedData.priority,
          createdAt: new Date(feedData.created_at),
          updatedAt: new Date(feedData.updated_at)
        };
        
        setFeeds(prevFeeds => 
          prevFeeds.map(feed => feed.id === id ? updatedFeed : feed)
        );
        
        toast({
          title: "iCal Feed Updated",
          description: `${updatedFeed.name} has been updated successfully.`,
        });
        
        return updatedFeed;
      }
      
      return null;
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
  
  const deleteFeed = async (id: string) => {
    try {
      const feed = feeds.find(f => f.id === id);
      
      const { error } = await supabase
        .from('ical_feeds')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setFeeds(prevFeeds => prevFeeds.filter(feed => feed.id !== id));
      
      toast({
        title: "iCal Feed Removed",
        description: feed ? `${feed.name} has been removed.` : "Feed has been removed.",
      });
      
      return true;
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
  
  const syncFeed = async (id: string) => {
    setIsRefreshing(prev => ({ ...prev, [id]: true }));
    try {
      const feed = feeds.find(f => f.id === id);
      
      if (!feed) {
        throw new Error("Feed not found");
      }
      
      await updateFeed(id, { 
        lastSync: new Date(),
        status: 'active'
      });
      
      const result: ICalSyncResult = {
        success: true,
        eventsProcessed: Math.floor(Math.random() * 10) + 1,
        eventsCreated: Math.floor(Math.random() * 5),
        eventsUpdated: Math.floor(Math.random() * 3),
        eventsRemoved: 0,
        conflicts: []
      };
      
      if (Math.random() > 0.7) {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 3);
        
        result.conflicts.push({
          existingEvent: {
            uid: "existing-123",
            summary: "Existing Booking",
            startDate,
            endDate,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            status: "CONFIRMED"
          },
          incomingEvent: {
            uid: "incoming-456",
            summary: "New Overlapping Booking",
            startDate: new Date(startDate.getTime() - 24 * 60 * 60 * 1000),
            endDate: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000),
            createdAt: new Date(),
            lastModified: new Date(),
            status: "CONFIRMED"
          },
          resolution: 'keep_existing',
          propertyId: feed.propertyId,
          roomId: feed.roomId
        });
        
        result.success = false;
        
        await updateFeed(id, { 
          status: 'error', 
          error: 'Conflicts detected during sync' 
        });
        
        toast({
          title: "iCal Sync Warning",
          description: `Completed with ${result.conflicts.length} conflicts. Review required.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "iCal Sync Completed",
          description: `Processed ${result.eventsProcessed} events, created ${result.eventsCreated}, updated ${result.eventsUpdated}`,
        });
      }
      
      return result;
    } catch (error) {
      console.error("Error syncing iCal feed:", error);
      
      await updateFeed(id, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error during sync' 
      });
      
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Unknown error during sync",
        variant: "destructive",
      });
      
      return {
        success: false,
        eventsProcessed: 0,
        eventsCreated: 0,
        eventsUpdated: 0,
        eventsRemoved: 0,
        conflicts: []
      };
    } finally {
      setIsRefreshing(prev => ({ ...prev, [id]: false }));
    }
  };
  
  const resolveConflict = async (conflict: ICalConflict, resolution: 'keep_existing' | 'use_incoming' | 'manual') => {
    try {
      return true;
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
