import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { PlatformCredentials, SyncOptions } from '@/services/api/bookingPlatforms';

const bookingComSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  secretKey: z.string().min(1, 'Secret Key is required'),
  hotelId: z.string().min(1, 'Hotel ID is required'),
});

const expediaSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  secretKey: z.string().min(1, 'Secret Key is required'),
  hotelId: z.string().min(1, 'Hotel ID is required'),
  endpoint: z.string().optional(),
});

const airbnbSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  userId: z.string().min(1, 'User ID is required'),
});

type BookingComFormType = z.infer<typeof bookingComSchema>;
type ExpediaFormType = z.infer<typeof expediaSchema>;
type AirbnbFormType = z.infer<typeof airbnbSchema>;

const platformSchemas = {
  'Booking.com': bookingComSchema,
  'Expedia': expediaSchema,
  'Airbnb': airbnbSchema,
};

const syncOptionsSchema = z.object({
  autoSync: z.boolean().default(true),
  syncInterval: z.number().min(5, 'Minimum interval is 5 minutes').default(15),
  retryAttempts: z.number().min(0).max(10).default(3),
  syncItems: z.object({
    availability: z.boolean().default(true),
    rates: z.boolean().default(true),
    restrictions: z.boolean().default(true),
    bookings: z.boolean().default(true),
  }),
});

type SyncOptionsFormType = z.infer<typeof syncOptionsSchema>;

type PlatformIntegrationFormProps = {
  platform: string;
  onConnect: (credentials: PlatformCredentials) => Promise<boolean>;
  onConfigureSync: (options: SyncOptions) => void;
  isConnected: boolean;
  isConnecting: boolean;
};

export const PlatformIntegrationForm: React.FC<PlatformIntegrationFormProps> = ({
  platform,
  onConnect,
  onConfigureSync,
  isConnected,
  isConnecting,
}) => {
  const [activeTab, setActiveTab] = useState<string>(isConnected ? 'sync' : 'credentials');
  
  let credentialsForm;
  
  if (platform === 'Booking.com') {
    credentialsForm = useForm<BookingComFormType>({
      resolver: zodResolver(bookingComSchema),
      defaultValues: {
        apiKey: '',
        secretKey: '',
        hotelId: '',
      },
    });
  } else if (platform === 'Expedia') {
    credentialsForm = useForm<ExpediaFormType>({
      resolver: zodResolver(expediaSchema),
      defaultValues: {
        apiKey: '',
        secretKey: '',
        hotelId: '',
        endpoint: '',
      },
    });
  } else if (platform === 'Airbnb') {
    credentialsForm = useForm<AirbnbFormType>({
      resolver: zodResolver(airbnbSchema),
      defaultValues: {
        apiKey: '',
        userId: '',
      },
    });
  } else {
    credentialsForm = useForm<{ apiKey: string }>({
      resolver: zodResolver(z.object({ apiKey: z.string().min(1, 'API Key is required') })),
      defaultValues: {
        apiKey: '',
      },
    });
  }
  
  const syncForm = useForm<SyncOptionsFormType>({
    resolver: zodResolver(syncOptionsSchema),
    defaultValues: {
      autoSync: true,
      syncInterval: 15,
      retryAttempts: 3,
      syncItems: {
        availability: true,
        rates: true,
        restrictions: true,
        bookings: true,
      },
    },
  });
  
  const handleConnect = async (data: any) => {
    try {
      const credentials: PlatformCredentials = {
        apiKey: data.apiKey,
        secretKey: data.secretKey,
        partnerId: data.hotelId || data.userId,
        endpoint: data.endpoint,
      };
      
      const success = await onConnect(credentials);
      
      if (success) {
        setActiveTab('sync');
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: 'Connection Failed',
        description: `Could not connect to ${platform}. Please check your credentials.`,
        variant: 'destructive',
      });
    }
  };
  
  const handleSyncConfig = (data: SyncOptionsFormType) => {
    const syncOptions: SyncOptions = {
      autoSync: data.autoSync,
      syncInterval: data.syncInterval,
      retryAttempts: data.retryAttempts,
      syncItems: {
        availability: data.syncItems.availability,
        rates: data.syncItems.rates,
        restrictions: data.syncItems.restrictions,
        bookings: data.syncItems.bookings,
      },
    };
    
    onConfigureSync(syncOptions);
    
    toast({
      title: 'Sync Configuration Updated',
      description: `Synchronization settings for ${platform} have been updated.`,
    });
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="credentials">Credentials</TabsTrigger>
        <TabsTrigger value="sync" disabled={!isConnected}>Sync Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="credentials" className="space-y-4 mt-4">
        <Form {...credentialsForm}>
          <form onSubmit={credentialsForm.handleSubmit(handleConnect)} className="space-y-4">
            {platform === 'Booking.com' && (
              <>
                <FormField
                  control={credentialsForm.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Booking.com API key" {...field} />
                      </FormControl>
                      <FormDescription>
                        You can find this in your Booking.com Connectivity Partner Portal.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={credentialsForm.control}
                  name="secretKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secret Key</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your Booking.com secret key" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={credentialsForm.control}
                  name="hotelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hotel ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Booking.com hotel ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {platform === 'Expedia' && (
              <>
                <FormField
                  control={credentialsForm.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Expedia API key" {...field} />
                      </FormControl>
                      <FormDescription>
                        You can find this in your Expedia Partner Central account.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={credentialsForm.control}
                  name="secretKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secret Key</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your Expedia secret key" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={credentialsForm.control}
                  name="hotelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hotel ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Expedia hotel ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={credentialsForm.control}
                  name="endpoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Endpoint (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Custom API endpoint (leave blank for default)" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Only change this if you've been instructed to use a custom endpoint.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {platform === 'Airbnb' && (
              <>
                <FormField
                  control={credentialsForm.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Airbnb API key" {...field} />
                      </FormControl>
                      <FormDescription>
                        You can find this in your Airbnb Professional Hosting Tools.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={credentialsForm.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Airbnb user ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <Button type="submit" disabled={isConnecting}>
              {isConnecting ? 'Connecting...' : isConnected ? 'Update Credentials' : 'Connect'}
            </Button>
          </form>
        </Form>
      </TabsContent>
      
      <TabsContent value="sync" className="space-y-4 mt-4">
        <Form {...syncForm}>
          <form onSubmit={syncForm.handleSubmit(handleSyncConfig)} className="space-y-4">
            <FormField
              control={syncForm.control}
              name="autoSync"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Automatic Synchronization</FormLabel>
                    <FormDescription>
                      Enable automatic synchronization with {platform}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {syncForm.watch('autoSync') && (
              <FormField
                control={syncForm.control}
                name="syncInterval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sync Interval (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(Number(e.target.value))}
                        min={5}
                      />
                    </FormControl>
                    <FormDescription>
                      How often to synchronize data with {platform} (minimum 5 minutes)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={syncForm.control}
              name="retryAttempts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retry Attempts</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(Number(e.target.value))}
                      min={0}
                      max={10}
                    />
                  </FormControl>
                  <FormDescription>
                    Number of retry attempts if synchronization fails
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <Label>Sync Items</Label>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <FormField
                      control={syncForm.control}
                      name="syncItems.availability"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Availability</FormLabel>
                            <FormDescription>
                              Sync room availability with {platform}
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={syncForm.control}
                      name="syncItems.rates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Rates</FormLabel>
                            <FormDescription>
                              Sync room rates with {platform}
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={syncForm.control}
                      name="syncItems.restrictions"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Restrictions</FormLabel>
                            <FormDescription>
                              Sync booking restrictions with {platform}
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={syncForm.control}
                      name="syncItems.bookings"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Bookings</FormLabel>
                            <FormDescription>
                              Sync booking data with {platform}
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Button type="submit">Save Sync Settings</Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
};

export default PlatformIntegrationForm;
