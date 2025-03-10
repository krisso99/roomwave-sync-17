
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
$t = isset($_GET['t']) ? $_GET['t'] : time(); // Cache-busting parameter

// Format date for iCal - YYYYMMDDTHHMMSSZ format
function formatICalDate($timestamp) {
    return gmdate('Ymd\THis\Z', $timestamp);
}

// Get current time
$now = time();

// Create sample bookings
// First booking: starts 3 days from now, 2 days duration
$booking1Start = $now + (3 * 24 * 60 * 60);
$booking1End = $booking1Start + (2 * 24 * 60 * 60);

// Second booking: starts 10 days from now, 3 days duration
$booking2Start = $now + (10 * 24 * 60 * 60);
$booking2End = $booking2Start + (3 * 24 * 60 * 60);

// Generate the iCal content
$icalContent = "BEGIN:VCALENDAR\r\n";
$icalContent .= "VERSION:2.0\r\n";
$icalContent .= "PRODID:-//RiadSync//NONSGML Calendar//EN\r\n";
$icalContent .= "CALSCALE:GREGORIAN\r\n";
$icalContent .= "METHOD:PUBLISH\r\n";

// First event
$icalContent .= "BEGIN:VEVENT\r\n";
$icalContent .= "UID:booking-{$propertyId}-1-{$t}@riadsync.com\r\n";
$icalContent .= "DTSTAMP:" . formatICalDate($now) . "\r\n";
$icalContent .= "DTSTART:" . formatICalDate($booking1Start) . "\r\n";
$icalContent .= "DTEND:" . formatICalDate($booking1End) . "\r\n";
$icalContent .= "SUMMARY:" . ($roomId ? "Room {$roomId}" : "Property") . " Booking\r\n";
$icalContent .= "STATUS:CONFIRMED\r\n";
$icalContent .= "END:VEVENT\r\n";

// Second event
$icalContent .= "BEGIN:VEVENT\r\n";
$icalContent .= "UID:booking-{$propertyId}-2-{$t}@riadsync.com\r\n";
$icalContent .= "DTSTAMP:" . formatICalDate($now) . "\r\n";
$icalContent .= "DTSTART:" . formatICalDate($booking2Start) . "\r\n";
$icalContent .= "DTEND:" . formatICalDate($booking2End) . "\r\n";
$icalContent .= "SUMMARY:" . ($roomId ? "Room {$roomId}" : "Property") . " Booking\r\n";
$icalContent .= "STATUS:CONFIRMED\r\n";
$icalContent .= "END:VEVENT\r\n";

$icalContent .= "END:VCALENDAR";

// Output the calendar content
echo $icalContent;
?>
