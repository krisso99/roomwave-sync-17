
// Dynamic iCal generator endpoint for property/room calendar exports
// This file handles requests from external platforms like Airbnb

// Set proper content headers for iCal format
document.contentType = 'text/calendar';
document.charset = 'utf-8';

// Get query parameters
const urlParams = new URLSearchParams(window.location.search);
const propertyId = urlParams.get('propertyId') || 'default-property';
const roomId = urlParams.get('roomId');

// Generate iCal content based on property/room
const generateIcal = (propertyId, roomId) => {
  const now = new Date();
  
  // Format date for iCal - YYYYMMDDTHHMMSSZ
  const formatICalDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  // In a real implementation, you would fetch actual bookings from your database
  // For demonstration, we're creating sample bookings
  const bookings = [
    {
      id: `booking-123-${propertyId}`,
      startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days in future
      endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),  // 10 days in future
      summary: roomId ? `Room ${roomId} Booked` : 'Property Booked'
    },
    {
      id: `booking-456-${propertyId}`,
      startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days in future
      endDate: new Date(now.getTime() + 17 * 24 * 60 * 60 * 1000),   // 17 days in future
      summary: roomId ? `Room ${roomId} Booked` : 'Property Booked'
    }
  ];

  // Generate iCal header
  let icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RiadSync//NONSGML Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  // Add each booking as an event
  bookings.forEach(booking => {
    icalContent = icalContent.concat([
      'BEGIN:VEVENT',
      `UID:${booking.id}@riadsync.com`,
      `DTSTAMP:${formatICalDate(now)}`,
      `DTSTART:${formatICalDate(booking.startDate)}`,
      `DTEND:${formatICalDate(booking.endDate)}`,
      `SUMMARY:${booking.summary}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    ]);
  });

  // Close the calendar
  icalContent.push('END:VCALENDAR');
  
  return icalContent.join('\r\n');
};

// Generate the iCal content
const icalContent = generateIcal(propertyId, roomId);

// Output the calendar content
document.write(icalContent);
