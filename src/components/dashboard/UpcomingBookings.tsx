
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar, ArrowRight, UserCheck, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

// Mock data
const arrivals = [
  {
    id: 'b1',
    guest: 'Sarah Johnson',
    guests: 2,
    property: 'Riad Al Jazira',
    room: 'Jasmine Suite',
    date: 'Today',
    time: '14:00',
    channel: 'Booking.com',
    status: 'confirmed'
  },
  {
    id: 'b2',
    guest: 'Michel Dubois',
    guests: 3,
    property: 'Dar Anika',
    room: 'Rose Suite',
    date: 'Today',
    time: '15:30',
    channel: 'Direct',
    status: 'confirmed'
  },
  {
    id: 'b3',
    guest: 'Elena Rossi',
    guests: 2,
    property: 'Riad Kniza',
    room: 'Mint Room',
    date: 'Tomorrow',
    time: '12:00',
    channel: 'Airbnb',
    status: 'pending'
  },
  {
    id: 'b4',
    guest: 'James Smith',
    guests: 4,
    property: 'Kasbah Tamadot',
    room: 'Mountain View Suite',
    date: 'Tomorrow',
    time: '16:00',
    channel: 'Expedia',
    status: 'confirmed'
  },
  {
    id: 'b5',
    guest: 'Mohammed Ali',
    guests: 2,
    property: 'Riad Al Jazira',
    room: 'Saffron Room',
    date: 'In 2 days',
    time: '13:30',
    channel: 'Booking.com',
    status: 'confirmed'
  }
];

const departures = [
  {
    id: 'd1',
    guest: 'David Kim',
    guests: 2,
    property: 'Riad Al Jazira',
    room: 'Jasmine Suite',
    date: 'Today',
    time: '11:00',
    channel: 'Booking.com',
    status: 'confirmed'
  },
  {
    id: 'd2',
    guest: 'Sophie Mueller',
    guests: 3,
    property: 'Dar Anika',
    room: 'Rose Suite',
    date: 'Today',
    time: '10:30',
    channel: 'Airbnb',
    status: 'confirmed'
  },
  {
    id: 'd3',
    guest: 'John Garcia',
    guests: 2,
    property: 'Riad Kniza',
    room: 'Mint Room',
    date: 'Tomorrow',
    time: '12:00',
    channel: 'Expedia',
    status: 'confirmed'
  },
  {
    id: 'd4',
    guest: 'Ahmed Hassan',
    guests: 1,
    property: 'Kasbah Tamadot',
    room: 'Standard Room',
    date: 'Tomorrow',
    time: '10:00',
    channel: 'Direct',
    status: 'confirmed'
  }
];

interface UpcomingBookingsProps {
  className?: string;
}

export const UpcomingBookings: React.FC<UpcomingBookingsProps> = ({
  className = ''
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          Upcoming Activity
        </CardTitle>
        <CardDescription>
          Check-ins and check-outs for the next 7 days
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue="arrivals" className="w-full">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="arrivals">Check-ins</TabsTrigger>
            <TabsTrigger value="departures">Check-outs</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="arrivals" className="m-0">
          <ScrollArea className="h-[300px]">
            <div className="px-6 py-2 space-y-3">
              {arrivals.map((booking) => (
                <div 
                  key={booking.id} 
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/app/bookings/${booking.id}`)}
                >
                  <div className="flex justify-between mb-1">
                    <div className="font-medium">{booking.guest}</div>
                    <Badge variant={booking.status === 'confirmed' ? 'outline' : 'secondary'}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="text-sm flex justify-between mb-2">
                    <span className="text-muted-foreground">{booking.property}</span>
                    <span className="text-primary">{booking.channel}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{booking.date} {booking.time}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{booking.guests} guests</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="departures" className="m-0">
          <ScrollArea className="h-[300px]">
            <div className="px-6 py-2 space-y-3">
              {departures.map((booking) => (
                <div 
                  key={booking.id} 
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/app/bookings/${booking.id}`)}
                >
                  <div className="flex justify-between mb-1">
                    <div className="font-medium">{booking.guest}</div>
                    <Badge variant={booking.status === 'confirmed' ? 'outline' : 'secondary'}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="text-sm flex justify-between mb-2">
                    <span className="text-muted-foreground">{booking.property}</span>
                    <span className="text-primary">{booking.channel}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{booking.date} {booking.time}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{booking.guests} guests</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      <CardFooter className="flex justify-between p-4 border-t">
        <Button variant="outline" size="sm" onClick={() => navigate('/app/check-in-out')}>
          <UserCheck className="h-4 w-4 mr-2" />
          Check-in/out
        </Button>
        <Button size="sm" onClick={() => navigate('/app/calendar')}>
          <Calendar className="h-4 w-4 mr-2" />
          View Calendar
        </Button>
      </CardFooter>
    </Card>
  );
};
