
// API endpoint to serve iCal data
import { NextApiRequest, NextApiResponse } from 'next';
import { icalService } from '@/services/api/icalService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set content type to iCal format
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="calendar.ics"');
  
  try {
    // Extract the resource ID from the URL
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid calendar ID');
    }
    
    // Remove the .ics extension if present
    const resourceIdEncoded = id.replace(/\.ics$/i, '');
    
    // Decode the resource information
    let resourceInfo;
    try {
      // Convert URL-safe Base64 back to regular Base64
      const base64 = resourceIdEncoded
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      
      // Parse the JSON data
      resourceInfo = JSON.parse(atob(base64));
    } catch (error) {
      console.error("Error decoding resource info:", error);
      throw new Error('Invalid calendar identifier');
    }
    
    // Extract property and room IDs
    const { propertyId, roomId } = resourceInfo;
    
    if (!propertyId) {
      throw new Error('Missing property identifier');
    }
    
    // Generate the iCal content
    const icalContent = await icalService.exportICalFeed({
      propertyId,
      roomId,
      periodStart: new Date(),
      periodEnd: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    });
    
    // Return the iCal data
    return res.status(200).send(icalContent);
  } catch (error) {
    console.error('iCal generation error:', error);
    
    // Even if there's an error, return a basic valid iCal file
    // This prevents platforms from immediately rejecting the feed
    const fallbackContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Our Platform//NONSGML Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:error-notification@example.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTEND:${new Date(Date.now() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      'SUMMARY:Error - Contact Support',
      'DESCRIPTION:There was an error generating this calendar feed. Please contact support.',
      'STATUS:TENTATIVE',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    return res.status(200).send(fallbackContent);
  }
}
