
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Hotel, MapPin, BedDouble, Wifi, Bath, Utensils, ArrowLeft, Calendar, BookOpen, Link2, Edit, Trash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// Mock data
const mockPropertyData = {
  id: '1',
  name: 'Riad Al Jazira',
  address: '1 Derb Sidi Bouloukat, Marrakech',
  city: 'Marrakech',
  country: 'Morocco',
  description: 'A traditional Moroccan riad with a central courtyard featuring a refreshing plunge pool. Each room is uniquely decorated with handcrafted furnishings, offering an authentic experience in the heart of the medina.',
  totalRooms: 8,
  amenities: ['WiFi', 'Breakfast', 'Air Conditioning', 'Pool', 'Airport Transfer', 'Restaurant'],
  imageUrl: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
  additionalImages: [
    'https://images.unsplash.com/photo-1564078516393-cf04bd966897?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
    'https://images.unsplash.com/photo-1549638441-b787d2e11f14?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
  ],
  rooms: [
    { id: '101', name: 'Jasmine Room', type: 'Double', capacity: 2, price: 120, amenities: ['Ensuite', 'AC', 'Safe'] },
    { id: '102', name: 'Rose Room', type: 'Twin', capacity: 2, price: 110, amenities: ['Ensuite', 'AC', 'Balcony'] },
    { id: '103', name: 'Mint Suite', type: 'Suite', capacity: 3, price: 180, amenities: ['Ensuite', 'AC', 'Terrace', 'Lounge'] },
    { id: '104', name: 'Saffron Room', type: 'Double', capacity: 2, price: 125, amenities: ['Ensuite', 'AC', 'Courtyard View'] },
  ],
  channels: [
    { id: 'ch1', name: 'Booking.com', status: 'Connected', lastSync: '2023-09-15T14:35:00Z' },
    { id: 'ch2', name: 'Airbnb', status: 'Connected', lastSync: '2023-09-14T09:22:00Z' },
    { id: 'ch3', name: 'Expedia', status: 'Error', lastSync: '2023-09-13T11:47:00Z' },
  ],
  recentBookings: [
    { id: 'b1', guest: 'Sarah Johnson', room: 'Jasmine Room', checkIn: '2023-10-15', checkOut: '2023-10-18', status: 'Confirmed', channel: 'Booking.com' },
    { id: 'b2', guest: 'Michel Dubois', room: 'Rose Room', checkIn: '2023-10-20', checkOut: '2023-10-25', status: 'Confirmed', channel: 'Direct' },
    { id: 'b3', guest: 'Elena Rossi', room: 'Mint Suite', checkIn: '2023-11-05', checkOut: '2023-11-10', status: 'Pending', channel: 'Airbnb' },
  ],
  createdAt: '2023-01-15T12:30:00Z',
  updatedAt: '2023-05-20T08:45:00Z',
};

const PropertyDetail = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('overview');
  
  // In a real app, you would fetch property data based on the ID
  const property = mockPropertyData;

  const handleDelete = () => {
    // Delete logic would go here
    toast({
      title: "Property deleted",
      description: `${property.name} has been successfully deleted.`,
    });
    navigate('/app/properties');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/app/properties')}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold">{property.name}</h1>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.address}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/app/calendar')}>
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete {property.name} and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <div className="h-64">
              <img 
                src={property.imageUrl} 
                alt={property.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Hotel className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Total Rooms</span>
                </div>
                <Badge variant="outline">{property.totalRooms}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Active Bookings</span>
                </div>
                <Badge variant="outline">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Link2 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Connected Channels</span>
                </div>
                <Badge variant="outline">{property.channels.length}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary">
                    {amenity === 'WiFi' && <Wifi className="h-3 w-3 mr-1" />}
                    {amenity === 'Restaurant' && <Utensils className="h-3 w-3 mr-1" />}
                    {amenity === 'Pool' && <Bath className="h-3 w-3 mr-1" />}
                    {amenity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="overview" onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{property.description}</p>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {property.additionalImages.map((img, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <div className="h-48">
                    <img 
                      src={img} 
                      alt={`${property.name} - Image ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="rooms" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {property.rooms.map((room) => (
              <Card key={room.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>{room.name}</CardTitle>
                      <CardDescription>{room.type}</CardDescription>
                    </div>
                    <Badge>${room.price}/night</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <BedDouble className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">Capacity: {room.capacity}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-3 w-3 mr-2" />
                    Edit Room
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="bookings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>
                Recent bookings for {property.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {property.recentBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{booking.guest}</h3>
                        <p className="text-sm text-muted-foreground">{booking.room}</p>
                      </div>
                      <Badge variant={booking.status === 'Confirmed' ? 'success' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div>
                        <span>{booking.checkIn}</span>
                        <span className="mx-2">→</span>
                        <span>{booking.checkOut}</span>
                      </div>
                      <div>{booking.channel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/app/bookings')}
              >
                View All Bookings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="channels" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Channels</CardTitle>
              <CardDescription>
                Manage your distribution channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {property.channels.map((channel) => (
                  <div key={channel.id} className="flex items-center justify-between border rounded-lg p-4">
                    <div>
                      <h3 className="font-medium">{channel.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Last sync: {formatDate(channel.lastSync)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Badge variant={channel.status === 'Connected' ? 'outline' : 'destructive'}>
                        {channel.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="ml-2">
                        <Link2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/app/channels')}
              >
                Manage Channels
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertyDetail;
