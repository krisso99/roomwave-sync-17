
import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Calendar, CalendarPlus, Clock, Cog, Link, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ICalFeed } from '@/services/api/icalService';

// Validation schema for iCal feed
const icalFeedSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  url: z.string().url({ message: 'Must be a valid URL' }),
  propertyId: z.string(),
  roomId: z.string().optional(),
  autoSync: z.boolean().default(false),
  syncInterval: z.number().min(15).max(1440),
  direction: z.enum(['import', 'export', 'both']),
  priority: z.number().min(1).max(10),
});

type ICalFeedFormValues = z.infer<typeof icalFeedSchema>;

interface ICalFeedFormProps {
  feed?: ICalFeed;
  onSubmit: (values: ICalFeedFormValues) => Promise<void>;
  onCancel: () => void;
  propertyId?: string;
}

const ICalFeedForm: React.FC<ICalFeedFormProps> = ({
  feed,
  onSubmit,
  onCancel,
  propertyId = 'property-1', // Default for demo
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues: Partial<ICalFeedFormValues> = {
    name: feed?.name || '',
    url: feed?.url || '',
    propertyId: feed?.propertyId || propertyId,
    roomId: feed?.roomId || undefined,
    autoSync: feed?.autoSync ?? true,
    syncInterval: feed?.syncInterval || 60,
    direction: feed?.direction || 'import',
    priority: feed?.priority || 1,
  };
  
  const form = useForm<ICalFeedFormValues>({
    resolver: zodResolver(icalFeedSchema),
    defaultValues,
  });
  
  const handleSubmit = async (values: ICalFeedFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feed Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Airbnb Calendar" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive name to identify this calendar feed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>iCal URL</FormLabel>
                  <FormControl>
                    <div className="flex space-x-2">
                      <Input placeholder="https://example.com/calendar.ics" {...field} />
                      <Button 
                        type="button" 
                        size="icon" 
                        variant="outline" 
                        onClick={() => window.open(form.getValues().url, '_blank')}
                        disabled={!form.getValues().url}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    The URL of the iCal feed you want to import.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="direction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feed Direction</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select feed direction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="import">Import Only (External → Our System)</SelectItem>
                      <SelectItem value="export">Export Only (Our System → External)</SelectItem>
                      <SelectItem value="both">Bidirectional (Both Ways)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Determines how calendar data flows between systems.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="autoSync"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Automatic Synchronization</FormLabel>
                    <FormDescription>
                      Automatically sync this calendar at regular intervals.
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
            
            {form.watch('autoSync') && (
              <FormField
                control={form.control}
                name="syncInterval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sync Interval (minutes)</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Every {field.value} minutes</span>
                          <span className="text-sm text-muted-foreground">
                            {field.value < 60 
                              ? `${field.value} min` 
                              : `${Math.floor(field.value / 60)}h ${field.value % 60}m`}
                          </span>
                        </div>
                        <Slider
                          value={[field.value]}
                          min={15}
                          max={1440}
                          step={15}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>15m</span>
                          <span>6h</span>
                          <span>12h</span>
                          <span>24h</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      How often the system should check for updates.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conflict Priority (1-10)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Priority: {field.value}</span>
                        <span className="text-sm text-muted-foreground">
                          {field.value >= 8 ? 'High' : field.value >= 4 ? 'Medium' : 'Low'}
                        </span>
                      </div>
                      <Slider
                        value={[field.value]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    When conflicts occur, feeds with higher priority values take precedence.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        <div className="flex flex-col space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Important iCal Information</h3>
          <ul className="text-sm space-y-1 list-disc pl-5">
            <li>iCal feeds typically refresh every 30-60 minutes on external platforms</li>
            <li>Some external systems may cache feeds for up to 24 hours</li>
            <li>Date/time data in feeds may not account for time zones correctly</li>
            <li>Not all booking details are included in iCal feeds (e.g., guest info, payments)</li>
          </ul>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : feed ? 'Update Feed' : 'Add Feed'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ICalFeedForm;
