
// Simple API endpoint to generate iCal files
// Since this is placed in the public folder, it will be directly accessible

const generateIcal = (propertyId, roomId) => {
  const now = new Date();
  const startDate = now;
  const endDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days in future
  
  // Format date for iCal - YYYYMMDDTHHMMSSZ
  const formatICalDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  // Generate a basic iCal file
  const icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RiadSync//NONSGML Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    // Sample event 1
    'BEGIN:VEVENT',
    `UID:booking-123-${propertyId}@riadsync.com`,
    `DTSTAMP:${formatICalDate(now)}`,
    `DTSTART:${formatICalDate(startDate)}`,
    `DTEND:${formatICalDate(new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000))}`,
    'SUMMARY:Room Booked',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    // Sample event 2
    'BEGIN:VEVENT',
    `UID:booking-456-${propertyId}@riadsync.com`,
    `DTSTAMP:${formatICalDate(now)}`,
    `DTSTART:${formatICalDate(new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000))}`,
    `DTEND:${formatICalDate(new Date(startDate.getTime() + 8 * 24 * 60 * 60 * 1000))}`,
    'SUMMARY:Room Booked',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  
  return icalContent;
};

// Get query parameters
const urlParams = new URLSearchParams(window.location.search);
const propertyId = urlParams.get('propertyId') || 'default-property';
const roomId = urlParams.get('roomId');

// Generate the iCal content
const icalContent = generateIcal(propertyId, roomId);

// Set content type and output
document.body.innerHTML = '';
const pre = document.createElement('pre');
pre.textContent = icalContent;
document.body.appendChild(pre);

// Auto-download functionality
const downloadLink = document.createElement('a');
downloadLink.style.display = 'none';
downloadLink.setAttribute('href', 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icalContent));
downloadLink.setAttribute('download', 'calendar.ics');
document.body.appendChild(downloadLink);
downloadLink.click();
document.body.removeChild(downloadLink);
