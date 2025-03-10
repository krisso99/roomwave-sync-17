
import { format, parseISO, addMinutes } from 'date-fns';

/**
 * Formats a date for iCal format (YYYYMMDDTHHMMSSZ)
 * 
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatICalDate = (date: Date): string => {
  return format(date, "yyyyMMdd'T'HHmmss'Z'");
};

/**
 * Parses an iCal date string to a JavaScript Date object
 * 
 * @param icalDate Date string in iCal format (e.g., 20220101T120000Z)
 * @returns JavaScript Date object
 */
export const parseICalDate = (icalDate: string): Date => {
  // Handle formats like 20220101T120000Z
  try {
    // If it has a Z suffix, it's in UTC
    if (icalDate.endsWith('Z')) {
      const year = parseInt(icalDate.substring(0, 4));
      const month = parseInt(icalDate.substring(4, 6)) - 1; // JavaScript months are 0-based
      const day = parseInt(icalDate.substring(6, 8));
      const hour = parseInt(icalDate.substring(9, 11));
      const minute = parseInt(icalDate.substring(11, 13));
      const second = parseInt(icalDate.substring(13, 15));
      
      return new Date(Date.UTC(year, month, day, hour, minute, second));
    } 
    // No Z suffix, handle as local time with possible timezone offset
    else {
      // For formats without Z, but possibly with timezone offset like TZID
      // In a real implementation, we'd need to handle TZID parameters properly
      // For simplicity, we'll treat it as local time
      const dateString = icalDate.substring(0, 8);
      const timeString = icalDate.substring(9, 15);
      
      return parseISO(`${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}T${timeString.substring(0, 2)}:${timeString.substring(2, 4)}:${timeString.substring(4, 6)}`);
    }
  } catch (error) {
    console.error('Error parsing iCal date:', error);
    return new Date(); // Return current date as fallback
  }
};

/**
 * Adjusts a date for a specific timezone
 * 
 * @param date Date to adjust
 * @param timezone IANA timezone string (e.g., 'America/New_York')
 * @returns Adjusted date
 */
export const adjustDateForTimezone = (date: Date, timezone: string): Date => {
  // In a real implementation, we would use a library like date-fns-tz
  // For this demo, we'll do a simplified adjustment
  try {
    // Get the timezone offset in minutes
    // In a real implementation, this would use the provided timezone
    const localOffset = date.getTimezoneOffset();
    const targetOffset = getTimezoneOffset(timezone, date);
    
    // Adjust the date by the difference in offsets
    return addMinutes(date, localOffset - targetOffset);
  } catch (error) {
    console.error('Error adjusting date for timezone:', error);
    return date;
  }
};

/**
 * Gets the timezone offset in minutes for a specific timezone
 * 
 * @param timezone IANA timezone string (e.g., 'America/New_York')
 * @param date Date to get the offset for
 * @returns Timezone offset in minutes
 */
export const getTimezoneOffset = (timezone: string, date: Date): number => {
  // In a real implementation, we would use Intl or a timezone library
  // For this demo, we'll return approximate offsets for a few common timezones
  switch (timezone) {
    case 'America/New_York':
      return isDST(date, 'US') ? -240 : -300; // UTC-4 or UTC-5
    case 'America/Los_Angeles':
      return isDST(date, 'US') ? -420 : -480; // UTC-7 or UTC-8
    case 'Europe/London':
      return isDST(date, 'UK') ? -60 : 0; // UTC+1 or UTC
    case 'Europe/Paris':
      return isDST(date, 'EU') ? -120 : -60; // UTC+2 or UTC+1
    case 'Asia/Tokyo':
      return -540; // UTC+9 (no DST)
    case 'Australia/Sydney':
      return isDST(date, 'AU') ? -660 : -600; // UTC+11 or UTC+10
    default:
      return 0; // Default to UTC
  }
};

/**
 * Determines if a date is in Daylight Saving Time for a specific region
 * 
 * @param date Date to check
 * @param region Region code ('US', 'EU', 'UK', 'AU')
 * @returns True if the date is in DST
 */
export const isDST = (date: Date, region: 'US' | 'EU' | 'UK' | 'AU'): boolean => {
  // This is a simplified implementation
  // In a real application, use a proper timezone library
  const month = date.getMonth();
  
  switch (region) {
    case 'US':
      // March to November (approximate)
      return month > 2 && month < 11;
    case 'EU':
    case 'UK':
      // March to October (approximate)
      return month > 2 && month < 10;
    case 'AU':
      // October to April (southern hemisphere, approximate)
      return month < 4 || month > 9;
    default:
      return false;
  }
};

/**
 * Generates an iCal content string for a collection of events
 * 
 * @param events Array of events to include
 * @param calendarName Name of the calendar
 * @returns iCal format string
 */
export const generateICalContent = (
  events: Array<{
    uid: string;
    summary: string;
    description?: string;
    location?: string;
    startDate: Date;
    endDate: Date;
  }>,
  calendarName: string
): string => {
  const now = new Date();
  
  // Start the iCal content
  let icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//HotelManager//${calendarName}//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];
  
  // Add each event
  events.forEach(event => {
    icalContent = icalContent.concat([
      'BEGIN:VEVENT',
      `UID:${event.uid}`,
      `DTSTAMP:${formatICalDate(now)}`,
      `DTSTART:${formatICalDate(event.startDate)}`,
      `DTEND:${formatICalDate(event.endDate)}`,
      `SUMMARY:${event.summary}`,
      ...(event.description ? [`DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`] : []),
      ...(event.location ? [`LOCATION:${event.location}`] : []),
      'STATUS:CONFIRMED',
      'END:VEVENT',
    ]);
  });
  
  // End the iCal content
  icalContent.push('END:VCALENDAR');
  
  return icalContent.join('\r\n');
};

/**
 * Parses iCal content string into events
 * 
 * @param icalContent iCal format string
 * @returns Array of parsed events
 */
export const parseICalContent = (icalContent: string): Array<{
  uid: string;
  summary: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  status: string;
}> => {
  const events: Array<{
    uid: string;
    summary: string;
    description?: string;
    location?: string;
    startDate: Date;
    endDate: Date;
    status: string;
  }> = [];
  
  // Split the content into lines
  const lines = icalContent.split(/\r\n|\n|\r/);
  
  let inEvent = false;
  let currentEvent: {
    uid: string;
    summary: string;
    description?: string;
    location?: string;
    startDate: Date;
    endDate: Date;
    status: string;
  } | null = null;
  
  // Process each line
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      currentEvent = {
        uid: '',
        summary: '',
        startDate: new Date(),
        endDate: new Date(),
        status: 'CONFIRMED',
      };
    } else if (line === 'END:VEVENT') {
      inEvent = false;
      if (currentEvent) {
        events.push(currentEvent);
      }
      currentEvent = null;
    } else if (inEvent && currentEvent) {
      // Parse event properties
      if (line.startsWith('UID:')) {
        currentEvent.uid = line.substring(4);
      } else if (line.startsWith('SUMMARY:')) {
        currentEvent.summary = line.substring(8);
      } else if (line.startsWith('DESCRIPTION:')) {
        currentEvent.description = line.substring(12).replace(/\\n/g, '\n');
      } else if (line.startsWith('LOCATION:')) {
        currentEvent.location = line.substring(9);
      } else if (line.startsWith('DTSTART:')) {
        currentEvent.startDate = parseICalDate(line.substring(8));
      } else if (line.startsWith('DTEND:')) {
        currentEvent.endDate = parseICalDate(line.substring(6));
      } else if (line.startsWith('STATUS:')) {
        currentEvent.status = line.substring(7);
      }
    }
  }
  
  return events;
};
