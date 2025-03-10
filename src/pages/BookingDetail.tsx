
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  CreditCard, 
  Clock, 
  MessageSquare, 
  MapPin, 
  CheckCircle, 
  X,
  Mail,
  Phone,
  FileText,
  Bed,
  Edit,
  Printer,
  AlertTriangle,
  Loader2,
  Pencil,
  Upload,
  UserCircle,
  BadgeCheck,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
import { useBooking, BookingStatus } from '@/contexts/BookingContext';
import { MessageList } from '@/components/bookings/MessageList';
import { NoteList } from '@/components/bookings/NoteList';

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    currentBooking, 
    loading, 
    error, 
    fetchBookingById, 
    updateBookingStatus, 
    cancelBooking,
    addBookingNote,
    sendMessage
  } = useBooking();
  
  const [cancelReason, setCancelReason] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  
  useEffect(() => {
    if (id) {
      fetchBookingById(id);
    }
  }, [id, fetchBookingById]);

  // Handle template selection
  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    if (value === 'welcome') {
      setMessageContent(`Dear ${currentBooking?.guest.name},\n\nWe're looking forward to welcoming you to ${currentBooking?.propertyName} on ${currentBooking?.checkIn ? format(currentBooking.checkIn, 'MMMM dd, yyyy') : ''}. Here's some information to help prepare for your stay...\n\nSafe travels,\nThe Management Team`);
    } else if (value === 'reminder') {
      setMessageContent(`Dear ${currentBooking?.guest.name},\n\nThis is a friendly reminder that your stay at ${currentBooking?.propertyName} begins tomorrow. Please let us know your expected arrival time so we can prepare accordingly.\n\nBest regards,\nThe Management Team`);
    } else if (value === 'thanks') {
      setMessageContent(`Dear ${currentBooking?.guest.name},\n\nThank you for choosing to stay with us at ${currentBooking?.propertyName}. We hope you enjoyed your visit and would appreciate if you could take a moment to leave a review.\n\nWe'd love to welcome you back again soon.\n\nBest regards,\nThe Management Team`);
    }
  };

  const handleStatusChange = async (status: BookingStatus) => {
    if (id) {
      await updateBookingStatus(id, status);
    }
  };

  const handleCancelBooking = async () => {
    if (id && cancelReason.trim()) {
      await cancelBooking(id, cancelReason);
      setShowCancelDialog(false);
      setCancelReason('');
    }
  };

  const handleAddNote = async () => {
    if (id && noteContent.trim()) {
      await addBookingNote(id, {
        author: 'Staff Member',
        content: noteContent
      });
      setNoteContent('');
    }
  };

  const handleSendMessage = async () => {
    if (id && messageContent.trim()) {
      await sendMessage(id, messageContent);
      setMessageContent('');
      setSelectedTemplate('');
    }
  };

  if (loading && !currentBooking) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Loading booking details...</h2>
        </div>
      </div>
    );
  }

  if (error || !currentBooking) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h1 className="text-2xl font-semibold mb-4">Booking Not Found</h1>
        <p className="text-muted-foreground mb-8">
          {error || "The booking you're looking for does not exist or has been removed."}
        </p>
        <Button variant="default" onClick={() => navigate('/app/bookings')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Button>
      </div>
    );
  }

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

  return (
    <div className="animate-in">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/app/bookings')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Booking {currentBooking.id}</h1>
            <div className="flex items-center">
              <span className="text-muted-foreground">
                {format(currentBooking.checkIn, "MMM dd, yyyy")} - {format(currentBooking.checkOut, "MMM dd, yyyy")}
              </span>
              <span className="mx-2">•</span>
              {getStatusBadge(currentBooking.bookingStatus)}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          
          {currentBooking.bookingStatus !== 'cancelled' && (
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <X className="mr-2 h-4 w-4" />
                  Cancel Booking
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Booking</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. The booking will be marked as cancelled.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="reason">Cancellation Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a reason for cancellation..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCancelDialog(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={handleCancelBooking}>
                    Confirm Cancellation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Booking Details</CardTitle>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Property Information */}
              <div>
                <h3 className="text-md font-medium mb-2">Property Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-md">
                  <div>
                    <p className="text-sm text-muted-foreground">Property</p>
                    <p className="font-medium">{currentBooking.propertyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Room Type</p>
                    <p className="font-medium">{currentBooking.roomName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Room Assignment</p>
                    <p className="font-medium">{currentBooking.assignedRoom || "Not assigned yet"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Booking Source</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{currentBooking.source}</Badge>
                      {currentBooking.sourceBookingId && <span className="text-xs text-muted-foreground">ID: {currentBooking.sourceBookingId}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stay Details */}
              <div>
                <h3 className="text-md font-medium mb-2">Stay Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/20 p-4 rounded-md">
                  <div>
                    <p className="text-sm text-muted-foreground">Check-in Date</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="font-medium">{format(currentBooking.checkIn, "EEEE, MMMM dd, yyyy")}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-out Date</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="font-medium">{format(currentBooking.checkOut, "EEEE, MMMM dd, yyyy")}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Length of Stay</p>
                    <p className="font-medium">
                      {Math.ceil((currentBooking.checkOut.getTime() - currentBooking.checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="font-medium">{currentBooking.adults} adults, {currentBooking.children} children</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Booking Status</p>
                    <div className="flex items-center mt-1">
                      {getStatusBadge(currentBooking.bookingStatus)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className={
                        currentBooking.paymentStatus === 'paid' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : currentBooking.paymentStatus === 'partial' 
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : currentBooking.paymentStatus === 'refunded'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-muted-foreground/20'
                      }>
                        {currentBooking.paymentStatus.charAt(0).toUpperCase() + currentBooking.paymentStatus.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {currentBooking.specialRequests && (
                <div>
                  <h3 className="text-md font-medium mb-2">Special Requests</h3>
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4">
                    <p className="text-sm">{currentBooking.specialRequests}</p>
                  </div>
                </div>
              )}

              {/* Financial Details */}
              <div>
                <h3 className="text-md font-medium mb-2">Financial Details</h3>
                <div className="bg-muted/20 p-4 rounded-md">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Rate ({Math.ceil((currentBooking.checkOut.getTime() - currentBooking.checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights)</span>
                      <span>${currentBooking.baseRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes</span>
                      <span>${currentBooking.taxes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fees</span>
                      <span>${currentBooking.fees}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between pt-4 font-medium">
                    <span>Total</span>
                    <span>${currentBooking.totalAmount}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="messages">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="messages">Guest Communication</TabsTrigger>
              <TabsTrigger value="notes">Staff Notes</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="messages" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Guest Communication</CardTitle>
                  <CardDescription>
                    Messages exchanged with the guest
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MessageList messages={currentBooking.messages || []} />
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="w-full">
                    <Label htmlFor="template" className="text-sm font-medium">Template</Label>
                    <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                      <SelectTrigger id="template" className="mt-1">
                        <SelectValue placeholder="Select a template or write a custom message" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Custom Message</SelectItem>
                        <SelectItem value="welcome">Welcome Message</SelectItem>
                        <SelectItem value="reminder">Check-in Reminder</SelectItem>
                        <SelectItem value="thanks">Thank You Message</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full">
                    <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Type your message to the guest here..." 
                      className="mt-1"
                      rows={5}
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-end w-full">
                    <Button onClick={handleSendMessage} disabled={!messageContent.trim()}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Staff Notes</CardTitle>
                  <CardDescription>
                    Internal notes about this booking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NoteList notes={currentBooking.notes || []} />
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="w-full">
                    <Label htmlFor="note" className="text-sm font-medium">Add Note</Label>
                    <Textarea 
                      id="note" 
                      placeholder="Add a note about this booking..." 
                      className="mt-1"
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-end w-full">
                    <Button onClick={handleAddNote} disabled={!noteContent.trim()}>
                      <FileText className="mr-2 h-4 w-4" />
                      Add Note
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Manage documents related to this booking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-md">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-2">No documents uploaded yet</p>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Guest Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {currentBooking.guest.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg">{currentBooking.guest.name}</p>
                  <Badge variant="outline" className="mt-1">{currentBooking.guest.nationality || 'Guest'}</Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                  <a href={`mailto:${currentBooking.guest.email}`} className="text-sm hover:underline">{currentBooking.guest.email}</a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                  <a href={`tel:${currentBooking.guest.phone}`} className="text-sm hover:underline">{currentBooking.guest.phone}</a>
                </div>
                
                {currentBooking.guest.address && (
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-3 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{currentBooking.guest.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Actions */}
              <div className="space-y-2">
                <Label className="text-sm">Update Status</Label>
                <div className="grid grid-cols-1 gap-2">
                  {currentBooking.bookingStatus === 'pending' && (
                    <Button variant="default" className="w-full justify-start" onClick={() => handleStatusChange('confirmed')}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirm Booking
                    </Button>
                  )}
                  
                  {currentBooking.bookingStatus === 'confirmed' && (
                    <Button variant="default" className="w-full justify-start" onClick={() => handleStatusChange('checked_in')}>
                      <BadgeCheck className="mr-2 h-4 w-4" />
                      Check In Guest
                    </Button>
                  )}
                  
                  {currentBooking.bookingStatus === 'checked_in' && (
                    <Button variant="default" className="w-full justify-start" onClick={() => handleStatusChange('checked_out')}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Check Out Guest
                    </Button>
                  )}
                  
                  {(currentBooking.bookingStatus === 'confirmed' || currentBooking.bookingStatus === 'pending') && (
                    <Button variant="outline" className="w-full justify-start" onClick={() => handleStatusChange('no_show')}>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Mark as No-Show
                    </Button>
                  )}
                </div>
              </div>
              
              <Separator />
              
              {/* Common Actions */}
              <div className="space-y-2">
                <Label className="text-sm">Other Actions</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Bed className="mr-2 h-4 w-4" />
                    Assign Room
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Pencil className="mr-2 h-4 w-4" />
                    Modify Dates
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Update Payment
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Edit Guest Info
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Booking Timeline Card */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-2">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="h-full w-px bg-muted-foreground/30 mx-auto my-1" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Booking Created</p>
                    <p className="text-xs text-muted-foreground">{format(currentBooking.createdAt, "MMM dd, yyyy 'at' h:mm a")}</p>
                  </div>
                </div>
                
                {currentBooking.modifiedAt && (
                  <div className="flex">
                    <div className="mr-2">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <Edit className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="h-full w-px bg-muted-foreground/30 mx-auto my-1" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Booking Modified</p>
                      <p className="text-xs text-muted-foreground">{format(currentBooking.modifiedAt, "MMM dd, yyyy 'at' h:mm a")}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex">
                  <div className="mr-2">
                    <div className="h-6 w-6 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="h-full w-px bg-muted-foreground/30 mx-auto my-1" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Check-in Scheduled</p>
                    <p className="text-xs text-muted-foreground">{format(currentBooking.checkIn, "EEEE, MMMM dd, yyyy")}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-2">
                    <div className="h-6 w-6 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Check-out Scheduled</p>
                    <p className="text-xs text-muted-foreground">{format(currentBooking.checkOut, "EEEE, MMMM dd, yyyy")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
