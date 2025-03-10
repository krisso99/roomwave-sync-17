
<?php
// Set the content type for iCal file
header('Content-Type: text/calendar; charset=utf-8');
header('Content-Disposition: attachment; filename=calendar.ics');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

// Get query parameters
$propertyId = isset($_GET['propertyId']) ? $_GET['propertyId'] : 'default';
$roomId = isset($_GET['roomId']) ? $_GET['roomId'] : '';

// Log the parameters for debugging
error_log("iCal feed requested for property: $propertyId, room: $roomId");

// Format date for iCal - YYYYMMDDTHHMMSSZ format
function formatICalDate($timestamp) {
    return gmdate('Ymd\THis\Z', $timestamp);
}

// Get current time
$now = time();

// Create sample bookings - more realistic dates that show actual availability
// First booking: starts tomorrow, 3 days duration
$booking1Start = strtotime('+1 day', $now);
$booking1End = strtotime('+4 days', $now);

// Second booking: starts 7 days from now, 2 days duration
$booking2Start = strtotime('+7 days', $now);
$booking2End = strtotime('+9 days', $now);

// Generate the iCal content
$icalContent = "BEGIN:VCALENDAR\r\n";
$icalContent .= "VERSION:2.0\r\n";
$icalContent .= "PRODID:-//RiadSync//NONSGML Calendar//EN\r\n";
$icalContent .= "CALSCALE:GREGORIAN\r\n";
$icalContent .= "METHOD:PUBLISH\r\n";

// First event
$icalContent .= "BEGIN:VEVENT\r\n";
$icalContent .= "UID:booking-{$propertyId}-1@riadsync.com\r\n";
$icalContent .= "DTSTAMP:" . formatICalDate($now) . "\r\n";
$icalContent .= "DTSTART:" . formatICalDate($booking1Start) . "\r\n";
$icalContent .= "DTEND:" . formatICalDate($booking1End) . "\r\n";
$icalContent .= "SUMMARY:Booked\r\n";
$icalContent .= "STATUS:CONFIRMED\r\n";
$icalContent .= "END:VEVENT\r\n";

// Second event
$icalContent .= "BEGIN:VEVENT\r\n";
$icalContent .= "UID:booking-{$propertyId}-2@riadsync.com\r\n";
$icalContent .= "DTSTAMP:" . formatICalDate($now) . "\r\n";
$icalContent .= "DTSTART:" . formatICalDate($booking2Start) . "\r\n";
$icalContent .= "DTEND:" . formatICalDate($booking2End) . "\r\n";
$icalContent .= "SUMMARY:Booked\r\n";
$icalContent .= "STATUS:CONFIRMED\r\n";
$icalContent .= "END:VEVENT\r\n";

$icalContent .= "END:VCALENDAR";

// Output the calendar content
echo $icalContent;
?>
