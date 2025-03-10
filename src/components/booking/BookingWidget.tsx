
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, User, CreditCard, BedDouble, Check } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RoomSelector from './RoomSelector';
import GuestInfoForm from './GuestInfoForm';
import PaymentForm from './PaymentForm';
import BookingSummary from './BookingSummary';
import { DateRange } from 'react-day-picker';

export type BookingWidgetProps = {
  propertyName: string;
  propertyLogo?: string;
  primaryColor?: string;
  accentColor?: string;
  currency?: string;
};

export type Room = {
  id: string;
  name: string;
  description: string;
  maxOccupancy: number;
  pricePerNight: number;
  imageUrl: string;
  amenities: string[];
};

const STEPS = {
  DATES: 0,
  ROOMS: 1,
  GUEST_INFO: 2,
  PAYMENT: 3,
  CONFIRMATION: 4,
};

const BookingWidget: React.FC<BookingWidgetProps> = ({
  propertyName,
  propertyLogo,
  primaryColor = '#8B5CF6',
  accentColor = '#C4B5FD',
  currency = 'USD',
}) => {
  const [currentStep, setCurrentStep] = useState(STEPS.DATES);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 2)),
  });
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  
  // Mock data for demo
  const availableRooms: Room[] = [
    {
      id: '1',
      name: 'Deluxe Room',
      description: 'Spacious room with a beautiful view',
      maxOccupancy: 2,
      pricePerNight: 120,
      imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      amenities: ['Free WiFi', 'Breakfast', 'Air conditioning'],
    },
    {
      id: '2',
      name: 'Suite',
      description: 'Luxury suite with private balcony',
      maxOccupancy: 4,
      pricePerNight: 220,
      imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      amenities: ['Free WiFi', 'Breakfast', 'Air conditioning', 'Mini bar', 'Jacuzzi'],
    },
  ];

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case STEPS.DATES:
        return <Calendar className="h-5 w-5" />;
      case STEPS.ROOMS:
        return <BedDouble className="h-5 w-5" />;
      case STEPS.GUEST_INFO:
        return <User className="h-5 w-5" />;
      case STEPS.PAYMENT:
        return <CreditCard className="h-5 w-5" />;
      case STEPS.CONFIRMATION:
        return <Check className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleGuestsChange = (type: 'adults' | 'children', value: number) => {
    setGuests(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const calculateNights = () => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    return Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.DATES:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select your stay dates</h3>
            <DateRangePicker 
              dateRange={dateRange} 
              onDateRangeChange={handleDateChange} 
              className="w-full"
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="adults">Adults</Label>
                <Input
                  id="adults"
                  type="number"
                  min={1}
                  max={10}
                  value={guests.adults}
                  onChange={(e) => handleGuestsChange('adults', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="children">Children</Label>
                <Input
                  id="children"
                  type="number"
                  min={0}
                  max={10}
                  value={guests.children}
                  onChange={(e) => handleGuestsChange('children', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        );
      case STEPS.ROOMS:
        return (
          <RoomSelector
            rooms={availableRooms}
            selectedRoom={selectedRoom}
            onSelectRoom={setSelectedRoom}
            nights={calculateNights()}
            currency={currency}
          />
        );
      case STEPS.GUEST_INFO:
        return <GuestInfoForm />;
      case STEPS.PAYMENT:
        return (
          <div className="space-y-6">
            <BookingSummary
              dateRange={dateRange}
              room={selectedRoom}
              guests={guests}
              nights={calculateNights()}
              currency={currency}
            />
            <PaymentForm />
          </div>
        );
      case STEPS.CONFIRMATION:
        return (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-800">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Booking Confirmed!</h3>
            <p>Thank you for choosing {propertyName}.</p>
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to your email address.
            </p>
            <div className="border p-4 mt-6 rounded-md bg-muted/50">
              <h4 className="font-medium">Booking Details</h4>
              <p className="text-sm mt-2">
                <span className="font-medium">Dates:</span>{' '}
                {dateRange?.from && dateRange?.to
                  ? `${format(dateRange.from, 'PP')} - ${format(dateRange.to, 'PP')}`
                  : 'Not selected'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Room:</span> {selectedRoom?.name || 'Not selected'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Guests:</span> {guests.adults} adults, {guests.children} children
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case STEPS.DATES:
        return dateRange?.from && dateRange?.to;
      case STEPS.ROOMS:
        return selectedRoom !== null;
      case STEPS.GUEST_INFO:
        return true; // For demo purposes, assume form is valid
      case STEPS.PAYMENT:
        return true; // For demo purposes, assume payment is valid
      default:
        return false;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg animate-fade-in overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-display">
            {propertyLogo ? (
              <img src={propertyLogo} alt={propertyName} className="h-8" />
            ) : (
              propertyName
            )}
          </CardTitle>
          <div className="flex space-x-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${
                  i <= currentStep ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {renderStepContent()}
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6 bg-muted/30">
        {currentStep > STEPS.DATES && currentStep < STEPS.CONFIRMATION ? (
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
        ) : (
          <div /> // Empty div to maintain layout
        )}
        {currentStep < STEPS.CONFIRMATION ? (
          <Button 
            onClick={nextStep} 
            disabled={!canProceed()}
            style={{ backgroundColor: primaryColor }}
            className="hover:opacity-90"
          >
            {currentStep === STEPS.PAYMENT ? 'Complete Booking' : 'Continue'}
          </Button>
        ) : (
          <Button onClick={() => setCurrentStep(STEPS.DATES)}>Book Another Stay</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookingWidget;
