
// This script generates a dynamic iCal feed based on query parameters
// It's designed to be served with text/calendar content type

// Get query parameters
const urlParams = new URLSearchParams(window.location.search);
const propertyId = urlParams.get('propertyId') || 'default';
const roomId = urlParams.get('roomId');
const t = urlParams.get('t'); // Cache-busting parameter

// Format date for iCal - YYYYMMDDTHHMMSSZ format
function formatICalDate(date) {
  return date.toISOString().replace(/[-:.]/g, '').split('Z')[0] + 'Z';
}

// Generate dynamic iCal content
function generateICalContent() {
  const now = new Date();
  
  // Create sample bookings (in a real implementation, this would fetch from your database)
  // First booking: starts 3 days from now, 2 days duration
  const booking1Start = new Date(now);
  booking1Start.setDate(booking1Start.getDate() + 3);
  const booking1End = new Date(booking1Start);
  booking1End.setDate(booking1End.getDate() + 2);
  
  // Second booking: starts 10 days from now, 3 days duration
  const booking2Start = new Date(now);
  booking2Start.setDate(booking2Start.getDate() + 10);
  const booking2End = new Date(booking2Start);
  booking2End.setDate(booking2End.getDate() + 3);
  
  // Construct the iCal string
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RiadSync//NONSGML Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    '',
    'BEGIN:VEVENT',
    `UID:booking-${propertyId}-1-${t}@riadsync.com`,
    `DTSTAMP:${formatICalDate(now)}`,
    `DTSTART:${formatICalDate(booking1Start)}`,
    `DTEND:${formatICalDate(booking1End)}`,
    `SUMMARY:${roomId ? `Room ${roomId}` : 'Property'} Booking`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    '',
    'BEGIN:VEVENT',
    `UID:booking-${propertyId}-2-${t}@riadsync.com`,
    `DTSTAMP:${formatICalDate(now)}`,
    `DTSTART:${formatICalDate(booking2Start)}`,
    `DTEND:${formatICalDate(booking2End)}`,
    `SUMMARY:${roomId ? `Room ${roomId}` : 'Property'} Booking`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    '',
    'END:VCALENDAR'
  ].join('\r\n');
}

// Output the calendar content directly
document.write(generateICalContent());
