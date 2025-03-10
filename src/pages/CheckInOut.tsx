
import React, { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import {
  Calendar,
  UserCheck,
  UserX,
  LogOut,
  ArrowRight,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useBooking, BookingStatus, Booking } from '@/contexts/BookingContext';
import { useNavigate } from 'react-router-dom';

const CheckInOut: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, loading, updateBookingStatus } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [checkInBookings, setCheckInBookings] = useState<Booking[]>([]);
  const [checkOutBookings, setCheckOutBookings] = useState<Booking[]>([]);
  const [earlyCheckInsBookings, setEarlyCheckInsBookings] = useState<Booking[]>([]);
  const [lateCheckOutsBookings, setLateCheckOutsBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [showCheckOutDialog, setShowCheckOutDialog] = useState(false);
  const [assignedRoom, setAssignedRoom] = useState('');
  
  // Filter bookings for check-in and check-out on the selected date
  useEffect(() => {
    if (!loading && bookings.length > 0) {
      const filterDate = (date: Date) => {
        return date.getDate() === selectedDate.getDate() && 
               date.getMonth() === selectedDate.getMonth() && 
               date.getFullYear() === selectedDate.getFullYear();
      };
      
      // Today's check-ins (confirmed status)
      const todayCheckIns = bookings.filter(booking => 
        filterDate(booking.checkIn) && 
        booking.bookingStatus === 'confirmed'
      );
      
      // Today's check-outs (checked_in status)
      const todayCheckOuts = bookings.filter(booking => 
        filterDate(booking.checkOut) && 
        booking.bookingStatus === 'checked_in'
      );
      
      // Tomorrow's check-ins (early check-ins possibility)
      const tomorrowDate = addDays(selectedDate, 1);
      const earlyCheckIns = bookings.filter(booking => 
        booking.checkIn.getDate() === tomorrowDate.getDate() && 
        booking.checkIn.getMonth() === tomorrowDate.getMonth() && 
        booking.checkIn.getFullYear() === tomorrowDate.getFullYear() && 
        booking.bookingStatus === 'confirmed'
      );
      
      // Yesterday's check-outs (late check-outs possibility)
      const yesterdayDate = addDays(selectedDate, -1);
      const lateCheckOuts = bookings.filter(booking => 
        booking.checkOut.getDate() === yesterdayDate.getDate() && 
        booking.checkOut.getMonth() === yesterdayDate.getMonth() && 
        booking.checkOut.getFullYear() === yesterdayDate.getFullYear() && 
        booking.bookingStatus === 'checked_in'
      );
      
      setCheckInBookings(todayCheckIns);
      setCheckOutBookings(todayCheckOuts);
      setEarlyCheckInsBookings(earlyCheckIns);
      setLateCheckOutsBookings(lateCheckOuts);
    }
  }, [selectedDate, bookings, loading]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement search logic if needed
  };

  const handleCheckIn = async (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCheckInDialog(true);
  };

  const handleCheckOut = async (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCheckOutDialog(true);
  };

  const confirmCheckIn = async () => {
    if (selectedBooking) {
      await updateBookingStatus(selectedBooking.id, 'checked_in');
      setShowCheckInDialog(false);
      setSelectedBooking(null);
      setAssignedRoom('');
    }
  };

  const confirmCheckOut = async () => {
    if (selectedBooking) {
      await updateBookingStatus(selectedBooking.id, 'checked_out');
      setShowCheckOutDialog(false);
      setSelectedBooking(null);
    }
  };

  const markAsNoShow = async (booking: Booking) => {
    await updateBookingStatus(booking.id, 'no_show');
  };

  const renderGuestInfo = (booking: Booking) => (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarFallback className="bg-primary/10 text-primary">
          {booking.guest.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">{booking.guest.name}</div>
        <div className="text-xs text-muted-foreground">
          {booking.adults} adults{booking.children > 0 ? `, ${booking.children} children` : ''}
        </div>
      </div>
    </div>
  );

  const renderEmptyState = (message: string) => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No bookings found</h3>
      <p className="text-muted-foreground mt-2">{message}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Check-in & Check-out</h1>
          <p className="text-muted-foreground">Manage guest arrivals and departures</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-md">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{format(selectedDate, "MMMM dd, yyyy")}</span>
          </div>
          <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
            Today
          </Button>
          <Button variant="outline" onClick={() => setSelectedDate(addDays(selectedDate, -1))}>
            Previous Day
          </Button>
          <Button variant="outline" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
            Next Day
          </Button>
        </div>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Find Guest</CardTitle>
          <CardDescription>Search for a specific guest to check-in or check-out</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex w-full max-w-3xl items-center space-x-2">
            <Input
              placeholder="Search by name, booking ID, or room number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      <Tabs defaultValue="check-in">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="check-in">
            <UserCheck className="h-4 w-4 mr-2" />
            Check-in
          </TabsTrigger>
          <TabsTrigger value="check-out">
            <LogOut className="h-4 w-4 mr-2" />
            Check-out
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="check-in" className="space-y-6 mt-6">
          {/* Regular Check-ins */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-green-500" />
                Today's Check-ins
              </CardTitle>
              <CardDescription>
                Guests scheduled to check in on {format(selectedDate, "MMMM dd, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : checkInBookings.length === 0 ? (
                renderEmptyState("No check-ins scheduled for today")
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Guest</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Stay Duration</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {checkInBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            {renderGuestInfo(booking)}
                          </TableCell>
                          <TableCell>{booking.propertyName}</TableCell>
                          <TableCell>{booking.roomName}</TableCell>
                          <TableCell className="font-mono text-xs">{booking.id}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-xs">From: {format(booking.checkIn, "MMM dd")}</span>
                              <span className="text-xs">To: {format(booking.checkOut, "MMM dd")}</span>
                              <span className="text-xs font-medium mt-1">
                                {Math.ceil((booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleCheckIn(booking)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Check In
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => markAsNoShow(booking)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                No Show
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Early Check-ins */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-amber-500" />
                Early Check-ins
              </CardTitle>
              <CardDescription>
                Guests eligible for early check-in (scheduled for tomorrow)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : earlyCheckInsBookings.length === 0 ? (
                renderEmptyState("No early check-ins available")
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Guest</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Scheduled For</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {earlyCheckInsBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            {renderGuestInfo(booking)}
                          </TableCell>
                          <TableCell>{booking.propertyName}</TableCell>
                          <TableCell>{booking.roomName}</TableCell>
                          <TableCell className="font-mono text-xs">{booking.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              Tomorrow
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCheckIn(booking)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Early Check In
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="check-out" className="space-y-6 mt-6">
          {/* Regular Check-outs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LogOut className="h-5 w-5 mr-2 text-blue-500" />
                Today's Check-outs
              </CardTitle>
              <CardDescription>
                Guests scheduled to check out on {format(selectedDate, "MMMM dd, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : checkOutBookings.length === 0 ? (
                renderEmptyState("No check-outs scheduled for today")
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Guest</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Stay Duration</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {checkOutBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            {renderGuestInfo(booking)}
                          </TableCell>
                          <TableCell>{booking.propertyName}</TableCell>
                          <TableCell>{booking.roomName}</TableCell>
                          <TableCell className="font-mono text-xs">{booking.id}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-xs">From: {format(booking.checkIn, "MMM dd")}</span>
                              <span className="text-xs">To: {format(booking.checkOut, "MMM dd")}</span>
                              <span className="text-xs font-medium mt-1">
                                {Math.ceil((booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleCheckOut(booking)}
                            >
                              <LogOut className="h-4 w-4 mr-1" />
                              Check Out
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Late Check-outs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-amber-500" />
                Late Check-outs
              </CardTitle>
              <CardDescription>
                Guests eligible for late check-out (scheduled for yesterday)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : lateCheckOutsBookings.length === 0 ? (
                renderEmptyState("No late check-outs available")
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Guest</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Scheduled For</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lateCheckOutsBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            {renderGuestInfo(booking)}
                          </TableCell>
                          <TableCell>{booking.propertyName}</TableCell>
                          <TableCell>{booking.roomName}</TableCell>
                          <TableCell className="font-mono text-xs">{booking.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              Yesterday
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCheckOut(booking)}
                            >
                              <LogOut className="h-4 w-4 mr-1" />
                              Late Check Out
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Check-in Dialog */}
      <Dialog open={showCheckInDialog} onOpenChange={setShowCheckInDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check-in Guest</DialogTitle>
            <DialogDescription>
              Complete the check-in process for {selectedBooking?.guest.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room-assignment" className="text-right">
                  Room Assignment
                </Label>
                <Select
                  value={assignedRoom}
                  onValueChange={setAssignedRoom}
                >
                  <SelectTrigger id="room-assignment" className="col-span-3">
                    <SelectValue placeholder="Assign a room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="101">Room 101</SelectItem>
                    <SelectItem value="102">Room 102</SelectItem>
                    <SelectItem value="201">Room 201</SelectItem>
                    <SelectItem value="202">Room 202</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="check-in-time" className="text-right">
                  Check-in Time
                </Label>
                <Input
                  id="check-in-time"
                  value={format(new Date(), "h:mm a")}
                  disabled
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 text-sm">
              {selectedBooking?.specialRequests ? (
                <>
                  <p className="font-medium mb-1">Special Requests:</p>
                  <p>{selectedBooking.specialRequests}</p>
                </>
              ) : (
                <p>No special requests noted for this booking.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCheckInDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmCheckIn} disabled={!assignedRoom}>
              Complete Check-in
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Check-out Dialog */}
      <Dialog open={showCheckOutDialog} onOpenChange={setShowCheckOutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check-out Guest</DialogTitle>
            <DialogDescription>
              Complete the check-out process for {selectedBooking?.guest.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="checkout-time" className="text-right">
                  Check-out Time
                </Label>
                <Input
                  id="checkout-time"
                  value={format(new Date(), "h:mm a")}
                  disabled
                  className="col-span-3"
                />
              </div>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-md space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Room charges</span>
                <span>${selectedBooking?.baseRate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Taxes and fees</span>
                <span>${selectedBooking ? (selectedBooking.taxes + selectedBooking.fees) : 0}</span>
              </div>
              <div className="flex justify-between items-center font-medium pt-2 border-t">
                <span>Total paid</span>
                <span>${selectedBooking?.totalAmount}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCheckOutDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmCheckOut}>
              Complete Check-out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckInOut;
