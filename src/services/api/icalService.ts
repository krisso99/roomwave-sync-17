import { toast } from "@/components/ui/use-toast";
import HttpClient from "./httpClient";
import { format, addDays, parseISO } from "date-fns";

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

// In-memory storage for demo purposes
// In a real app, this would be persisted in a database
let icalFeeds: ICalFeed[] = [
  {
    id: "1",
    name: "Airbnb Calendar",
    url: "https://www.airbnb.com/calendar/ical/12345.ics",
    propertyId: "property-1",
    lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    autoSync: true,
    syncInterval: 60, // every hour
    status: 'active',
    direction: 'import',
    priority: 2,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: "2",
    name: "Booking.com Calendar",
    url: "https://admin.booking.com/hotel/ical/12345.ics",
    propertyId: "property-1",
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    autoSync: true,
    syncInterval: 120, // every 2 hours
    status: 'active',
    direction: 'import',
    priority: 3,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "3",
    name: "Vrbo Calendar",
    url: "https://www.vrbo.com/calendar/ical/12345.ics",
    propertyId: "property-1",
    lastSync: null, // never synced
    autoSync: false,
    syncInterval: 360, // every 6 hours
    status: 'pending',
    direction: 'import',
    priority: 1,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: "4",
    name: "Property Export Feed",
    url: "https://app.ourplatform.com/ical/export/property1.ics",
    propertyId: "property-1",
    lastSync: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    autoSync: true,
    syncInterval: 720, // every 12 hours
    status: 'active',
    direction: 'export',
    priority: 4,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
  }
];

// Simulated events for the demo
let icalEvents: ICalEvent[] = [];

// Class to handle iCal feed operations
export class ICalService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient('');
  }

  // Get all iCal feeds
  async getFeeds(propertyId?: string): Promise<ICalFeed[]> {
    // In a real app, this would fetch from a database
    if (propertyId) {
      return icalFeeds.filter(feed => feed.propertyId === propertyId);
    }
    return [...icalFeeds];
  }

  // Get a single iCal feed by ID
  async getFeed(id: string): Promise<ICalFeed | null> {
    // In a real app, this would fetch from a database
    const feed = icalFeeds.find(feed => feed.id === id);
    return feed ? { ...feed } : null;
  }

  // Create a new iCal feed
  async createFeed(feed: Omit<ICalFeed, 'id' | 'createdAt' | 'updatedAt' | 'lastSync' | 'status'>): Promise<ICalFeed> {
    // In a real app, this would save to a database
    const newFeed: ICalFeed = {
      ...feed,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSync: null,
      status: 'pending'
    };

    icalFeeds.push(newFeed);
    return { ...newFeed };
  }

  // Update an existing iCal feed
  async updateFeed(id: string, updates: Partial<Omit<ICalFeed, 'id' | 'createdAt'>>): Promise<ICalFeed | null> {
    // In a real app, this would update in a database
    const index = icalFeeds.findIndex(feed => feed.id === id);
    if (index === -1) return null;

    const updatedFeed = {
      ...icalFeeds[index],
      ...updates,
      updatedAt: new Date()
    };

    icalFeeds[index] = updatedFeed;
    return { ...updatedFeed };
  }

  // Delete an iCal feed
  async deleteFeed(id: string): Promise<boolean> {
    // In a real app, this would delete from a database
    const initialLength = icalFeeds.length;
    icalFeeds = icalFeeds.filter(feed => feed.id !== id);
    return initialLength !== icalFeeds.length;
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
    // Get the base URL, defaulting to the current origin
    const baseUrl = window.location.origin;
    const path = roomId 
      ? `/api/ical/export/property/${propertyId}/room/${roomId}.ics` 
      : `/api/ical/export/property/${propertyId}.ics`;
    
    // Add a token for security (in a real app this would be a valid token)
    const secureToken = Date.now().toString(36) + Math.random().toString(36).substring(2);
    return `${baseUrl}${path}?token=${secureToken}`;
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
