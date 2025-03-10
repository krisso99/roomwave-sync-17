
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash, 
  Hotel, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  User, 
  Bookmark, 
  BedDouble, 
  Bath, 
  Home, 
  Users, 
  Camera,
  Plus,
  X,
  Link,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState({
    id: '1',
    name: 'Riad Al Jazira',
    type: 'Riad',
    address: '12 Derb El Halfaoui, Marrakech Medina',
    city: 'Marrakech',
    country: 'Morocco',
    phone: '+212 5243 78910',
    email: 'info@riadaljazirabooking.com',
    website: 'www.riadaljazirabooking.com',
    description: 'A beautiful traditional riad in the heart of Marrakech medina, featuring authentic Moroccan architecture and decor. This riad offers a peaceful sanctuary away from the bustling streets, with a central courtyard, a refreshing plunge pool, and a rooftop terrace with panoramic views of the medina and Atlas Mountains.',
    amenities: ['Swimming Pool', 'Free WiFi', 'Rooftop Terrace', 'Restaurant', 'Airport Shuttle', 'Air Conditioning', 'Room Service'],
    images: [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
    ],
    manager: {
      name: 'Hassan Karim',
      email: 'hassan@riadaljazirabooking.com',
      phone: '+212 661 234567',
    },
    rooms: [
      {
        id: '101',
        name: 'Jasmine Room',
        type: 'Standard Room',
        beds: '1 Queen Bed',
        occupancy: 2,
        size: '20m²',
        amenities: ['En-suite Bathroom', 'Air Conditioning', 'Free WiFi', 'Safe'],
        price: 120,
        status: 'available'
      },
      {
        id: '102',
        name: 'Rose Room',
        type: 'Deluxe Room',
        beds: '1 King Bed',
        occupancy: 2,
        size: '25m²',
        amenities: ['En-suite Bathroom', 'Air Conditioning', 'Free WiFi', 'Minibar', 'Safe'],
        price: 150,
        status: 'booked'
      },
      {
        id: '103',
        name: 'Mint Suite',
        type: 'Suite',
        beds: '1 King Bed',
        occupancy: 3,
        size: '35m²',
        amenities: ['En-suite Bathroom', 'Air Conditioning', 'Free WiFi', 'Minibar', 'Safe', 'Sitting Area'],
        price: 200,
        status: 'maintenance'
      },
      {
        id: '104',
        name: 'Saffron Room',
        type: 'Standard Room',
        beds: '2 Twin Beds',
        occupancy: 2,
        size: '22m²',
        amenities: ['En-suite Bathroom', 'Air Conditioning', 'Free WiFi', 'Safe'],
        price: 120,
        status: 'available'
      },
    ],
    channels: [
      {
        id: '1',
        name: 'Booking.com',
        status: 'connected',
        lastSync: '2023-09-25T15:30:00Z',
        roomsMapped: 4
      },
      {
        id: '2',
        name: 'Airbnb',
        status: 'connected',
        lastSync: '2023-09-25T15:30:00Z',
        roomsMapped: 3
      },
      {
        id: '3',
        name: 'Expedia',
        status: 'pending',
        lastSync: null,
        roomsMapped: 0
      }
    ]
  });

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <h1 className="text-2xl font-semibold mb-4">Property Not Found</h1>
        <p className="text-muted-foreground mb-8">The property you're looking for does not exist or has been removed.</p>
        <Button variant="default" onClick={() => navigate('/app/properties')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>
      </div>
    );
  }

  const getRoomStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Available</Badge>;
      case 'booked':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Booked</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getChannelStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="outline">Connected</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleEdit = () => {
    toast({
      title: "Edit mode activated",
      description: "You can now edit the property details.",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Delete request received",
      description: "Are you sure you want to delete this property?",
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/app/properties')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold">{property.name}</h1>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              <span>{property.city}, {property.country}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
                <CardDescription>
                  Basic details about the property
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Property Type</h3>
                    <p className="flex items-center">
                      <Hotel className="mr-2 h-4 w-4" />
                      {property.type}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
                    <p className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      {property.address}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
                    <p className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      {property.phone}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                    <p className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      {property.email}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Website</h3>
                    <p className="flex items-center">
                      <Globe className="mr-2 h-4 w-4" />
                      {property.website}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Property Manager</h3>
                    <p className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {property.manager.name}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                  <p className="text-sm">{property.description}</p>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Amenities</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {property.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="flex items-center">
                        <Bookmark className="mr-1 h-3 w-3" />
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Gallery</CardTitle>
                <CardDescription>
                  Property images
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {property.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <AspectRatio ratio={4/3} className="bg-muted rounded-md overflow-hidden">
                        <img
                          src={image}
                          alt={`Property image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </AspectRatio>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="ghost" size="icon" className="text-white">
                          <Camera className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Image
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="rooms" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Rooms</CardTitle>
                <CardDescription>
                  Manage your property's rooms and availability
                </CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Room
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Beds</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {property.rooms.map((room) => (
                    <TableRow key={room.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{room.id}</TableCell>
                      <TableCell>{room.name}</TableCell>
                      <TableCell>{room.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <BedDouble className="mr-2 h-4 w-4" />
                          {room.beds}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          {room.occupancy} persons
                        </div>
                      </TableCell>
                      <TableCell className="text-right">${room.price}/night</TableCell>
                      <TableCell>{getRoomStatusBadge(room.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Connected Channels</CardTitle>
                <CardDescription>
                  Manage your property's distribution channels
                </CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Channel
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {property.channels.map((channel) => (
                  <Card key={channel.id} className="border shadow-none">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{channel.name}</CardTitle>
                        {getChannelStatusBadge(channel.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm pb-2">
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Rooms mapped: {channel.roomsMapped}</div>
                        {channel.lastSync && (
                          <div className="text-muted-foreground">Last sync: {new Date(channel.lastSync).toLocaleString()}</div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Link className="mr-2 h-4 w-4" />
                        {channel.status === 'connected' ? 'Manage' : 'Connect'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                <Card className="border border-dashed shadow-none flex flex-col items-center justify-center p-6 h-[176px]">
                  <Button variant="ghost" className="h-auto flex flex-col p-4">
                    <Plus className="h-6 w-6 mb-2" />
                    <span>Connect New Channel</span>
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>
                View availability and manage bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center p-12 border-2 border-dashed rounded-md">
                <div className="text-center">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">View Full Calendar</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    For a detailed view of all bookings and availability
                  </p>
                  <Button className="mt-4" onClick={() => navigate('/app/calendar')}>
                    Go to Calendar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertyDetail;
