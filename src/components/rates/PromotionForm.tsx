
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { RoomType, Channel, Promotion, PromotionStatus, useRates } from '@/contexts/RateContext';
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
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PromotionFormProps {
  promotion: Promotion | null;
  roomTypes: RoomType[];
  channels: Channel[];
  onSave: () => void;
  onCancel: () => void;
}

const promotionFormSchema = z.object({
  name: z.string().min(1, 'Promotion name is required'),
  status: z.enum(['active', 'scheduled', 'expired', 'draft']),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  minimumStay: z.coerce.number().int().nonnegative().optional(),
  minimumAdvanceBooking: z.coerce.number().int().nonnegative().optional(),
  description: z.string().min(1, 'Description is required'),
  discountType: z.enum(['fixed', 'percentage']),
  discountValue: z.coerce.number().positive('Discount value must be greater than 0'),
  maxUsage: z.coerce.number().int().nonnegative().optional(),
  promoCode: z.string().optional(),
  applicableRoomTypes: z.array(z.string()).min(1, 'Select at least one room type'),
  applicableChannels: z.array(z.string()).min(1, 'Select at least one channel'),
}).refine(data => {
  return data.endDate >= data.startDate;
}, {
  message: "End date cannot be before start date",
  path: ["endDate"],
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
  
  // Set default values for form
  const defaultValues: Partial<PromotionFormValues> = promotion
    ? {
        name: promotion.name,
        description: promotion.description,
        status: promotion.status,
        discountType: promotion.discountType,
        discountValue: promotion.discountValue,
        startDate: new Date(promotion.startDate),
        endDate: new Date(promotion.endDate),
        minimumStay: promotion.minimumStay,
        minimumAdvanceBooking: promotion.minimumAdvanceBooking,
        maxUsage: promotion.maxUsage,
        promoCode: promotion.promoCode,
        applicableRoomTypes: promotion.applicableRoomTypes,
        applicableChannels: promotion.applicableChannels,
      }
    : {
        name: '',
        description: '',
        status: 'draft',
        discountType: 'percentage',
        discountValue: 10,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        applicableRoomTypes: [],
        applicableChannels: ['1'], // Direct channel by default
      };

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: defaultValues as PromotionFormValues,
  });

  const onSubmit = async (values: PromotionFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (promotion) {
        await updatePromotion(promotion.id, values);
        toast({
          title: 'Promotion updated',
          description: `${values.name} has been successfully updated.`,
        });
      } else {
        // Make sure all required properties are present for a new promotion
        const newPromotion: Omit<Promotion, 'id' | 'createdAt' | 'lastModified' | 'currentUsage'> = {
          name: values.name,
          description: values.description,
          status: values.status,
          startDate: values.startDate,
          endDate: values.endDate,
          discountType: values.discountType,
          discountValue: values.discountValue,
          minimumStay: values.minimumStay,
          minimumAdvanceBooking: values.minimumAdvanceBooking,
          maxUsage: values.maxUsage,
          promoCode: values.promoCode,
          applicableRoomTypes: values.applicableRoomTypes,
          applicableChannels: values.applicableChannels,
        };
        
        await addPromotion(newPromotion);
        toast({
          title: 'Promotion created',
          description: `${values.name} has been successfully created.`,
        });
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving promotion:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving the promotion.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle promo code generation
  const handleGeneratePromoCode = () => {
    const code = generatePromoCode();
    form.setValue('promoCode', code);
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
                    <SelectItem value="active">
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                        <span>Promotion is live</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="scheduled">
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>
                        <span>Will become active on start date</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="expired">
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-gray-100 text-gray-800 hover:bg-gray-100">Expired</Badge>
                        <span>No longer active</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="draft">
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Draft</Badge>
                        <span>Work in progress</span>
                      </div>
                    </SelectItem>
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
                  placeholder="Describe the promotion..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This will be displayed to guests
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
                          <span>Pick a date</span>
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
                          <span>Pick a date</span>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
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
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="percentage" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Percentage Discount (%)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
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
          </div>
          
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
                    <Input 
                      type="number" 
                      min="0.01" 
                      step={form.watch('discountType') === 'percentage' ? '1' : '0.01'} 
                      className="pl-7"
                      {...field}
                    />
                  </div>
                </FormControl>
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
                  <Input type="number" min="0" step="1" {...field} />
                </FormControl>
                <FormDescription>
                  Optional, leave empty for no minimum
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
                <FormLabel>Advance Booking (Days)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="1" {...field} />
                </FormControl>
                <FormDescription>
                  How many days in advance booking is required
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
                <FormLabel>Maximum Uses</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="1" {...field} />
                </FormControl>
                <FormDescription>
                  Leave empty for unlimited uses
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="promoCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Promo Code</FormLabel>
              <div className="flex space-x-2">
                <FormControl>
                  <Input placeholder="e.g. SUMMER23" {...field} />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGeneratePromoCode}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </div>
              <FormDescription>
                Optional code that guests need to enter to redeem this promotion
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="applicableRoomTypes"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Applicable Room Types</FormLabel>
                  <FormDescription>
                    Select room types this promotion applies to
                  </FormDescription>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
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
                  <FormLabel className="text-base">Distribution Channels</FormLabel>
                  <FormDescription>
                    Select channels this promotion is available on
                  </FormDescription>
                </div>
                <div className="space-y-2">
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
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting 
              ? 'Saving...' 
              : promotion 
                ? 'Update Promotion' 
                : 'Create Promotion'
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PromotionForm;
