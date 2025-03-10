
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

const GuestInfoForm: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Guest Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" placeholder="Enter your first name" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" placeholder="Enter your last name" required />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          required
        />
        <p className="text-xs text-muted-foreground">
          Booking confirmation will be sent to this email
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="specialRequests">Special Requests</Label>
        <Textarea
          id="specialRequests"
          placeholder="Let us know if you have any special requests"
          className="min-h-[100px]"
        />
      </div>
      
      <div className="flex items-start space-x-2 pt-2">
        <Checkbox id="newsletter" />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="newsletter"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Sign up for newsletters and special offers
          </label>
          <p className="text-xs text-muted-foreground">
            We'll never share your email with anyone else.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestInfoForm;
