
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Code } from "@/components/ui/code";
import { Info, AlertTriangle, ArrowRight, Check, Pencil, RotateCcw } from 'lucide-react';

const MakeWorkflowGuide: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Make (Integromat) Workflow Guide</CardTitle>
        <CardDescription>
          Implementation guides for channel manager automation workflows
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Getting Started</AlertTitle>
          <AlertDescription>
            These guides help you implement Make workflows for your channel manager. 
            Each workflow is designed to automate a specific aspect of your multi-channel booking system.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="availability" className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="rates">Rates</TabsTrigger>
            <TabsTrigger value="booking">New Bookings</TabsTrigger>
            <TabsTrigger value="modification">Modifications</TabsTrigger>
            <TabsTrigger value="cancellation">Cancellations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="availability" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Availability Synchronization Workflow</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Step 1: Create a new scenario in Make</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Start by creating a new scenario and choose your trigger method.
                </p>
              </div>
              
              <div className="pl-4 border-l-2 border-muted space-y-2">
                <p className="text-sm"><strong>Option A: Schedule Trigger</strong></p>
                <ul className="list-disc list-inside text-sm pl-2 space-y-1 text-muted-foreground">
                  <li>Add a "Schedule" module</li>
                  <li>Set to run every 15 minutes</li>
                  <li>Configure "Advanced settings" if you need more control</li>
                </ul>
                
                <Separator className="my-2" />
                
                <p className="text-sm"><strong>Option B: Webhook Trigger</strong></p>
                <ul className="list-disc list-inside text-sm pl-2 space-y-1 text-muted-foreground">
                  <li>Add a "Webhook" module</li>
                  <li>Select "Custom webhook"</li>
                  <li>Copy the webhook URL (you'll need this later)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium">Step 2: Fetch your current availability</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Add an HTTP module to get availability data from your system.
                </p>
                <div className="bg-muted p-3 rounded-md mt-2 text-xs">
                  <p className="font-semibold">Sample HTTP Request Configuration:</p>
                  <p>URL: <Code>https://your-app.com/api/availability</Code></p>
                  <p>Method: <Code>GET</Code></p>
                  <p>Headers: <Code>{"Content-Type": "application/json", "Authorization": "Bearer YOUR_API_KEY"}</Code></p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Step 3: Iterator for each channel</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Use an Array Aggregator to process each connected channel.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Step 4: Send updates to channels</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  For each channel, add an HTTP module to update availability.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Step 5: Error handling</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Add error handling with Router module and fallback paths.
                </p>
                <Alert variant="destructive" className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Common Errors</AlertTitle>
                  <AlertDescription className="text-xs">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Rate limiting (add delay and retry logic)</li>
                      <li>Connection timeouts (implement exponential backoff)</li>
                      <li>Authentication failures (verify API keys)</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="rates" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Rate Update Workflow</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Step 1: Choose your trigger method</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Similar to availability, choose either schedule or webhook.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Step 2: Fetch current rates</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Get your rates from your central database.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Step 3: Apply channel-specific rules</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Use a Router module to apply different markup/markdown rules per channel.
                </p>
                <div className="bg-muted p-3 rounded-md mt-2 text-xs">
                  <p className="font-semibold">Sample Formula for Expedia (10% markup):</p>
                  <Code>{`{{Math.round(rate * 1.1)}}`}</Code>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Step 4: Update each channel</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  HTTP requests to each channel's rate update API.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Step 5: Verification</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Add verification steps to ensure rates were updated correctly.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="booking" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">New Booking Processing Workflow</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Step 1: Create webhook receivers</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Create one webhook per channel or a single webhook with channel identifier.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Step 2: Parse booking data</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Add JSON/XML parsing to extract booking details in a standardized format.
                </p>
                <div className="bg-muted p-3 rounded-md mt-2 text-xs">
                  <p className="font-semibold">Example Booking.com to Standard Format:</p>
                  <Code>{`{
  "propertyId": "{{data.hotel_id}}",
  "roomId": "{{data.room_id}}",
  "guest": {
    "firstName": "{{data.guest.first_name}}",
    "lastName": "{{data.guest.last_name}}",
    "email": "{{data.guest.email}}"
  },
  "dates": {
    "checkIn": "{{formatDate(data.arrival_date, 'YYYY-MM-DD')}}",
    "checkOut": "{{formatDate(data.departure_date, 'YYYY-MM-DD')}}"
  }
}`}</Code>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Step 3: Create booking record</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  HTTP POST to your booking API endpoint.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Step 4: Update availability</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Trigger availability sync to all channels.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Step 5: Send notifications</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Email, SMS, or app notifications to property managers.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="modification" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Booking Modification Workflow</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Step 1: Create modification webhook</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Setup webhook to receive modification requests.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Step 2: Validate modification</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Check if the requested changes are possible.
                </p>
                <Alert className="mt-2">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Always verify: Is the new date range available? Are there any restrictions?
                  </AlertDescription>
                </Alert>
              </div>
              
              <div>
                <h4 className="font-medium">Step 3: Process modification</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Update booking record in your database.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Step 4: Sync to all channels</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Update the booking status across all channels.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Step 5: Log modification details</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Create detailed audit trail of all changes.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cancellation" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Cancellation Handling Workflow</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Step 1: Create cancellation webhook</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Setup webhook to receive cancellation requests.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Step 2: Calculate cancellation fees</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Apply your cancellation policy based on notice period.
                </p>
                <div className="bg-muted p-3 rounded-md mt-2 text-xs">
                  <p className="font-semibold">Sample Cancellation Fee Logic:</p>
                  <Code>{`// Calculate days until arrival
const daysUntilArrival = dateDiffInDays(currentDate, checkInDate);

// Apply cancellation policy
if (daysUntilArrival > 7) {
  return 0; // No fee
} else if (daysUntilArrival > 2) {
  return bookingTotal * 0.5; // 50% fee
} else {
  return bookingTotal * 0.9; // 90% fee
}`}</Code>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Step 3: Process cancellation</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Update booking status and handle refunds if needed.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Step 4: Update availability</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Make dates available again across all channels.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Step 5: Send notifications</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Notify all relevant parties about the cancellation.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Webhook Endpoints</h3>
          <p className="text-sm text-muted-foreground">
            Use these webhook endpoints in your Make scenarios to send data back to your application:
          </p>
          
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Webhook Type</th>
                <th className="text-left py-2">URL Pattern</th>
                <th className="text-left py-2">Authentication</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Availability Updates</td>
                <td className="py-2"><Code>https://your-app.com/api/webhooks/availability</Code></td>
                <td className="py-2">Bearer Token</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Rate Updates</td>
                <td className="py-2"><Code>https://your-app.com/api/webhooks/rates</Code></td>
                <td className="py-2">Bearer Token</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Booking Operations</td>
                <td className="py-2"><Code>https://your-app.com/api/webhooks/bookings</Code></td>
                <td className="py-2">Bearer Token</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Modification Requests</td>
                <td className="py-2"><Code>https://your-app.com/api/webhooks/bookings</Code> (with operationType)</td>
                <td className="py-2">Bearer Token</td>
              </tr>
              <tr>
                <td className="py-2">Cancellation Requests</td>
                <td className="py-2"><Code>https://your-app.com/api/webhooks/bookings</Code> (with operationType)</td>
                <td className="py-2">Bearer Token</td>
              </tr>
            </tbody>
          </table>
          
          <Alert className="mt-2">
            <Info className="h-4 w-4" />
            <AlertTitle>Authentication</AlertTitle>
            <AlertDescription className="text-sm">
              All webhook requests require an Authorization header with a Bearer token.
              <br />
              Example: <Code>Authorization: Bearer make-webhook-secret-token</Code>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default MakeWorkflowGuide;
