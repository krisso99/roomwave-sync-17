
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Save } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from '@/integrations/supabase/client';

const configSchema = z.object({
  siteName: z.string().min(2, {
    message: "Site name must be at least 2 characters.",
  }),
  siteUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  emailFrom: z.string().email({
    message: "Please enter a valid email address.",
  }),
  enableBookingNotifications: z.boolean().default(true),
  enableGuestPortal: z.boolean().default(true),
  maintenanceMode: z.boolean().default(false),
  bookingLeadTime: z.number().min(0).max(365),
  maxBookingWindow: z.number().min(1).max(730),
});

type ConfigFormValues = z.infer<typeof configSchema>;

const defaultValues: Partial<ConfigFormValues> = {
  siteName: "RiadSync",
  siteUrl: "https://riadsync.com",
  emailFrom: "bookings@riadsync.com",
  enableBookingNotifications: true,
  enableGuestPortal: true,
  maintenanceMode: false,
  bookingLeadTime: 0,
  maxBookingWindow: 365,
};

const ConfigPanel = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues,
  });

  // Load saved configuration from Supabase when component mounts
  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('system_configuration')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error) {
          console.error('Error loading configuration:', error);
          return;
        }
        
        if (data) {
          // Map from snake_case DB columns to camelCase form fields
          form.reset({
            siteName: data.site_name,
            siteUrl: data.site_url,
            emailFrom: data.email_from,
            enableBookingNotifications: data.enable_booking_notifications,
            enableGuestPortal: data.enable_guest_portal,
            maintenanceMode: data.maintenance_mode,
            bookingLeadTime: data.booking_lead_time,
            maxBookingWindow: data.max_booking_window,
          });
        }
      } catch (error) {
        console.error('Error loading configuration:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConfig();
  }, [form]);

  const onSubmit = async (data: ConfigFormValues) => {
    try {
      // Save configuration to Supabase
      const { error } = await supabase
        .from('system_configuration')
        .update({
          site_name: data.siteName,
          site_url: data.siteUrl,
          email_from: data.emailFrom,
          enable_booking_notifications: data.enableBookingNotifications,
          enable_guest_portal: data.enableGuestPortal,
          maintenance_mode: data.maintenanceMode,
          booking_lead_time: data.bookingLeadTime,
          max_booking_window: data.maxBookingWindow,
        })
        .eq('id', (await supabase.from('system_configuration').select('id').limit(1).single()).data?.id);
      
      if (error) {
        throw error;
      }
      
      console.log("Configuration saved:", data);
      
      toast({
        title: "Configuration saved",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Error saving configuration",
        description: "There was a problem saving your changes.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Loading configuration...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Configuration</CardTitle>
        <CardDescription>
          Configure global settings for your channel manager
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your site name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be displayed on emails and the guest portal.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="siteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your main website URL.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="emailFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email From Address</FormLabel>
                  <FormControl>
                    <Input placeholder="bookings@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Used as the sender for all system emails.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="bookingLeadTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Lead Time (days)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum days before a booking can be made (0 = same day)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maxBookingWindow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Booking Window (days)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      How far in advance bookings can be made
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Feature Toggles</h3>
              
              <FormField
                control={form.control}
                name="enableBookingNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Booking Notifications
                      </FormLabel>
                      <FormDescription>
                        Send email notifications for new bookings
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
              
              <FormField
                control={form.control}
                name="enableGuestPortal"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Guest Portal
                      </FormLabel>
                      <FormDescription>
                        Allow guests to manage their bookings online
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
              
              <FormField
                control={form.control}
                name="maintenanceMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Maintenance Mode
                      </FormLabel>
                      <FormDescription>
                        Temporarily disable booking functionality
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
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ConfigPanel;
