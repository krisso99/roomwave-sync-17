
// Get query parameters
const urlParams = new URLSearchParams(window.location.search);
const propertyId = urlParams.get('propertyId');
const roomId = urlParams.get('roomId');

// Generate iCal content
function generateICalContent() {
  const now = new Date();
  const formatDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';
  };
  
  const startDate = now;
  const endDate = new Date(now);
  endDate.setDate(now.getDate() + 3);
  
  const secondStartDate = new Date(now);
  secondStartDate.setDate(now.getDate() + 5);
  const secondEndDate = new Date(secondStartDate);
  secondEndDate.setDate(secondStartDate.getDate() + 2);
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//RiadSync//NONSGML Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:booking-${propertyId}-1@riadsync.com
DTSTAMP:${formatDate(now)}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Room Booked${roomId ? ' - Room ' + roomId : ''}
STATUS:CONFIRMED
END:VEVENT
BEGIN:VEVENT
UID:booking-${propertyId}-2@riadsync.com
DTSTAMP:${formatDate(now)}
DTSTART:${formatDate(secondStartDate)}
DTEND:${formatDate(secondEndDate)}
SUMMARY:Room Booked${roomId ? ' - Room ' + roomId : ''}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
}

// Output the iCal content
document.write(generateICalContent());
