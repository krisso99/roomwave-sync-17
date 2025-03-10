
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { DollarSign, Percent } from 'lucide-react';
import { RoomType, useRates } from '@/contexts/RateContext';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';

interface BulkRateUpdateProps {
  roomTypes: RoomType[];
  selectedRoomTypes: string[];
  dateRange: DateRange | undefined;
  onComplete: () => void;
  onCancel: () => void;
}

const bulkUpdateSchema = z.object({
  adjustmentType: z.enum(['fixed', 'percentage']),
  amount: z.coerce.number()
    .refine(val => val !== 0, {
      message: 'Amount cannot be zero',
    }),
  roomTypeIds: z.array(z.string()).min(1, {
    message: 'Please select at least one room type',
  }),
});

type BulkUpdateFormValues = z.infer<typeof bulkUpdateSchema>;

const BulkRateUpdate: React.FC<BulkRateUpdateProps> = ({
  roomTypes,
  selectedRoomTypes,
  dateRange,
  onComplete,
  onCancel,
}) => {
  const { bulkUpdateRates } = useRates();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BulkUpdateFormValues>({
    resolver: zodResolver(bulkUpdateSchema),
    defaultValues: {
      adjustmentType: 'percentage',
      amount: 0,
      roomTypeIds: selectedRoomTypes.length > 0 ? selectedRoomTypes : [],
    },
  });

  const adjustmentType = form.watch('adjustmentType');

  const onSubmit = async (values: BulkUpdateFormValues) => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: 'Missing date range',
        description: 'Please select a date range for this bulk update',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const isPercentage = values.adjustmentType === 'percentage';
      const dateRangeObj = {
        start: dateRange.from,
        end: dateRange.to,
      };

      const updatedCount = await bulkUpdateRates(
        values.roomTypeIds,
        dateRangeObj,
        values.amount,
        isPercentage
      );

      toast({
        title: 'Bulk update successful',
        description: `Updated ${updatedCount} rates across ${values.roomTypeIds.length} room types.`,
      });
      
      onComplete();
    } catch (error) {
      console.error('Error performing bulk update:', error);
      toast({
        title: 'Update failed',
        description: 'An error occurred while updating rates',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Date Range Summary */}
        <div className="p-4 bg-muted rounded-md">
          <h3 className="font-medium mb-2">Applying to date range:</h3>
          {dateRange?.from && dateRange?.to ? (
            <p>
              {format(dateRange.from, 'PPP')} to {format(dateRange.to, 'PPP')}
            </p>
          ) : (
            <p className="text-destructive">Please select a date range first</p>
          )}
        </div>

        {/* Adjustment Type */}
        <FormField
          control={form.control}
          name="adjustmentType"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Adjustment Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="percentage" />
                    </FormControl>
                    <FormLabel className="font-normal flex items-center">
                      <Percent className="h-4 w-4 mr-1" />
                      Percentage
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="fixed" />
                    </FormControl>
                    <FormLabel className="font-normal flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Fixed Amount
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Choose whether to adjust by percentage or fixed amount
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    {adjustmentType === 'percentage' ? '%' : '$'}
                  </span>
                  <Input
                    type="number"
                    step={adjustmentType === 'percentage' ? '1' : '0.01'}
                    className="pl-7"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>
                {adjustmentType === 'percentage' ? (
                  <>
                    Enter a positive value to increase rates (e.g., 10 for +10%)<br />
                    Enter a negative value to decrease rates (e.g., -10 for -10%)
                  </>
                ) : (
                  <>
                    Enter a positive value to increase rates (e.g., 20 for +$20)<br />
                    Enter a negative value to decrease rates (e.g., -20 for -$20)
                  </>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Room Types */}
        <FormField
          control={form.control}
          name="roomTypeIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Select Room Types</FormLabel>
                <FormDescription>
                  Choose which room types to apply the rate changes to
                </FormDescription>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto p-1">
                {roomTypes.map((roomType) => (
                  <FormField
                    key={roomType.id}
                    control={form.control}
                    name="roomTypeIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={roomType.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(roomType.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, roomType.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== roomType.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {roomType.name} (Base: ${roomType.baseRate})
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

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !dateRange?.from || !dateRange?.to}
          >
            {isSubmitting ? 'Updating...' : 'Apply Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BulkRateUpdate;
