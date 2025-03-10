
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Hotel, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Link 
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { PropertyForm } from '@/components/properties/PropertyForm';

// Mock data for properties
const mockProperties = [
  {
    id: '1',
    name: 'Riad Al Jazira',
    address: '1 Derb Sidi Bouloukat, Marrakech',
    city: 'Marrakech',
    country: 'Morocco',
    totalRooms: 8,
    type: 'riad',
    imageUrl: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
    createdAt: '2023-01-15T12:30:00Z',
    updatedAt: '2023-05-20T08:45:00Z',
  },
  {
    id: '2',
    name: 'Dar Anika',
    address: '12 Rue El Ksour, Essaouira',
    city: 'Essaouira',
    country: 'Morocco',
    totalRooms: 12,
    type: 'guesthouse',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
    createdAt: '2023-02-22T10:15:00Z',
    updatedAt: '2023-06-10T14:20:00Z',
  },
  {
    id: '3',
    name: 'Kasbah Tamadot',
    address: 'BP 67, Asni, Atlas Mountains',
    city: 'Asni',
    country: 'Morocco',
    totalRooms: 28,
    type: 'hotel',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
    createdAt: '2023-03-05T09:45:00Z',
    updatedAt: '2023-07-15T11:30:00Z',
  },
  {
    id: '4',
    name: 'Riad Kniza',
    address: '34 Derb l\'Hotel, Bab Doukala, Marrakech',
    city: 'Marrakech',
    country: 'Morocco',
    totalRooms: 11,
    type: 'riad',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
    createdAt: '2023-04-18T15:20:00Z',
    updatedAt: '2023-08-22T16:10:00Z',
  },
];

const Properties = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [properties, setProperties] = useState(mockProperties);

  // Filter properties based on search query
  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    property.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePropertyClick = (id: string) => {
    navigate(`/app/properties/${id}`);
  };

  const handleAddProperty = (formData: any) => {
    // In a real application, you would send this data to the backend
    const newProperty = {
      id: `${properties.length + 1}`,
      name: formData.name,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      type: formData.type || 'riad',
      totalRooms: 0, // This would be updated as rooms are added
      imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80', // Default image
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setProperties([...properties, newProperty]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Property added",
      description: `${formData.name} has been successfully added.`,
    });
    
    // Navigate to the new property detail page
    navigate(`/app/properties/${newProperty.id}`);
  };

  const handleDeleteProperty = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Delete property logic
    setProperties(properties.filter(property => property.id !== id));
    
    toast({
      title: "Property deleted",
      description: `${name} has been successfully deleted.`,
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-display font-bold">My Properties</h1>
        
        <div className="flex w-full md:w-auto flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search properties..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <Button className="w-full sm:w-auto" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Property</DialogTitle>
              </DialogHeader>
              <PropertyForm
                onSubmit={handleAddProperty}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <Card 
              key={property.id} 
              className="overflow-hidden transition-all hover:shadow-md cursor-pointer group"
              onClick={() => handlePropertyClick(property.id)}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={property.imageUrl} 
                  alt={property.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="group-hover:text-primary transition-colors">{property.name}</CardTitle>
                    <CardDescription className="mt-1">{property.city}, {property.country}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem onClick={e => e.stopPropagation()}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={e => e.stopPropagation()}>
                        <Link className="mr-2 h-4 w-4" />
                        Manage Channels
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => handleDeleteProperty(property.id, property.name, e)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground truncate">{property.address}</p>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Hotel className="h-4 w-4 mr-1" />
                  <span>{property.totalRooms} Rooms</span>
                </div>
                <Button variant="outline" size="sm" className="h-8">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg border border-dashed">
            <Hotel className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No properties found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery ? 
                `No properties match your search "${searchQuery}".` : 
                "You haven't added any properties yet."}
            </p>
            {searchQuery ? (
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            ) : (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Property
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
