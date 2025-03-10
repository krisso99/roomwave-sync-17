import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Calendar, 
  Plus,
  Download,
  CheckCircle2, 
  XCircle, 
  Clock, 
  MoreHorizontal,
  ArrowUpDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker';

// Mock data for bookings
const mockBookings = [
  {
    id: 'B001',
    guest: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    property: 'Riad Al Jazira',
    room: 'Jasmine Room',
    checkIn: '2023-10-15',
    checkOut: '2023-10-18',
    totalAmount: 360,
    status: 'confirmed',
    channel: 'Booking.com',
    createdAt: '2023-09-10T14:30:00Z',
  },
  {
    id: 'B002',
    guest: 'Michel Dubois',
    email: 'michel.d@example.com',
    property: 'Dar Anika',
    room: 'Rose Room',
    checkIn: '2023-10-20',
    checkOut: '2023-10-25',
    totalAmount: 550,
    status: 'confirmed',
    channel: 'Direct',
    createdAt: '2023-09-12T09:15:00Z',
  },
  {
    id: 'B003',
    guest: 'Elena Rossi',
    email: 'elena.r@example.com',
    property: 'Riad Kniza',
    room: 'Mint Suite',
    checkIn: '2023-11-05',
    checkOut: '2023-11-10',
    totalAmount: 900,
    status: 'pending',
    channel: 'Airbnb',
    createdAt: '2023-09-15T11:20:00Z',
  },
  {
    id: 'B004',
    guest: 'James Smith',
    email: 'james.s@example.com',
    property: 'Riad Al Jazira',
    room: 'Saffron Room',
    checkIn: '2023-11-12',
    checkOut: '2023-11-16',
    totalAmount: 500,
    status: 'cancelled',
    channel: 'Expedia',
    createdAt: '2023-09-08T16:45:00Z',
  },
  {
    id: 'B005',
    guest: 'Maria Garcia',
    email: 'maria.g@example.com',
    property: 'Kasbah Tamadot',
    room: 'Mountain View Suite',
    checkIn: '2023-10-28',
    checkOut: '2023-11-02',
    totalAmount: 1200,
    status: 'confirmed',
    channel: 'Booking.com',
    createdAt: '2023-09-18T10:30:00Z',
  },
  {
    id: 'B006',
    guest: 'Ahmed Hassan',
    email: 'ahmed.h@example.com',
    property: 'Riad Kniza',
    room: 'Jasmine Room',
    checkIn: '2023-12-05',
    checkOut: '2023-12-10',
    totalAmount: 625,
    status: 'pending',
    channel: 'Direct',
    createdAt: '2023-09-20T13:15:00Z',
  },
];

const Bookings = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortField, setSortField] = useState<string>('createdAt');

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = 
      booking.guest.toLowerCase().includes(searchQuery.toLowerCase()) || 
      booking.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesChannel = channelFilter === 'all' || booking.channel === channelFilter;
    
    return matchesSearch && matchesStatus && matchesChannel;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'checkIn' || sortField === 'checkOut' || sortField === 'createdAt') {
      comparison = new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime();
    } else if (sortField === 'totalAmount') {
      comparison = a[sortField] - b[sortField];
    } else {
      comparison = a[sortField].localeCompare(b[sortField]);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAddBooking = () => {
    toast({
      title: "Booking added",
      description: "The new booking has been successfully added.",
    });
    setIsAddDialogOpen(false);
  };

  const handleCancelBooking = (id: string) => {
    toast({
      title: "Booking cancelled",
      description: `Booking #${id} has been cancelled.`,
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-display font-bold">Bookings</h1>
        
        <div className="flex w-full md:w-auto flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search bookings..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="Booking.com">Booking.com</SelectItem>
              <SelectItem value="Airbnb">Airbnb</SelectItem>
              <SelectItem value="Expedia">Expedia</SelectItem>
              <SelectItem value="Direct">Direct</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" />
                Add Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Booking</DialogTitle>
                <DialogDescription>
                  Enter the details for a new direct booking.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guest">Guest Name</Label>
                    <Input id="guest" placeholder="Full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Email address" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="property">Property</Label>
                    <Select>
                      <SelectTrigger id="property">
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Riad Al Jazira</SelectItem>
                        <SelectItem value="2">Dar Anika</SelectItem>
                        <SelectItem value="3">Riad Kniza</SelectItem>
                        <SelectItem value="4">Kasbah Tamadot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room">Room</Label>
                    <Select>
                      <SelectTrigger id="room">
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="101">Jasmine Room</SelectItem>
                        <SelectItem value="102">Rose Room</SelectItem>
                        <SelectItem value="103">Mint Suite</SelectItem>
                        <SelectItem value="104">Saffron Room</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <CalendarDateRangePicker />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Total Amount</Label>
                    <Input id="amount" type="number" placeholder="Amount in USD" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Add any additional notes here" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBooking}>
                  Add Booking
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{sortedBookings.length}</span> bookings
        </div>

        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('id')}>
                    ID
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('guest')}>
                    Guest
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Property / Room</TableHead>
                <TableHead>
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('checkIn')}>
                    Check In
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('checkOut')}>
                    Check Out
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('totalAmount')}>
                    Amount
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBookings.length > 0 ? (
                sortedBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>
                      <div>
                        {booking.guest}
                        <div className="text-sm text-muted-foreground">{booking.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {booking.property}
                        <div className="text-sm text-muted-foreground">{booking.room}</div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.checkIn}</TableCell>
                    <TableCell>{booking.checkOut}</TableCell>
                    <TableCell>${booking.totalAmount}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>{booking.channel}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {booking.status === 'pending' && (
                            <DropdownMenuItem>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Confirm
                            </DropdownMenuItem>
                          )}
                          {booking.status !== 'cancelled' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No bookings found</p>
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('all');
                          setChannelFilter('all');
                        }}
                      >
                        Reset filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Bookings;
