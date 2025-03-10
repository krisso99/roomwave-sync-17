
import React, { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, isWithinInterval, parse } from 'date-fns';
import { Calendar, CalendarCell, CalendarDays, CalendarGrid, CalendarGridBody, CalendarGridHeader, CalendarHeader, CalendarHeading, CalendarMonth, CalendarMonthName, CalendarNext, CalendarPrevious, CalendarTrigger } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronLeft, ChevronRight, Filter, Users, Calendar as CalendarIcon, MapPin, ArrowRight, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

// Mock bookings data
const mockBookings = [
  {
    id: 'b1',
    guest: 'Sarah Johnson',
    property: 'Riad Al Jazira',
    room: 'Jasmine Room',
    checkIn: '2023-10-15',
    checkOut: '2023-10-18',
    status: 'confirmed',
    channel: 'Booking.com',
  },
  {
    id: 'b2',
    guest: 'Michel Dubois',
    property: 'Dar Anika',
    room: 'Rose Room',
    checkIn: '2023-10-20',
    checkOut: '2023-10-25',
    status: 'confirmed',
    channel: 'Direct',
  },
  {
    id: 'b3',
    guest: 'Elena Rossi',
    property: 'Riad Kniza',
    room: 'Mint Suite',
    checkIn: '2023-11-05',
    checkOut: '2023-11-10',
    status: 'pending',
    channel: 'Airbnb',
  },
  {
    id: 'b4',
    guest: 'James Smith',
    property: 'Riad Al Jazira',
    room: 'Saffron Room',
    checkIn: '2023-11-12',
    checkOut: '2023-11-16',
    status: 'confirmed',
    channel: 'Expedia',
  },
  {
    id: 'b5',
    guest: 'Maria Garcia',
    property: 'Kasbah Tamadot',
    room: 'Mountain View Suite',
    checkIn: '2023-10-28',
    checkOut: '2023-11-02',
    status: 'confirmed',
    channel: 'Booking.com',
  },
  {
    id: 'b6',
    guest: 'Ahmed Hassan',
    property: 'Riad Kniza',
    room: 'Jasmine Room',
    checkIn: '2023-10-25',
    checkOut: '2023-10-28',
    status: 'cancelled',
    channel: 'Direct',
  },
  {
    id: 'b7',
    guest: 'Sophie Mueller',
    property: 'Dar Anika',
    room: 'Mint Suite',
    checkIn: '2023-11-18',
    checkOut: '2023-11-23',
    status: 'confirmed',
    channel: 'Airbnb',
  },
  {
    id: 'b8',
    guest: 'David Kim',
    property: 'Riad Al Jazira',
    room: 'Rose Room',
    checkIn: '2023-10-12',
    checkOut: '2023-10-15',
    status: 'completed',
    channel: 'Booking.com',
  },
];

// Mock properties data
const mockProperties = [
  { id: '1', name: 'Riad Al Jazira' },
  { id: '2', name: 'Dar Anika' },
  { id: '3', name: 'Riad Kniza' },
  { id: '4', name: 'Kasbah Tamadot' },
];

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  // Filter bookings based on property selection
  const filteredBookings = mockBookings.filter(booking => 
    selectedProperty === 'all' || 
    mockProperties.find(p => p.name === booking.property)?.id === selectedProperty
  );

  const getBookingsForDate = (date: Date) => {
    return filteredBookings.filter(booking => {
      const checkIn = parse(booking.checkIn, 'yyyy-MM-dd', new Date());
      const checkOut = parse(booking.checkOut, 'yyyy-MM-dd', new Date());
      
      return isWithinInterval(date, { start: checkIn, end: checkOut }) ||
             isSameDay(date, checkIn) || 
             isSameDay(date, checkOut);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-amber-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handlePrevious = () => {
    if (view === 'day') {
      setCurrentDate(prev => addDays(prev, -1));
    } else if (view === 'week') {
      setCurrentDate(prev => subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }
  };

  const handleNext = () => {
    if (view === 'day') {
      setCurrentDate(prev => addDays(prev, 1));
    } else if (view === 'week') {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleBookingClick = (bookingId: string) => {
    setSelectedBooking(bookingId);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-display font-bold">Calendar</h1>
        
        <div className="flex w-full md:w-auto flex-col sm:flex-row gap-3">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-full sm:w-48">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <SelectValue placeholder="All Properties" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {mockProperties.map(property => (
                <SelectItem key={property.id} value={property.id}>{property.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={view} onValueChange={(value: any) => setView(value)}>
            <SelectTrigger className="w-full sm:w-36">
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <SelectValue placeholder="View" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="month">Month View</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Status</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer">Confirmed</Badge>
                    <Badge variant="outline" className="cursor-pointer">Pending</Badge>
                    <Badge variant="outline" className="cursor-pointer">Cancelled</Badge>
                    <Badge variant="outline" className="cursor-pointer">Completed</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Channels</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer">Booking.com</Badge>
                    <Badge variant="outline" className="cursor-pointer">Airbnb</Badge>
                    <Badge variant="outline" className="cursor-pointer">Expedia</Badge>
                    <Badge variant="outline" className="cursor-pointer">Direct</Badge>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-medium">
                  {view === 'day' 
                    ? format(currentDate, 'MMMM d, yyyy') 
                    : view === 'week' 
                      ? `${format(days[0], 'MMM d')} - ${format(days[6], 'MMM d, yyyy')}`
                      : format(currentDate, 'MMMM yyyy')}
                </h2>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {view === 'week' && (
              <div className="mt-4">
                <div className="grid grid-cols-7 gap-px bg-border">
                  {days.map((day, i) => (
                    <div key={i} className="bg-card">
                      <div className="px-2 py-1.5 text-center">
                        <div className="text-sm font-medium">{format(day, 'EEE')}</div>
                        <div 
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm ${
                            isSameDay(day, new Date()) 
                              ? 'bg-primary text-primary-foreground' 
                              : ''
                          }`}
                          onClick={() => handleDateClick(day)}
                        >
                          {format(day, 'd')}
                        </div>
                      </div>
                      <div className="h-80 overflow-auto px-1 py-2 space-y-1">
                        {getBookingsForDate(day).map((booking, bookingIndex) => (
                          <div 
                            key={`${booking.id}-${bookingIndex}`}
                            className={`px-2 py-1 rounded text-xs mb-1 cursor-pointer border-l-4 ${getStatusColor(booking.status)} border-${booking.status} bg-muted`}
                            onClick={() => handleBookingClick(booking.id)}
                          >
                            <div className="font-medium truncate">{booking.guest}</div>
                            <div className="flex justify-between mt-0.5">
                              <span>{booking.room}</span>
                              <span className="text-muted-foreground">{booking.channel}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {view === 'day' && (
              <div className="mt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-card border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">{format(currentDate, 'EEEE, MMMM d, yyyy')}</h3>
                    <div className="space-y-3">
                      {getBookingsForDate(currentDate).length > 0 ? (
                        getBookingsForDate(currentDate).map((booking, index) => (
                          <div 
                            key={index}
                            className="border-l-4 border-primary bg-muted p-3 rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                            onClick={() => handleBookingClick(booking.id)}
                          >
                            <div className="flex justify-between mb-1">
                              <h4 className="font-medium">{booking.guest}</h4>
                              <Badge variant={booking.status === 'confirmed' ? 'outline' : 'secondary'}>
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {booking.property} - {booking.room}
                            </div>
                            <div className="flex justify-between text-sm">
                              <div className="flex items-center">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                <span>{booking.checkIn}</span>
                                <ArrowRight className="mx-1 h-3 w-3" />
                                <span>{booking.checkOut}</span>
                              </div>
                              <div>{booking.channel}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <BookOpen className="mx-auto h-8 w-8 mb-2" />
                          <p>No bookings for this day</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {view === 'month' && (
              <div className="mt-4">
                <Calendar
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={(date) => date && handleDateClick(date)}
                  className="rounded-md border"
                  month={currentDate}
                  showOutsideDays
                />
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Booking details card */}
        {selectedBooking && (
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>
                Booking information for the selected reservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const booking = mockBookings.find(b => b.id === selectedBooking);
                if (!booking) return null;
                
                return (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{booking.guest}</h3>
                        <p className="text-muted-foreground">{booking.channel}</p>
                      </div>
                      <Badge variant={booking.status === 'confirmed' ? 'outline' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Property</h4>
                        <p>{booking.property}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Room</h4>
                        <p>{booking.room}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Check In</h4>
                        <p>{booking.checkIn}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Check Out</h4>
                        <p>{booking.checkOut}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setSelectedBooking(null)}>
                        Close
                      </Button>
                      <Button>
                        View Full Details
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
