
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon, Percent, DollarSign } from 'lucide-react';
import { useRates, RoomType, Channel, PromotionStatus } from '@/contexts/RateContext';
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
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DateRange } from 'react-day-picker';

interface PromotionFormProps {
  promotion: any | null;
  roomTypes: RoomType[];
  channels: Channel[];
  onSave: () => void;
  onCancel: () => void;
}

const promotionFormSchema = z.object({
  name: z.string().min(1, 'Promotion name is required'),
  description: z.string().min(1, 'Description is required'),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.coerce.number().positive('Discount value must be greater than 0'),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  minimumStay: z.coerce.number().int().nonnegative().optional(),
  minimumAdvanceBooking: z.coerce.number().int().nonnegative().optional(),
  maxUsage: z.coerce.number().int().nonnegative().nullable(),
  promoCode: z.string().optional(),
  status: z.enum(['active', 'scheduled', 'expired', 'draft']),
  applicableRoomTypes: z.array(z.string()).min(1, 'Select at least one room type'),
  applicableChannels: z.array(z.string()).min(1, 'Select at least one channel'),
});

type PromotionFormValues = z.infer<typeof promotionFormSchema>;

const PromotionForm: React.FC<PromotionFormProps> = ({
  promotion,
  roomTypes,
  channels,
  onSave,
  onCancel,
}) => {
  const { addPromotion, updatePromotion, generatePromoCode } = useRates();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createDefaultValues = (): PromotionFormValues => {
    if (!promotion) {
      return {
        name: '',
        description: '',
        discountType: 'percentage',
        discountValue: 10,
        dateRange: {
          from: new Date(),
          to: addDays(new Date(), 90),
        },
        minimumStay: 0,
        minimumAdvanceBooking: 0,
        maxUsage: null,
        promoCode: '',
        status: 'active',
        applicableRoomTypes: roomTypes.map(rt => rt.id),
        applicableChannels: channels.map(c => c.id),
      };
    }

    return {
      name: promotion.name,
      description: promotion.description,
      discountType: promotion.discountType,
      discountValue: promotion.discountValue,
      dateRange: {
        from: new Date(promotion.startDate),
        to: new Date(promotion.endDate),
      },
      minimumStay: promotion.minimumStay || 0,
      minimumAdvanceBooking: promotion.minimumAdvanceBooking || 0,
      maxUsage: promotion.maxUsage || null,
      promoCode: promotion.promoCode || '',
      status: promotion.status,
      applicableRoomTypes: promotion.applicableRoomTypes,
      applicableChannels: promotion.applicableChannels,
    };
  };

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: createDefaultValues(),
  });

  const discountType = form.watch('discountType');

  const handleGeneratePromoCode = () => {
    const code = generatePromoCode();
    form.setValue('promoCode', code);
  };

  const onSubmit = async (values: PromotionFormValues) => {
    setIsSubmitting(true);
    try {
      const promotionData = {
        name: values.name,
        description: values.description,
        discountType: values.discountType,
        discountValue: values.discountValue,
        startDate: values.dateRange.from,
        endDate: values.dateRange.to,
        minimumStay: values.minimumStay,
        minimumAdvanceBooking: values.minimumAdvanceBooking,
        maxUsage: values.maxUsage,
        promoCode: values.promoCode,
        status: values.status,
        applicableRoomTypes: values.applicableRoomTypes,
        applicableChannels: values.applicableChannels,
      };

      if (promotion && promotion.id) {
        await updatePromotion(promotion.id, promotionData);
      } else {
        await addPromotion(promotionData);
      }

      onSave();
    } catch (error) {
      console.error('Error saving promotion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Promotion Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter promotion name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe this promotion for internal reference" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Discount Type</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="discountValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Value</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      {discountType === 'percentage' ? '%' : '$'}
                    </span>
                    <Input 
                      type="number" 
                      min="0" 
                      step={discountType === 'percentage' ? '1' : '0.01'} 
                      className="pl-7" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  {discountType === 'percentage' 
                    ? 'Enter percentage discount (e.g. 10 for 10% off)' 
                    : 'Enter fixed amount discount (e.g. 20 for $20 off)'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Valid Date Range</FormLabel>
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
                      {field.value?.from ? (
                        field.value.to ? (
                          <>
                            {format(field.value.from, "PPP")} - {format(field.value.to, "PPP")}
                          </>
                        ) : (
                          format(field.value.from, "PPP")
                        )
                      ) : (
                        <span>Select date range</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={field.value as DateRange}
                    onSelect={field.onChange}
                    initialFocus
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                The period during which this promotion is valid
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Minimum nights required (0 for no minimum)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="minimumAdvanceBooking"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Advance Booking (Days)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="1" {...field} />
                </FormControl>
                <FormDescription>
                  Days in advance booking must be made (0 for no minimum)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maxUsage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usage Limit</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="1" 
                    placeholder="No limit"
                    value={field.value === null ? '' : field.value}
                    onChange={(e) => {
                      const value = e.target.value === '' ? null : parseInt(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Maximum number of times this promotion can be used (leave empty for unlimited)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="promoCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Promo Code</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input 
                      placeholder="Optional code to apply promotion" 
                      {...field} 
                    />
                  </FormControl>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleGeneratePromoCode}
                  >
                    Generate
                  </Button>
                </div>
                <FormDescription>
                  Code customers need to enter (leave empty for automatic application)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="applicableRoomTypes"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Applicable Room Types</FormLabel>
                <FormDescription>
                  Select which room types this promotion applies to
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {roomTypes.map((roomType) => (
                  <FormField
                    key={roomType.id}
                    control={form.control}
                    name="applicableRoomTypes"
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
                            {roomType.name}
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

        <FormField
          control={form.control}
          name="applicableChannels"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Applicable Channels</FormLabel>
                <FormDescription>
                  Select which booking channels this promotion applies to
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {channels.map((channel) => (
                  <FormField
                    key={channel.id}
                    control={form.control}
                    name="applicableChannels"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={channel.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(channel.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, channel.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== channel.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {channel.name}
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
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (promotion ? 'Update Promotion' : 'Create Promotion')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PromotionForm;
