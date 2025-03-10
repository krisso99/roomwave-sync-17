
import React from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Room } from './BookingWidget';

type BookingSummaryProps = {
  dateRange: DateRange | undefined;
  room: Room | null;
  guests: { adults: number; children: number };
  nights: number;
  currency: string;
};

const BookingSummary: React.FC<BookingSummaryProps> = ({
  dateRange,
  room,
  guests,
  nights,
  currency,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (!room) return null;

  const roomTotal = room.pricePerNight * nights;
  const tax = roomTotal * 0.1; // Assuming 10% tax
  const total = roomTotal + tax;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Booking Summary</h3>
      
      <div className="bg-muted/50 p-4 rounded-lg space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium">Dates</span>
            <p className="text-sm text-muted-foreground">
              {dateRange?.from && dateRange?.to
                ? `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
                : 'Not selected'}
            </p>
          </div>
          <span className="text-sm">{nights} nights</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium">Guests</span>
            <p className="text-sm text-muted-foreground">
              {guests.adults} adults, {guests.children} children
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium">Room</span>
            <p className="text-sm text-muted-foreground">{room.name}</p>
          </div>
        </div>
        
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span>Room price ({nights} nights)</span>
            <span>{formatCurrency(roomTotal)}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span>Taxes and fees</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between items-center font-bold mt-3 pt-3 border-t">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
