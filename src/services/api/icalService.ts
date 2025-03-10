
import { toast } from "@/components/ui/use-toast";
import HttpClient from "./httpClient";
import { format, addDays, parseISO } from "date-fns";
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
      const feeds: ICalFeed[] = data.map(feed => ({
        id: feed.id,
        name: feed.name,
        url: feed.url,
        propertyId: feed.property_id,
        roomId: feed.room_id || undefined,
        lastSync: feed.last_sync ? new Date(feed.last_sync) : null,
        autoSync: feed.auto_sync,
        syncInterval: feed.sync_interval,
        status: feed.status as 'active' | 'error' | 'pending',
        error: feed.error,
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
      const feed: ICalFeed = {
        id: data.id,
        name: data.name,
        url: data.url,
        propertyId: data.property_id,
        roomId: data.room_id || undefined,
        lastSync: data.last_sync ? new Date(data.last_sync) : null,
        autoSync: data.auto_sync,
        syncInterval: data.sync_interval,
        status: data.status as 'active' | 'error' | 'pending',
        error: data.error,
        direction: data.direction as 'import' | 'export' | 'both',
        priority: data.priority,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
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
      const newFeed: ICalFeed = {
        id: data.id,
        name: data.name,
        url: data.url,
        propertyId: data.property_id,
        roomId: data.room_id || undefined,
        lastSync: data.last_sync ? new Date(data.last_sync) : null,
        autoSync: data.auto_sync,
        syncInterval: data.sync_interval,
        status: data.status as 'active' | 'error' | 'pending',
        error: data.error,
        direction: data.direction as 'import' | 'export' | 'both',
        priority: data.priority,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
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
      const updatedFeed: ICalFeed = {
        id: data.id,
        name: data.name,
        url: data.url,
        propertyId: data.property_id,
        roomId: data.room_id || undefined,
        lastSync: data.last_sync ? new Date(data.last_sync) : null,
        autoSync: data.auto_sync,
        syncInterval: data.sync_interval,
        status: data.status as 'active' | 'error' | 'pending',
        error: data.error,
        direction: data.direction as 'import' | 'export' | 'both',
        priority: data.priority,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
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
      // In a real implementation, we would fetch the iCal data from the URL
      // For demo purposes, we'll simulate this process
      await this.updateFeed(feedId, { status: 'active', lastSync: new Date() });

      // Simulate processing events
      const result: ICalSyncResult = {
        success: true,
        eventsProcessed: Math.floor(Math.random() * 10) + 1,
        eventsCreated: Math.floor(Math.random() * 5),
        eventsUpdated: Math.floor(Math.random() * 3),
        eventsRemoved: 0,
        conflicts: []
      };

      // Simulate a conflict occasionally
      if (Math.random() > 0.7) {
        const startDate = new Date();
        const endDate = addDays(startDate, 3);
        
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
            startDate: addDays(startDate, -1),
            endDate: addDays(startDate, 2),
            createdAt: new Date(),
            lastModified: new Date(),
            status: "CONFIRMED"
          },
          resolution: 'keep_existing',
          propertyId: feed.propertyId,
          roomId: feed.roomId
        });
        
        result.success = false;
      }

      if (!result.success) {
        await this.updateFeed(feedId, { status: 'error', error: 'Conflicts detected during sync' });
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
      console.error("iCal import error:", error);
      await this.updateFeed(feedId, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error during sync' 
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
    // Get the base URL, defaulting to the current origin if available
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://app.riadsync.com';
      
    // Format the path for the iCal file - use a valid .ics file path
    const path = roomId 
      ? `/api/ical/export/property/${propertyId}/room/${roomId}.ics` 
      : `/api/ical/export/property/${propertyId}.ics`;
    
    // Generate a secure token (in a real app, this would be a JWT or similar)
    const secureToken = this.generateSecureToken(propertyId, roomId);
    
    // Return the full URL with the token as a query parameter
    return `${baseUrl}${path}?token=${secureToken}`;
  }
  
  // Generate a secure token for the export URL
  private generateSecureToken(propertyId: string, roomId?: string): string {
    // In a real app, this would generate a proper secure token
    // For demo purposes, we'll create a simple hash-like string
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    const data = `${propertyId}${roomId || ''}${timestamp}`;
    
    // Simple "hash" by summing character codes and adding the timestamp
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    return `${Math.abs(hash).toString(16)}${random}${timestamp.toString(36)}`;
  }
  
  // Format a date for iCal format
  private formatICalDate(date: Date): string {
    // Format: 20210101T120000Z (YYYYMMDDTHHMMSSZ)
    return format(date, "yyyyMMdd'T'HHmmss'Z'");
  }
  
  // Parse iCal date format
  private parseICalDate(icalDate: string): Date {
    // Parse formats like: 20210101T120000Z
    // In a real implementation, handle timezone conversion
    try {
      const year = icalDate.substring(0, 4);
      const month = icalDate.substring(4, 6);
      const day = icalDate.substring(6, 8);
      const hour = icalDate.substring(9, 11);
      const minute = icalDate.substring(11, 13);
      const second = icalDate.substring(13, 15);
      
      return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
    } catch (error) {
      console.error("Error parsing iCal date:", error);
      return new Date();
    }
  }
  
  // Resolve conflicts between events
  resolveConflict(conflict: ICalConflict, resolution: 'keep_existing' | 'use_incoming' | 'manual'): Promise<boolean> {
    // In a real implementation, this would apply the resolution
    // For demo purposes, we'll just simulate success
    return Promise.resolve(true);
  }
  
  // Parse an iCal string into events
  parseICalString(icalString: string): ICalEvent[] {
    // In a real implementation, this would parse the iCal string
    // For demo purposes, we'll return empty array
    return [];
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
