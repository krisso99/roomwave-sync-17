
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'checked_in' 
  | 'checked_out' 
  | 'cancelled' 
  | 'no_show';

export type PaymentStatus = 
  | 'pending' 
  | 'partial' 
  | 'paid' 
  | 'refunded';

export interface GuestInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality?: string;
  address?: string;
  documents?: string[];
}

export interface Message {
  id: string;
  timestamp: Date;
  sender: 'guest' | 'host' | 'system';
  content: string;
  attachments?: string[];
  read: boolean;
}

export interface BookingNote {
  id: string;
  timestamp: Date;
  author: string;
  content: string;
  attachments?: string[];
}

export interface Booking {
  id: string;
  propertyId: string;
  roomId: string;
  propertyName: string;
  roomName: string;
  guest: GuestInfo;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  baseRate: number;
  taxes: number;
  fees: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  source: string;
  sourceBookingId?: string;
  createdAt: Date;
  modifiedAt?: Date;
  specialRequests?: string;
  notes?: BookingNote[];
  messages?: Message[];
  assignedRoom?: string;
  isNew?: boolean;
}

interface BookingContextProps {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  currentBooking: Booking | null;
  filteredBookings: Booking[];
  filterCriteria: {
    status: BookingStatus | 'all';
    searchTerm: string;
    dateRange: { from: Date | null; to: Date | null } | null;
    source: string | 'all';
  };
  fetchBookings: () => Promise<void>;
  fetchBookingById: (id: string) => Promise<void>;
  updateBooking: (booking: Booking) => Promise<void>;
  cancelBooking: (id: string, reason: string) => Promise<void>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  addBookingNote: (bookingId: string, note: Omit<BookingNote, 'id' | 'timestamp'>) => Promise<void>;
  sendMessage: (bookingId: string, content: string, attachments?: string[]) => Promise<void>;
  setFilterCriteria: (criteria: Partial<BookingContextProps['filterCriteria']>) => void;
}

const BookingContext = createContext<BookingContextProps | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterCriteria, setFilterCriteria] = useState({
    status: 'all' as BookingStatus | 'all',
    searchTerm: '',
    dateRange: null as { from: Date | null; to: Date | null } | null,
    source: 'all' as string | 'all'
  });

  // Mock data generator for testing
  const generateMockBookings = (): Booking[] => {
    const sources = ['Booking.com', 'Airbnb', 'Expedia', 'Direct'];
    const statuses: BookingStatus[] = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'];
    const paymentStatuses: PaymentStatus[] = ['pending', 'partial', 'paid', 'refunded'];
    const properties = [
      { id: '1', name: 'Riad Al Jazira' },
      { id: '2', name: 'Coastal Villa' },
      { id: '3', name: 'Mountain Retreat' }
    ];
    const rooms = [
      { id: '101', name: 'Jasmine Room' },
      { id: '102', name: 'Rose Room' },
      { id: '103', name: 'Mint Suite' },
      { id: '104', name: 'Saffron Room' }
    ];

    return Array.from({ length: 30 }, (_, index) => {
      const property = properties[Math.floor(Math.random() * properties.length)];
      const room = rooms[Math.floor(Math.random() * rooms.length)];
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + Math.floor(Math.random() * 30) - 15);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + Math.floor(Math.random() * 10) + 1);
      
      const baseRate = Math.floor(Math.random() * 200) + 100;
      const taxes = Math.floor(baseRate * 0.12);
      const fees = Math.floor(baseRate * 0.05);
      
      return {
        id: `booking-${index + 1}`,
        propertyId: property.id,
        roomId: room.id,
        propertyName: property.name,
        roomName: room.name,
        guest: {
          id: `guest-${index + 1}`,
          name: [`John Smith`, `Maria Garcia`, `James Johnson`, `Li Wei`, `Sarah Lee`][Math.floor(Math.random() * 5)],
          email: `guest${index + 1}@example.com`,
          phone: `+1234567${index.toString().padStart(4, '0')}`,
          nationality: ['USA', 'UK', 'Spain', 'France', 'Germany', 'China'][Math.floor(Math.random() * 6)]
        },
        checkIn,
        checkOut,
        adults: Math.floor(Math.random() * 3) + 1,
        children: Math.floor(Math.random() * 3),
        baseRate,
        taxes,
        fees,
        totalAmount: baseRate + taxes + fees,
        paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
        bookingStatus: statuses[Math.floor(Math.random() * statuses.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        sourceBookingId: `SRC-${Math.floor(Math.random() * 1000000)}`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
        specialRequests: Math.random() > 0.7 ? 'Late check-in requested. Prefer high floor room.' : undefined,
        isNew: Math.random() > 0.8
      };
    });
  };

  // Initial fetch
  useEffect(() => {
    fetchBookings();
  }, []);

  // Apply filters whenever the criteria changes
  useEffect(() => {
    applyFilters();
  }, [filterCriteria, bookings]);

  const applyFilters = () => {
    let result = [...bookings];

    // Filter by status
    if (filterCriteria.status !== 'all') {
      result = result.filter(booking => booking.bookingStatus === filterCriteria.status);
    }

    // Filter by search term
    if (filterCriteria.searchTerm) {
      const term = filterCriteria.searchTerm.toLowerCase();
      result = result.filter(booking => 
        booking.guest.name.toLowerCase().includes(term) ||
        booking.id.toLowerCase().includes(term) ||
        booking.sourceBookingId?.toLowerCase().includes(term) ||
        booking.propertyName.toLowerCase().includes(term) ||
        booking.roomName.toLowerCase().includes(term)
      );
    }

    // Filter by date range
    if (filterCriteria.dateRange?.from && filterCriteria.dateRange?.to) {
      const from = filterCriteria.dateRange.from;
      const to = filterCriteria.dateRange.to;
      result = result.filter(booking => 
        (booking.checkIn >= from && booking.checkIn <= to) ||
        (booking.checkOut >= from && booking.checkOut <= to) ||
        (booking.checkIn <= from && booking.checkOut >= to)
      );
    }

    // Filter by source
    if (filterCriteria.source !== 'all') {
      result = result.filter(booking => booking.source === filterCriteria.source);
    }

    setFilteredBookings(result);
  };

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = generateMockBookings();
      setBookings(data);
      setFilteredBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
      toast({
        title: "Error",
        description: "Failed to fetch bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingById = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      const booking = bookings.find(b => b.id === id);
      
      if (booking) {
        // Add mock messages and notes if they don't exist
        if (!booking.messages) {
          booking.messages = [
            {
              id: `msg-${Date.now()}-1`,
              timestamp: new Date(booking.createdAt.getTime() + 3600000),
              sender: 'system',
              content: 'Booking confirmation sent to guest',
              read: true
            },
            {
              id: `msg-${Date.now()}-2`,
              timestamp: new Date(booking.createdAt.getTime() + 7200000),
              sender: 'guest',
              content: 'Thank you for the confirmation. Could I request an early check-in if possible?',
              read: true
            },
            {
              id: `msg-${Date.now()}-3`,
              timestamp: new Date(booking.createdAt.getTime() + 10800000),
              sender: 'host',
              content: 'Hello! Yes, we can accommodate an early check-in at 1 PM. Please let us know when you expect to arrive.',
              read: true
            }
          ];
        }
        
        if (!booking.notes) {
          booking.notes = [
            {
              id: `note-${Date.now()}-1`,
              timestamp: new Date(booking.createdAt.getTime() + 3600000),
              author: 'System',
              content: 'Booking created via ' + booking.source
            },
            {
              id: `note-${Date.now()}-2`,
              timestamp: new Date(booking.createdAt.getTime() + 7200000),
              author: 'Reception Staff',
              content: 'Guest requested early check-in. Approved for 1 PM.'
            }
          ];
        }
        
        setCurrentBooking(booking);
      } else {
        setError('Booking not found');
        toast({
          title: "Not Found",
          description: "The booking you're looking for doesn't exist",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError('Failed to fetch booking details');
      console.error('Error fetching booking:', err);
      toast({
        title: "Error",
        description: "Failed to fetch booking details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (booking: Booking) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedBookings = bookings.map(b => 
        b.id === booking.id ? { ...booking, modifiedAt: new Date() } : b
      );
      
      setBookings(updatedBookings);
      setCurrentBooking(booking);
      
      toast({
        title: "Success",
        description: "Booking updated successfully",
      });
    } catch (err) {
      setError('Failed to update booking');
      console.error('Error updating booking:', err);
      toast({
        title: "Error",
        description: "Failed to update booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: string, reason: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedBookings = bookings.map(b => 
        b.id === id ? { 
          ...b, 
          bookingStatus: 'cancelled' as BookingStatus, 
          modifiedAt: new Date(),
          notes: [
            ...(b.notes || []),
            {
              id: `note-${Date.now()}`,
              timestamp: new Date(),
              author: 'System',
              content: `Booking cancelled. Reason: ${reason}`
            }
          ]
        } : b
      );
      
      setBookings(updatedBookings);
      
      // Update current booking if it's the one being cancelled
      if (currentBooking && currentBooking.id === id) {
        const updatedBooking = updatedBookings.find(b => b.id === id);
        if (updatedBooking) {
          setCurrentBooking(updatedBooking);
        }
      }
      
      toast({
        title: "Booking Cancelled",
        description: "The booking has been cancelled successfully",
      });
    } catch (err) {
      setError('Failed to cancel booking');
      console.error('Error cancelling booking:', err);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedBookings = bookings.map(b => 
        b.id === id ? { 
          ...b, 
          bookingStatus: status, 
          modifiedAt: new Date(),
          notes: [
            ...(b.notes || []),
            {
              id: `note-${Date.now()}`,
              timestamp: new Date(),
              author: 'System',
              content: `Booking status updated to: ${status}`
            }
          ]
        } : b
      );
      
      setBookings(updatedBookings);
      
      // Update current booking if it's the one being updated
      if (currentBooking && currentBooking.id === id) {
        const updatedBooking = updatedBookings.find(b => b.id === id);
        if (updatedBooking) {
          setCurrentBooking(updatedBooking);
        }
      }
      
      toast({
        title: "Status Updated",
        description: `Booking status changed to: ${status.replace('_', ' ')}`,
      });
    } catch (err) {
      setError('Failed to update booking status');
      console.error('Error updating booking status:', err);
      toast({
        title: "Error",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addBookingNote = async (bookingId: string, note: Omit<BookingNote, 'id' | 'timestamp'>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newNote: BookingNote = {
        id: `note-${Date.now()}`,
        timestamp: new Date(),
        ...note
      };
      
      const updatedBookings = bookings.map(b => 
        b.id === bookingId ? { 
          ...b, 
          notes: [...(b.notes || []), newNote]
        } : b
      );
      
      setBookings(updatedBookings);
      
      // Update current booking if it's the one being updated
      if (currentBooking && currentBooking.id === bookingId) {
        const updatedBooking = updatedBookings.find(b => b.id === bookingId);
        if (updatedBooking) {
          setCurrentBooking(updatedBooking);
        }
      }
      
      toast({
        title: "Note Added",
        description: "Your note has been added to the booking",
      });
    } catch (err) {
      setError('Failed to add note');
      console.error('Error adding note:', err);
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (bookingId: string, content: string, attachments?: string[]) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        timestamp: new Date(),
        sender: 'host',
        content,
        attachments,
        read: true
      };
      
      const updatedBookings = bookings.map(b => 
        b.id === bookingId ? { 
          ...b, 
          messages: [...(b.messages || []), newMessage]
        } : b
      );
      
      setBookings(updatedBookings);
      
      // Update current booking if it's the one being updated
      if (currentBooking && currentBooking.id === bookingId) {
        const updatedBooking = updatedBookings.find(b => b.id === bookingId);
        if (updatedBooking) {
          setCurrentBooking(updatedBooking);
        }
      }
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the guest",
      });
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      loading,
      error,
      currentBooking,
      filteredBookings,
      filterCriteria,
      fetchBookings,
      fetchBookingById,
      updateBooking,
      cancelBooking,
      updateBookingStatus,
      addBookingNote,
      sendMessage,
      setFilterCriteria: (criteria) => setFilterCriteria(prev => ({ ...prev, ...criteria }))
    }}>
      {children}
    </BookingContext.Provider>
  );
};
