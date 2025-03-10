
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { RateRule, RoomType, DayOfWeek, useRates } from '@/contexts/RateContext';
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
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface RateEditorProps {
  rateRule: RateRule | null;
  roomTypes: RoomType[];
  onSave: () => void;
  onCancel: () => void;
}

const rateFormSchema = z.object({
  roomTypeId: z.string({
    required_error: 'Please select a room type',
  }),
  name: z.string().min(1, 'Rate name is required'),
  type: z.enum(['base', 'seasonal', 'special']),
  amount: z.coerce.number().positive('Rate must be greater than 0'),
  currency: z.string().default('USD'),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  seasonName: z.string().optional(),
  eventName: z.string().optional(),
  daysOfWeek: z.array(z.string()).optional(),
  minimumStay: z.coerce.number().int().nonnegative().optional(),
  notes: z.string().optional(),
});

const dayOptions: { label: string; value: DayOfWeek }[] = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
  { label: 'Sunday', value: 'sunday' },
];

const RateEditor: React.FC<RateEditorProps> = ({
  rateRule,
  roomTypes,
  onSave,
  onCancel,
}) => {
  const { addRateRule, updateRateRule } = useRates();
  
  // Default values for the form
  const defaultValues = rateRule
    ? {
        ...rateRule,
        startDate: rateRule.startDate ? new Date(rateRule.startDate) : undefined,
        endDate: rateRule.endDate ? new Date(rateRule.endDate) : undefined,
        daysOfWeek: rateRule.daysOfWeek || [],
        seasonName: rateRule.type === 'seasonal' ? (rateRule as any).seasonName : '',
        eventName: rateRule.type === 'special' ? (rateRule as any).eventName : '',
      }
    : {
        roomTypeId: roomTypes[0]?.id || '',
        name: '',
        type: 'base' as const,
        amount: roomTypes[0]?.baseRate || 100,
        currency: 'USD',
        daysOfWeek: [],
      };

  const form = useForm<z.infer<typeof rateFormSchema>>({
    resolver: zodResolver(rateFormSchema),
    defaultValues,
  });

  // Watch form values to show/hide conditional fields
  const rateType = form.watch('type');
  const selectedRoomTypeId = form.watch('roomTypeId');
  
  // Get selected room type
  const selectedRoomType = roomTypes.find(rt => rt.id === selectedRoomTypeId);

  const onSubmit = async (values: z.infer<typeof rateFormSchema>) => {
    try {
      // Prepare data based on rate type
      const rateData: any = {
        ...values,
      };
      
      // Special handling for seasonal rates
      if (values.type === 'seasonal' && values.seasonName) {
        rateData.seasonName = values.seasonName;
      }
      
      // Special handling for event rates
      if (values.type === 'special' && values.eventName) {
        rateData.eventName = values.eventName;
      }
      
      // Handle the update or create
      if (rateRule && 'id' in rateRule) {
        await updateRateRule(rateRule.id, rateData);
      } else {
        await addRateRule(rateData);
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving rate rule:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="roomTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roomTypes.map((roomType) => (
                      <SelectItem key={roomType.id} value={roomType.id}>
                        {roomType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The room type this rate applies to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rate type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="base">Base Rate</SelectItem>
                    <SelectItem value="seasonal">Seasonal Rate</SelectItem>
                    <SelectItem value="special">Special Event Rate</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The type of rate (determines priority)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter rate name" {...field} />
                </FormControl>
                <FormDescription>
                  A descriptive name for this rate
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input type="number" min="0" step="0.01" className="pl-7" {...field} />
                  </div>
                </FormControl>
                <FormDescription>
                  {selectedRoomType && (
                    <span>Base rate for {selectedRoomType.name} is ${selectedRoomType.baseRate}</span>
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Date Range Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>No date restriction</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The start date this rate applies (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>No date restriction</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The end date this rate applies (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Conditional fields based on rate type */}
        {rateType === 'seasonal' && (
          <FormField
            control={form.control}
            name="seasonName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Season Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Summer 2023, Winter Holiday" {...field} />
                </FormControl>
                <FormDescription>
                  The name of the season this rate applies to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {rateType === 'special' && (
          <FormField
            control={form.control}
            name="eventName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. New Year's Eve, Local Festival" {...field} />
                </FormControl>
                <FormDescription>
                  The name of the special event this rate applies to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {/* Days of Week */}
        <FormField
          control={form.control}
          name="daysOfWeek"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Days of Week</FormLabel>
                <FormDescription>
                  Select specific days of the week this rate applies to (leave empty for all days)
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {dayOptions.map((day) => (
                  <FormField
                    key={day.value}
                    control={form.control}
                    name="daysOfWeek"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={day.value}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(day.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value || [], day.value])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== day.value
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {day.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Minimum Stay */}
        <FormField
          control={form.control}
          name="minimumStay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Stay (Nights)</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="1" {...field} />
              </FormControl>
              <FormDescription>
                Minimum length of stay required for this rate (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any notes or comments about this rate"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {rateRule && 'id' in rateRule ? 'Update Rate' : 'Create Rate'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RateEditor;
