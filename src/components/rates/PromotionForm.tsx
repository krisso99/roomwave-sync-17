
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useRates, RoomType, Channel, Promotion, DiscountType, PromotionStatus } from '@/contexts/RateContext';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface PromotionFormProps {
  promotion: Promotion | null;
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
  startDate: z.date(),
  endDate: z.date(),
  minimumStay: z.coerce.number().int().nonnegative().optional(),
  minimumAdvanceBooking: z.coerce.number().int().nonnegative().optional(),
  maxUsage: z.coerce.number().int().nonnegative().optional(),
  promoCode: z.string().optional(),
  status: z.enum(['active', 'scheduled', 'expired', 'draft']),
  applicableRoomTypes: z.array(z.string()),
  applicableChannels: z.array(z.string()),
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
  
  // Default values for the form
  const defaultValues: PromotionFormValues = promotion
    ? {
        name: promotion.name,
        description: promotion.description,
        discountType: promotion.discountType,
        discountValue: promotion.discountValue,
        startDate: new Date(promotion.startDate),
        endDate: new Date(promotion.endDate),
        minimumStay: promotion.minimumStay,
        minimumAdvanceBooking: promotion.minimumAdvanceBooking,
        maxUsage: promotion.maxUsage,
        promoCode: promotion.promoCode,
        status: promotion.status,
        applicableRoomTypes: promotion.applicableRoomTypes,
        applicableChannels: promotion.applicableChannels,
      }
    : {
        name: '',
        description: '',
        discountType: 'percentage',
        discountValue: 10,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        status: 'draft',
        applicableRoomTypes: roomTypes.map(rt => rt.id),
        applicableChannels: channels.map(c => c.id),
      };

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues,
  });

  // Generate promo code button handler
  const handleGeneratePromoCode = () => {
    const code = generatePromoCode();
    form.setValue('promoCode', code);
  };

  const onSubmit = async (values: PromotionFormValues) => {
    try {
      if (promotion && 'id' in promotion) {
        await updatePromotion(promotion.id, values);
      } else {
        await addPromotion(values);
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving promotion:', error);
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
                <FormDescription>
                  A descriptive name for this promotion
                </FormDescription>
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
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Current status of this promotion
                </FormDescription>
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
                <Textarea placeholder="Enter promotion description" {...field} />
              </FormControl>
              <FormDescription>
                Detailed description of the promotion
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Discount Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="percentage" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Percentage (%)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="fixed" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Fixed Amount ($)
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
                      {form.watch('discountType') === 'percentage' ? '%' : '$'}
                    </span>
                    <Input type="number" min="0" step="0.01" className="pl-7" {...field} />
                  </div>
                </FormControl>
                <FormDescription>
                  {form.watch('discountType') === 'percentage' 
                    ? 'Percentage discount to apply' 
                    : 'Fixed amount discount to apply'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
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
                          <span>Select start date</span>
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
                          <span>Select end date</span>
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="minimumStay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Stay (Nights)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="1" {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  Optional minimum length of stay
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
                <FormLabel>Min. Advance Days</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="1" {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  Optional minimum advance booking days
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="maxUsage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Usage</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="1" {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  Max times this promotion can be used
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex items-end gap-4">
          <FormField
            control={form.control}
            name="promoCode"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Promo Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter or generate promo code" {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  Optional code for customers to enter
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleGeneratePromoCode}
            className="mb-[2px]"
          >
            Generate
          </Button>
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
                                  ? field.onChange([...field.value || [], roomType.id])
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
                  Select which distribution channels this promotion applies to
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
                                  ? field.onChange([...field.value || [], channel.id])
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {promotion ? 'Update Promotion' : 'Create Promotion'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PromotionForm;
