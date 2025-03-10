
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { 
  AvailabilityUpdatePayload,
  RateUpdatePayload,
  BookingPayload
} from '@/services/api/webhookService';

const WebhookTester: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('availability');
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<string>('');
  
  // Default test payloads
  const defaultAvailabilityPayload: AvailabilityUpdatePayload = {
    propertyId: "property-123",
    roomId: "room-456",
    dates: [
      { date: new Date().toISOString(), available: true, channel: "Booking.com" },
      { date: new Date(Date.now() + 86400000).toISOString(), available: false, channel: "Booking.com" },
      { date: new Date(Date.now() + 172800000).toISOString(), available: true, channel: "Booking.com" }
    ],
    syncId: "test-sync-" + Date.now()
  };
  
  const defaultRatePayload: RateUpdatePayload = {
    propertyId: "property-123",
    roomId: "room-456",
    rates: [
      { date: new Date().toISOString(), amount: 120, currency: "USD", channel: "Expedia" },
      { date: new Date(Date.now() + 86400000).toISOString(), amount: 130, currency: "USD", channel: "Expedia" },
      { date: new Date(Date.now() + 172800000).toISOString(), amount: 110, currency: "USD", channel: "Expedia" }
    ],
    syncId: "test-rate-sync-" + Date.now()
  };
  
  const defaultBookingPayload: BookingPayload = {
    propertyId: "property-123",
    roomId: "room-456",
    guest: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1234567890"
    },
    dates: {
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 3 * 86400000).toISOString()
    },
    source: "Airbnb",
    status: "confirmed",
    payment: {
      amount: 350,
      currency: "USD",
      status: "paid"
    },
    operationType: "create"
  };
  
  // State for editable payloads
  const [availabilityPayload, setAvailabilityPayload] = useState<string>(
    JSON.stringify(defaultAvailabilityPayload, null, 2)
  );
  
  const [ratePayload, setRatePayload] = useState<string>(
    JSON.stringify(defaultRatePayload, null, 2)
  );
  
  const [bookingPayload, setBookingPayload] = useState<string>(
    JSON.stringify(defaultBookingPayload, null, 2)
  );
  
  const handleSendWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }
    
    let payload: string;
    try {
      switch (activeTab) {
        case 'availability':
          payload = availabilityPayload;
          break;
        case 'rates':
          payload = ratePayload;
          break;
        case 'booking':
          payload = bookingPayload;
          break;
        default:
          throw new Error("Unknown webhook type");
      }
      
      // Parse to validate JSON
      JSON.parse(payload);
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "The payload is not valid JSON. Please check your input.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setResponseData('');
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer make-webhook-secret-token'
        },
        body: payload
      });
      
      const responseText = await response.text();
      let formattedResponse;
      
      try {
        // Try to parse and format as JSON
        const json = JSON.parse(responseText);
        formattedResponse = JSON.stringify(json, null, 2);
      } catch {
        // If not JSON, use plain text
        formattedResponse = responseText;
      }
      
      setResponseData(formattedResponse);
      
      toast({
        title: response.ok ? "Webhook Sent Successfully" : "Webhook Error",
        description: `Status: ${response.status} ${response.statusText}`,
        variant: response.ok ? "default" : "destructive",
      });
      
    } catch (error) {
      console.error("Error sending webhook:", error);
      setResponseData(error instanceof Error ? error.message : String(error));
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to the webhook URL. Check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Make Webhook Tester</CardTitle>
        <CardDescription>
          Test your Make (Integromat) webhook endpoints with sample data
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <Input 
            id="webhook-url"
            placeholder="https://hook.eu1.make.com/your-webhook-id"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Enter the webhook URL from your Make scenario
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="rates">Rates</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
          </TabsList>
          
          <TabsContent value="availability" className="space-y-4 mt-4">
            <Label>Availability Payload</Label>
            <Textarea 
              rows={10} 
              value={availabilityPayload}
              onChange={(e) => setAvailabilityPayload(e.target.value)}
              className="font-mono text-sm"
            />
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setAvailabilityPayload(JSON.stringify(defaultAvailabilityPayload, null, 2))}
              >
                Reset to Default
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="rates" className="space-y-4 mt-4">
            <Label>Rate Update Payload</Label>
            <Textarea 
              rows={10} 
              value={ratePayload}
              onChange={(e) => setRatePayload(e.target.value)}
              className="font-mono text-sm"
            />
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setRatePayload(JSON.stringify(defaultRatePayload, null, 2))}
              >
                Reset to Default
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="booking" className="space-y-4 mt-4">
            <Label>Booking Payload</Label>
            <Textarea 
              rows={10} 
              value={bookingPayload}
              onChange={(e) => setBookingPayload(e.target.value)}
              className="font-mono text-sm"
            />
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setBookingPayload(JSON.stringify(defaultBookingPayload, null, 2))}
              >
                Reset to Default
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {responseData && (
          <div className="space-y-2">
            <Label>Response</Label>
            <div className="bg-muted p-4 rounded-md">
              <pre className="text-xs overflow-auto whitespace-pre-wrap max-h-60">
                {responseData}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button onClick={handleSendWebhook} disabled={isLoading}>
          {isLoading ? (
            <>Sending...</>
          ) : (
            <>
              Test Webhook
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WebhookTester;
