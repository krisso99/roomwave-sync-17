
import React from 'react';
import { AlertCircle, Clock, Globe, Calendar, Info } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const ICalLimitations: React.FC = () => {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>iCal Integration Limitations</AlertTitle>
        <AlertDescription>
          iCal feeds have several limitations compared to direct API integrations. 
          Please review the information below to understand these limitations.
        </AlertDescription>
      </Alert>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="sync-frequency">
          <AccordionTrigger className="text-sm font-medium">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Synchronization Frequency
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm">
              <p>
                Unlike direct API connections, which can sync in near real-time, iCal feeds have inherent delays:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Many platforms cache iCal feeds for 30 minutes to 24 hours</li>
                <li>Our system can only detect changes when it checks the feed</li>
                <li>Last-minute bookings may not be reflected immediately</li>
                <li>Cancellations may take longer to propagate through the system</li>
              </ul>
              <div className="mt-2 p-2 bg-blue-50 rounded-md">
                <p className="text-blue-700 text-xs">
                  <Info className="h-3 w-3 inline mr-1" />
                  Recommendation: Configure high-priority feeds to sync more frequently (e.g., every 15-30 minutes)
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="missing-info">
          <AccordionTrigger className="text-sm font-medium">
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Limited Information
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm">
              <p>
                iCal feeds contain minimal information compared to API integrations:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Guest names may be partial, anonymized, or missing entirely</li>
                <li>Contact information is typically not included</li>
                <li>Special requests and preferences aren't transferred</li>
                <li>Payment information and amounts are not included</li>
                <li>Booking channel and referral source may be missing</li>
              </ul>
              <div className="mt-2 p-2 bg-blue-50 rounded-md">
                <p className="text-blue-700 text-xs">
                  <Info className="h-3 w-3 inline mr-1" />
                  Recommendation: Use direct API connections for platforms that provide them, and use iCal as a fallback option
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="timezone-issues">
          <AccordionTrigger className="text-sm font-medium">
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Timezone Inconsistencies
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm">
              <p>
                Timezone handling in iCal feeds can be problematic:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Some platforms export in UTC while others use local time</li>
                <li>Timezone information may be missing or incorrectly formatted</li>
                <li>Daylight saving time transitions can cause off-by-one-day errors</li>
                <li>Midnight check-ins/check-outs may shift days during conversion</li>
              </ul>
              <div className="mt-2 p-2 bg-blue-50 rounded-md">
                <p className="text-blue-700 text-xs">
                  <Info className="h-3 w-3 inline mr-1" />
                  Recommendation: Monitor bookings closely during timezone changes and daylight saving transitions
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="conflict-resolution">
          <AccordionTrigger className="text-sm font-medium">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Conflict Resolution Challenges
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm">
              <p>
                When multiple calendars conflict, resolution can be difficult:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>No standardized way to determine which booking came first</li>
                <li>Limited metadata for making intelligent resolution decisions</li>
                <li>Manual intervention is often required to resolve conflicts</li>
                <li>Risk of double-bookings if not monitored carefully</li>
              </ul>
              <div className="mt-2 p-2 bg-blue-50 rounded-md">
                <p className="text-blue-700 text-xs">
                  <Info className="h-3 w-3 inline mr-1" />
                  Recommendation: Establish clear priority rules for your feed sources and monitor conflict alerts
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="px-4 py-3 bg-gray-50 rounded-lg border text-center">
        <h4 className="text-sm font-medium mb-2">Need More Reliable Synchronization?</h4>
        <p className="text-sm text-muted-foreground mb-3">
          For improved reliability and more detailed booking data, consider using direct API integrations when available.
        </p>
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          View API Integration Options
        </Button>
      </div>
    </div>
  );
};

export default ICalLimitations;
