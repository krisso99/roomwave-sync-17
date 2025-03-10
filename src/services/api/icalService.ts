import { toast } from "@/components/ui/use-toast";
import HttpClient from "./httpClient";
import { format, addDays, parseISO, parse, isBefore, isAfter } from "date-fns";
import { supabase } from '@/integrations/supabase/client';

// Types for iCal feed configuration
export interface ICalFeed {
  id: string;
  name: string;
  url: string;
  propertyId: string;
  roomId?: string;
  lastSync: Date | null;
  autoSync: boolean;
  syncInterval: number; // in minutes
  status: 'active' | 'error' | 'pending';
  error?: string;
  direction: 'import' | 'export' | 'both';
  priority: number; // Higher number = higher priority for conflict resolution
  createdAt: Date;
  updatedAt: Date;
}

// Define interface for the iCal feed table row
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

export interface ICalEvent {
  uid: string;
  summary: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  lastModified: Date;
  status: string;
  organizer?: string;
}

export interface ICalSyncResult {
  success: boolean;
  eventsProcessed: number;
  eventsCreated: number;
  eventsUpdated: number;
  eventsRemoved: number;
  conflicts: ICalConflict[];
}

export interface ICalConflict {
  existingEvent: ICalEvent;
  incomingEvent: ICalEvent;
  resolution: 'keep_existing' | 'use_incoming' | 'manual';
  propertyId: string;
  roomId?: string;
}

export interface ICalExportOptions {
  propertyId: string;
  roomId?: string;
  includeGuests?: boolean;
  includeNotes?: boolean;
  periodStart?: Date;
  periodEnd?: Date;
}

// Class to handle iCal feed operations
export class ICalService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient('');
  }

  // Get all iCal feeds from Supabase
  async getFeeds(propertyId?: string): Promise<ICalFeed[]> {
    try {
      let query = supabase.from('ical_feeds').select('*');
      
      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Convert the Supabase data to ICalFeed objects
      const feeds: ICalFeed[] = (data as ICalFeedRow[]).map(feed => ({
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
      
      return feeds;
    } catch (error) {
      console.error("Error fetching iCal feeds:", error);
      throw error;
    }
  }

  // Get a single iCal feed by ID from Supabase
  async getFeed(id: string): Promise<ICalFeed | null> {
    try {
      const { data, error } = await supabase
        .from('ical_feeds')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        return null;
      }
      
      // Convert the Supabase data to an ICalFeed object
      const feedData = data as ICalFeedRow;
      const feed: ICalFeed = {
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
      
      return feed;
    } catch (error) {
      console.error("Error fetching iCal feed:", error);
      return null;
    }
  }

  // Create a new iCal feed in Supabase
  async createFeed(feed: Omit<ICalFeed, 'id' | 'createdAt' | 'updatedAt' | 'lastSync' | 'status'>): Promise<ICalFeed> {
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
      
      // Convert the Supabase data to an ICalFeed object
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
      
      return newFeed;
    } catch (error) {
      console.error("Error creating iCal feed:", error);
      throw error;
    }
  }

  // Update an existing iCal feed in Supabase
  async updateFeed(id: string, updates: Partial<Omit<ICalFeed, 'id' | 'createdAt'>>): Promise<ICalFeed | null> {
    try {
      // Convert the ICalFeed updates to the Supabase column names
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
      
      if (!data) {
        return null;
      }
      
      // Convert the Supabase data to an ICalFeed object
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
      
      return updatedFeed;
    } catch (error) {
      console.error("Error updating iCal feed:", error);
      return null;
    }
  }

  // Delete an iCal feed from Supabase
  async deleteFeed(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ical_feeds')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting iCal feed:", error);
      return false;
    }
  }

  // Import iCal data from a URL
  async importICalFeed(feedId: string): Promise<ICalSyncResult> {
    const feed = await this.getFeed(feedId);
    if (!feed) {
      throw new Error("iCal feed not found");
    }

    try {
      // Update the feed status to indicate sync in progress
      await this.updateFeed(feedId, { status: 'pending' });
      
      // Fetch the iCal data from the URL
      const response = await fetch(feed.url, {
        headers: {
          'Accept': 'text/calendar',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch iCal data: ${response.status} ${response.statusText}`);
      }
      
      const icalContent = await response.text();
      
      // Parse the iCal data
      const events = this.parseICalString(icalContent);
      
      console.log(`Parsed ${events.length} events from iCal feed`);
      
      // Process the events
      // For now, we'll simulate this by just storing the number of events
      const result: ICalSyncResult = {
        success: true,
        eventsProcessed: events.length,
        eventsCreated: events.length, // Simulate all events being new
        eventsUpdated: 0,
        eventsRemoved: 0,
        conflicts: []
      };
      
      // Check for conflicts
      const conflicts = this.detectConflicts(events, feed.propertyId, feed.roomId);
      
      if (conflicts.length > 0) {
        result.conflicts = conflicts;
        result.success = false;
        
        await this.updateFeed(feedId, { 
          status: 'error', 
          error: 'Conflicts detected during sync',
          lastSync: new Date()
        });
        
        toast({
          title: "iCal Sync Warning",
          description: `Completed with ${conflicts.length} conflicts. Review required.`,
          variant: "destructive",
        });
      } else {
        await this.updateFeed(feedId, { 
          status: 'active',
          error: undefined,
          lastSync: new Date()
        });
        
        toast({
          title: "iCal Sync Completed",
          description: `Processed ${result.eventsProcessed} events, created ${result.eventsCreated}, updated ${result.eventsUpdated}`,
        });
      }
      
      return result;
    } catch (error) {
      console.error("iCal import error:", error);
      
      await this.updateFeed(feedId, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error during sync',
        lastSync: new Date()
      });
      
      toast({
        title: "iCal Sync Failed",
        description: error instanceof Error ? error.message : 'Unknown error during sync',
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
    }
  }

  // Detect conflicts between events
  private detectConflicts(events: ICalEvent[], propertyId: string, roomId?: string): ICalConflict[] {
    // In a real implementation, this would check against existing bookings
    // For demo purposes, we'll just simulate conflicts
    const conflicts: ICalConflict[] = [];
    
    if (events.length > 0 && Math.random() > 0.6) {
      // Simulate a conflict with the first event
      const conflictEvent = events[0];
      
      // Create a simulated existing event that overlaps
      const existingEvent: ICalEvent = {
        uid: "existing-123",
        summary: "Existing Booking",
        startDate: new Date(conflictEvent.startDate.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days before
        endDate: new Date(conflictEvent.startDate.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day after start
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Created a week ago
        lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: "CONFIRMED"
      };
      
      conflicts.push({
        existingEvent,
        incomingEvent: conflictEvent,
        resolution: 'keep_existing',
        propertyId,
        roomId
      });
    }
    
    return conflicts;
  }

  // Export bookings as iCal
  async exportICalFeed(options: ICalExportOptions): Promise<string> {
    // In a real implementation, this would generate an iCal file from your bookings
    // For demo purposes, we'll return a sample iCal string
    
    const now = new Date();
    const startDate = options.periodStart || now;
    const endDate = options.periodEnd || addDays(now, 30);
    
    // Generate a basic iCal file
    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Our Platform//NONSGML Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      // Sample event 1
      'BEGIN:VEVENT',
      `UID:booking-123@ourplatform.com`,
      `DTSTAMP:${this.formatICalDate(now)}`,
      `DTSTART:${this.formatICalDate(startDate)}`,
      `DTEND:${this.formatICalDate(addDays(startDate, 2))}`,
      'SUMMARY:Room Booked',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      // Sample event 2
      'BEGIN:VEVENT',
      `UID:booking-456@ourplatform.com`,
      `DTSTAMP:${this.formatICalDate(now)}`,
      `DTSTART:${this.formatICalDate(addDays(startDate, 5))}`,
      `DTEND:${this.formatICalDate(addDays(startDate, 8))}`,
      'SUMMARY:Room Booked',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    return icalContent;
  }
  
  // Generate a unique export URL for a property or room
  generateExportUrl(propertyId: string, roomId?: string): string {
    try {
      // Get the base URL for our application
      const baseUrl = this.getBaseUrl();
      
      // For Airbnb compatibility, always use direct .ics file extension
      // This creates a clean URL that ends with .ics as required by Airbnb
      let url = '';
      
      // Remove any existing "property-" prefix to avoid duplication
      const cleanPropertyId = propertyId.replace(/^property-/, '');
      
      if (roomId) {
        url = `${baseUrl}/api/ical/room-${roomId}-property-${cleanPropertyId}.ics`;
      } else {
        url = `${baseUrl}/api/ical/property-${cleanPropertyId}.ics`;
      }
      
      // Our .htaccess rewrite rule will handle directing this to the PHP script
      // No query parameters in the URL for better compatibility with Airbnb
      
      return url;
    } catch (error) {
      console.error("Error generating iCal URL:", error);
      // Fallback to the static sample file if anything goes wrong
      return `${this.getBaseUrl()}/api/ical/sample.ics`;
    }
  }
  
  // Get the base URL of the application
  private getBaseUrl(): string {
    return typeof window !== 'undefined' 
      ? window.location.origin
      : 'https://app.riadsync.com';
  }
  
  // Format a date for iCal format
  private formatICalDate(date: Date): string {
    // Format: 20210101T120000Z (YYYYMMDDTHHMMSSZ)
    return format(date, "yyyyMMdd'T'HHmmss'Z'");
  }
  
  // Parse iCal date format
  private parseICalDate(icalDate: string): Date {
    // Parse formats like: 20210101T120000Z
    try {
      if (icalDate.indexOf('Z') !== -1) {
        // UTC date
        return parse(icalDate, "yyyyMMdd'T'HHmmss'Z'", new Date());
      } else {
        // Local date
        return parse(icalDate, "yyyyMMdd'T'HHmmss", new Date());
      }
    } catch (error) {
      console.error("Error parsing iCal date:", error, icalDate);
      return new Date();
    }
  }
  
  // Parse an iCal string into events
  parseICalString(icalString: string): ICalEvent[] {
    try {
      const events: ICalEvent[] = [];
      const lines = icalString.split(/\r\n|\n|\r/);
      
      let currentEvent: Partial<ICalEvent> | null = null;
      let inEvent = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Handle line folding (continued lines start with a space)
        if (i > 0 && (lines[i].startsWith(' ') || lines[i].startsWith('\t'))) {
          // This is a continuation of the previous line
          continue;
        }
        
        if (line === 'BEGIN:VEVENT') {
          inEvent = true;
          currentEvent = {
            createdAt: new Date(),
            lastModified: new Date(),
            status: 'CONFIRMED'
          };
        } else if (line === 'END:VEVENT' && currentEvent) {
          inEvent = false;
          
          // Only add the event if it has all required fields
          if (currentEvent.uid && currentEvent.startDate && currentEvent.endDate && currentEvent.summary) {
            events.push(currentEvent as ICalEvent);
          } else {
            console.warn('Skipping incomplete event:', currentEvent);
          }
          
          currentEvent = null;
        } else if (inEvent && currentEvent) {
          // Process event properties
          if (line.startsWith('UID:')) {
            currentEvent.uid = line.substring(4);
          } else if (line.startsWith('SUMMARY:')) {
            currentEvent.summary = line.substring(8);
          } else if (line.startsWith('DESCRIPTION:')) {
            currentEvent.description = line.substring(12);
          } else if (line.startsWith('LOCATION:')) {
            currentEvent.location = line.substring(9);
          } else if (line.startsWith('DTSTART:')) {
            currentEvent.startDate = this.parseICalDate(line.substring(8));
          } else if (line.startsWith('DTEND:')) {
            currentEvent.endDate = this.parseICalDate(line.substring(6));
          } else if (line.startsWith('CREATED:')) {
            currentEvent.createdAt = this.parseICalDate(line.substring(8));
          } else if (line.startsWith('LAST-MODIFIED:')) {
            currentEvent.lastModified = this.parseICalDate(line.substring(14));
          } else if (line.startsWith('STATUS:')) {
            currentEvent.status = line.substring(7);
          } else if (line.startsWith('ORGANIZER:')) {
            currentEvent.organizer = line.substring(10);
          }
        }
      }
      
      return events;
    } catch (error) {
      console.error("Error parsing iCal string:", error);
      return [];
    }
  }
  
  // Resolve conflicts between events
  resolveConflict(conflict: ICalConflict, resolution: 'keep_existing' | 'use_incoming' | 'manual'): Promise<boolean> {
    // In a real implementation, this would apply the resolution
    // For demo purposes, we'll just simulate success
    return Promise.resolve(true);
  }
  
  // Start auto-sync for a feed
  async startAutoSync(feedId: string): Promise<boolean> {
    const feed = await this.getFeed(feedId);
    if (!feed || !feed.autoSync) return false;
    
    // In a real implementation, this would set up a recurring job
    // For demo purposes, we'll just update the feed status
    await this.updateFeed(feedId, { status: 'active' });
    return true;
  }
  
  // Stop auto-sync for a feed
  async stopAutoSync(feedId: string): Promise<boolean> {
    // In a real implementation, this would cancel the recurring job
    const feed = await this.getFeed(feedId);
    if (!feed) return false;
    
    await this.updateFeed(feedId, { autoSync: false });
    return true;
  }
}

// Create and export a singleton instance
export const icalService = new ICalService();
