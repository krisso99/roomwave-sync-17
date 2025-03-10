
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Helper function to copy text to clipboard
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast({
    title: "Copied to clipboard",
    description: "The code sample has been copied to your clipboard.",
  });
};

const MakeCodeSamples: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Make Integration Code Samples</CardTitle>
        <CardDescription>
          Reference code samples for Make scenario modules
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="webhook-json" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="webhook-json">Webhook JSON Templates</TabsTrigger>
            <TabsTrigger value="data-transformations">Data Transformations</TabsTrigger>
            <TabsTrigger value="error-handling">Error Handling</TabsTrigger>
          </TabsList>
          
          <TabsContent value="webhook-json" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-md font-medium">Availability Update JSON</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(availabilityJSON)}
                  className="h-7"
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-60">
                {availabilityJSON}
              </pre>
              
              <Separator />
              
              <div className="flex justify-between items-start">
                <h3 className="text-md font-medium">Rate Update JSON</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(rateJSON)}
                  className="h-7"
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-60">
                {rateJSON}
              </pre>
              
              <Separator />
              
              <div className="flex justify-between items-start">
                <h3 className="text-md font-medium">Booking Creation JSON</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(bookingJSON)}
                  className="h-7"
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-60">
                {bookingJSON}
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="data-transformations" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-md font-medium">Booking.com to Standard Format</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(bookingComTransform)}
                  className="h-7"
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-60">
                {bookingComTransform}
              </pre>
              
              <Separator />
              
              <div className="flex justify-between items-start">
                <h3 className="text-md font-medium">Airbnb to Standard Format</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(airbnbTransform)}
                  className="h-7"
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-60">
                {airbnbTransform}
              </pre>
              
              <Separator />
              
              <div className="flex justify-between items-start">
                <h3 className="text-md font-medium">VRBO/Expedia to Standard Format</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(vrboTransform)}
                  className="h-7"
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-60">
                {vrboTransform}
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="error-handling" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-md font-medium">Rate Limit Detection & Retry</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(rateLimitHandling)}
                  className="h-7"
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-60">
                {rateLimitHandling}
              </pre>
              
              <Separator />
              
              <div className="flex justify-between items-start">
                <h3 className="text-md font-medium">Error Notification Template</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(errorNotification)}
                  className="h-7"
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-60">
                {errorNotification}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// JSON Templates
const availabilityJSON = `{
  "propertyId": "{{1.property_id}}",
  "roomId": "{{1.room_id}}",
  "dates": [
    {
      "date": "{{formatDate(1.start_date, 'YYYY-MM-DD')}}",
      "available": {{1.is_available}},
      "channel": "{{1.channel_name}}"
    },
    {
      "date": "{{formatDate(addDays(1.start_date, 1), 'YYYY-MM-DD')}}",
      "available": {{2.is_available}},
      "channel": "{{1.channel_name}}"
    }
  ],
  "syncId": "{{1.batch_id}}"
}`;

const rateJSON = `{
  "propertyId": "{{1.property_id}}",
  "roomId": "{{1.room_id}}",
  "rates": [
    {
      "date": "{{formatDate(1.date, 'YYYY-MM-DD')}}",
      "amount": {{1.rate_amount}},
      "currency": "{{1.currency}}",
      "channel": "{{1.channel_name}}"
    },
    {
      "date": "{{formatDate(addDays(1.date, 1), 'YYYY-MM-DD')}}",
      "amount": {{2.rate_amount}},
      "currency": "{{1.currency}}",
      "channel": "{{1.channel_name}}"
    }
  ],
  "syncId": "{{1.batch_id}}"
}`;

const bookingJSON = `{
  "propertyId": "{{1.hotel_id}}",
  "roomId": "{{1.room_id}}",
  "guest": {
    "firstName": "{{1.guest.first_name}}",
    "lastName": "{{1.guest.last_name}}",
    "email": "{{1.guest.email}}",
    "phone": "{{1.guest.phone}}"
  },
  "dates": {
    "checkIn": "{{formatDate(1.check_in_date, 'YYYY-MM-DD')}}",
    "checkOut": "{{formatDate(1.check_out_date, 'YYYY-MM-DD')}}"
  },
  "source": "{{1.channel_name}}",
  "status": "{{1.status}}",
  "payment": {
    "amount": {{1.payment.total}},
    "currency": "{{1.payment.currency}}",
    "status": "{{1.payment.status}}"
  },
  "operationType": "create"
}`;

// Data Transformations
const bookingComTransform = `// Booking.com to Standard Booking Format
{
  "propertyId": "{{1.reservation.hotel_id}}",
  "roomId": "{{1.reservation.room_details.room_id}}",
  "guest": {
    "firstName": "{{1.customer.name}}",
    "lastName": "{{1.customer.surname}}",
    "email": "{{1.customer.email}}",
    "phone": "{{1.customer.telephone}}"
  },
  "dates": {
    "checkIn": "{{parseDate(1.reservation.arrival_date, 'YYYY-MM-DD')}}",
    "checkOut": "{{parseDate(1.reservation.departure_date, 'YYYY-MM-DD')}}"
  },
  "source": "Booking.com",
  "status": "{{if(1.status == "new", "confirmed", if(1.status == "modified", "modified", "cancelled"))}}",
  "payment": {
    "amount": {{1.price.total}},
    "currency": "{{1.price.currency}}",
    "status": "{{if(1.payment_status == "fully_paid", "paid", "pending")}}"
  }
}`;

const airbnbTransform = `// Airbnb to Standard Booking Format
{
  "propertyId": "{{1.listing.id}}",
  "roomId": "{{1.listing.id}}",
  "guest": {
    "firstName": "{{splitText(1.guest.name, " ")[0]}}",
    "lastName": "{{join(slice(splitText(1.guest.name, " "), 1), " ")}}",
    "email": "{{1.guest.email}}",
    "phone": "{{1.guest.phone}}"
  },
  "dates": {
    "checkIn": "{{parseDate(1.reservation.start_date, 'YYYY-MM-DD')}}",
    "checkOut": "{{parseDate(1.reservation.end_date, 'YYYY-MM-DD')}}"
  },
  "source": "Airbnb",
  "status": "{{lower(1.reservation.status)}}",
  "payment": {
    "amount": {{1.financial_details.total_paid.amount}},
    "currency": "{{1.financial_details.total_paid.currency}}",
    "status": "{{if(1.financial_details.payments_completed, "paid", "pending")}}"
  }
}`;

const vrboTransform = `// VRBO/Expedia to Standard Booking Format
{
  "propertyId": "{{1.property.id}}",
  "roomId": "{{1.property.unit_id}}",
  "guest": {
    "firstName": "{{1.primary_guest.given_name}}",
    "lastName": "{{1.primary_guest.family_name}}",
    "email": "{{1.primary_guest.email}}",
    "phone": "{{1.primary_guest.phone}}"
  },
  "dates": {
    "checkIn": "{{parseDate(1.itinerary.check_in, 'YYYY-MM-DD')}}",
    "checkOut": "{{parseDate(1.itinerary.check_out, 'YYYY-MM-DD')}}"
  },
  "source": "{{if(contains(lower(1.channel)), "vrbo", "VRBO", "Expedia")}}",
  "status": "{{lower(1.booking_status)}}",
  "payment": {
    "amount": {{1.payment_details.total.value}},
    "currency": "{{1.payment_details.total.currency}}",
    "status": "{{if(1.payment_details.status == "COLLECTED", "paid", "pending")}}"
  }
}`;

// Error Handling
const rateLimitHandling = `// Router setup for rate limit detection and handling

// 1. In your HTTP request module, add this to "Advanced settings"
// "Parse response" = true

// 2. Add a router with these paths:

// Success Path (Connection: 2xx Success)
// Condition: {{resultStatusCode}} >= 200 && {{resultStatusCode}} < 300

// Rate Limit Path 
// Condition: {{resultStatusCode}} == 429 || contains(lower(result.headers["X-RateLimit-Remaining"]), "0")

// Rate Limit Path Logic:
// 1. Add a Set Variable module
retryCount = {{if(isNaN(retryCount), 1, retryCount + 1)}}

// 2. Add a Router to check retry count
// Condition: {{retryCount}} <= 5

// 3. Inside "Can retry" path, add Sleep module
// Duration: {{exponentialBackoff(retryCount, 1, 5)}} seconds
// Where exponentialBackoff is a custom function:
function exponentialBackoff(attempt, baseDelay, maxFactor) {
  const factor = Math.min(Math.pow(2, attempt - 1), maxFactor);
  return baseDelay * factor;
}

// 4. Then reconnect back to the HTTP request

// 5. Inside "Max retries reached" path, handle the failure
// Add a Text Aggregator to format error details
// Add Email module to send alert`;

const errorNotification = `// Error Notification Template 
// Use with Email module

Subject: Channel Manager Alert: {{alertType}} Error

Hi Team,

An error occurred in the Channel Manager workflow:

Error Type: {{errorType}}
Time: {{formatDate(now(), "YYYY-MM-DD HH:mm:ss")}}
Channel: {{channelName}}
Property ID: {{propertyId}}

Error Details:
{{errorDetails}}

Status Code: {{statusCode}}
Response Body: 
{{responseBody}}

This is {{if(isRetryable, "a recoverable", "an unrecoverable")}} error.
{{if(isRetryable, "The system will automatically retry at " + formatDate(nextRetry, "HH:mm:ss"), "Manual intervention required.")}}

Channel Manager Team`;

export default MakeCodeSamples;
