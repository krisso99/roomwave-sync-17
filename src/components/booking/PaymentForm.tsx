
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, DollarSign, X } from 'lucide-react';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PaymentForm: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Payment Information</h3>
      
      <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="card" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Credit Card
          </TabsTrigger>
          <TabsTrigger value="paypal" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            PayPal
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="card" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">Name on Card</Label>
            <Input id="cardName" placeholder="John Doe" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <Input 
                id="cardNumber" 
                placeholder="1234 5678 9012 3456" 
                required 
                className="pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-5 w-auto" />
                <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="MasterCard" className="h-5 w-auto" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input id="expiry" placeholder="MM/YY" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="123" required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="billingAddress">Billing Address</Label>
            <Input id="billingAddress" placeholder="123 Main St" required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="New York" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input id="zipCode" placeholder="10001" required />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="paypal" className="pt-4">
          <div className="text-center p-6 border rounded-md">
            <p className="mb-4">You will be redirected to PayPal to complete your payment.</p>
            <img 
              src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" 
              alt="PayPal" 
              className="h-12 mx-auto"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 border-t pt-4">
        <div className="flex items-start space-x-2">
          <div className="flex h-5 items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              required
            />
          </div>
          <div className="text-sm">
            <label htmlFor="terms" className="font-medium text-gray-900">
              I agree to the Terms and Conditions
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              By completing this booking, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
