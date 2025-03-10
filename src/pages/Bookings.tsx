
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Search, 
  Filter, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  BadgeCheck,
  LogOut,
  X,
  FileText,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { useBooking, BookingStatus } from '@/contexts/BookingContext';

const Bookings: React.FC = () => {
  const navigate = useNavigate();
  const { 
    filteredBookings, 
    loading, 
    filterCriteria, 
    setFilterCriteria, 
    updateBookingStatus 
  } = useBooking();
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [searchInput, setSearchInput] = useState('');

  // When date range is selected, update the filter criteria
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      setFilterCriteria({
        dateRange: {
          from: dateRange.from,
          to: dateRange.to,
        },
      });
    } else if (!dateRange.from && !dateRange.to) {
      setFilterCriteria({
        dateRange: null,
      });
    }
  }, [dateRange, setFilterCriteria]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilterCriteria({ searchTerm: searchInput });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, setFilterCriteria]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterCriteria({ searchTerm: searchInput });
  };

  const handleStatusFilter = (status: string) => {
    setFilterCriteria({ status: status as BookingStatus | 'all' });
  };

  const handleSourceFilter = (source: string) => {
    setFilterCriteria({ source: source });
  };

  const clearFilters = () => {
    setFilterCriteria({
      status: 'all',
      searchTerm: '',
      dateRange: null,
      source: 'all'
    });
    setSearchInput('');
    setDateRange({ from: undefined, to: undefined });
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Confirmed</Badge>;
      case 'checked_in':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"><BadgeCheck className="h-3 w-3" /> Checked In</Badge>;
      case 'checked_out':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1"><LogOut className="h-3 w-3" /> Checked Out</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"><X className="h-3 w-3" /> Cancelled</Badge>;
      case 'no_show':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> No Show</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No bookings found</h3>
      <p className="text-muted-foreground mt-2 mb-4">
        There are no bookings matching your current filters.
      </p>
      <Button onClick={clearFilters}>Clear Filters</Button>
    </div>
  );

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">Manage all your property bookings in one place</p>
        </div>
      </div>

      {/* Filters and search section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
          <CardDescription>Narrow down your booking list</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <form onSubmit={handleSearch} className="flex w-full max-w-xl items-center space-x-2">
                <Input
                  placeholder="Search by guest, booking ID, or property..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="secondary">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </div>

            {/* Status Filter */}
            <div>
              <Select 
                value={filterCriteria.status} 
                onValueChange={handleStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="checked_in">Checked In</SelectItem>
                  <SelectItem value="checked_out">Checked Out</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Source Filter */}
            <div>
              <Select 
                value={filterCriteria.source} 
                onValueChange={handleSourceFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="Booking.com">Booking.com</SelectItem>
                  <SelectItem value="Airbnb">Airbnb</SelectItem>
                  <SelectItem value="Expedia">Expedia</SelectItem>
                  <SelectItem value="Direct">Direct</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="md:col-span-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      "Select date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => setDateRange({ 
                      from: range?.from, 
                      to: range?.to 
                    })}
                    numberOfMonths={2}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Clear Filters Button */}
            <div className="md:col-span-2 flex items-end">
              <Button 
                variant="ghost" 
                onClick={clearFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'} found
              </CardDescription>
            </div>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all" onClick={() => handleStatusFilter('all')}>
                  All
                </TabsTrigger>
                <TabsTrigger value="upcoming" onClick={() => handleStatusFilter('confirmed')}>
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="checked_in" onClick={() => handleStatusFilter('checked_in')}>
                  Checked In
                </TabsTrigger>
                <TabsTrigger value="pending" onClick={() => handleStatusFilter('pending')}>
                  Pending
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-3 text-muted-foreground">Loading bookings...</span>
            </div>
          ) : filteredBookings.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow 
                      key={booking.id} 
                      className="cursor-pointer group"
                      onClick={() => navigate(`/app/bookings/${booking.id}`)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {booking.id}
                          {booking.isNew && (
                            <Badge variant="secondary" className="ml-2 bg-blue-500 text-white hover:bg-blue-600">New</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{booking.guest.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">{format(booking.checkIn, "MMM dd, yyyy")}</span>
                          <span className="text-xs text-muted-foreground">to {format(booking.checkOut, "MMM dd, yyyy")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{booking.propertyName}</span>
                          <span className="text-xs text-muted-foreground">{booking.roomName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.bookingStatus)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{booking.source}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">${booking.totalAmount}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/app/bookings/${booking.id}`);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          View
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
    </div>
  );
};

export default Bookings;
