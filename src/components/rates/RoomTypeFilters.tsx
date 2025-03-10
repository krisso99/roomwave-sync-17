
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { RoomType } from '@/contexts/RateContext';

interface RoomTypeFiltersProps {
  roomTypes: RoomType[];
  selectedRoomTypes: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRoomTypeToggle: (roomTypeId: string) => void;
  onCreateRate: (roomTypeId: string) => void;
}

const RoomTypeFilters: React.FC<RoomTypeFiltersProps> = ({
  roomTypes,
  selectedRoomTypes,
  searchQuery,
  onSearchChange,
  onRoomTypeToggle,
  onCreateRate,
}) => {
  const filteredRoomTypes = roomTypes.filter(roomType => 
    roomType.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Room Types</CardTitle>
        <CardDescription>
          Select room types to view or edit rates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="relative">
            <Input
              placeholder="Search room types..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="mb-2"
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto space-y-1">
            {filteredRoomTypes.length > 0 ? (
              filteredRoomTypes.map((roomType) => (
                <div key={roomType.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`room-${roomType.id}`}
                    checked={selectedRoomTypes.includes(roomType.id)}
                    onChange={() => onRoomTypeToggle(roomType.id)}
                    className="rounded border-gray-300"
                  />
                  <label 
                    htmlFor={`room-${roomType.id}`}
                    className="flex-1 text-sm cursor-pointer"
                  >
                    {roomType.name}
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => onCreateRate(roomType.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground py-2">
                No room types match your search
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomTypeFilters;
