
import React from 'react';
import { Room } from './BookingWidget';

type RoomSelectorProps = {
  rooms: Room[];
  selectedRoom: Room | null;
  onSelectRoom: (room: Room) => void;
  nights: number;
  currency: string;
};

const RoomSelector: React.FC<RoomSelectorProps> = ({
  rooms,
  selectedRoom,
  onSelectRoom,
  nights,
  currency
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Select a room</h3>
      <div className="space-y-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`border rounded-lg overflow-hidden transition-all ${
              selectedRoom?.id === room.id
                ? 'ring-2 ring-primary ring-offset-2'
                : 'hover:shadow-md'
            }`}
            onClick={() => onSelectRoom(room)}
          >
            <div className="md:flex">
              <div className="md:w-1/3 h-48 md:h-auto">
                <img
                  src={room.imageUrl}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 md:w-2/3 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-lg">{room.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{room.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {room.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="text-xs bg-muted px-2 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Up to {room.maxOccupancy} guests
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(room.pricePerNight)} per night
                    </p>
                    <p className="font-bold">
                      {formatCurrency(room.pricePerNight * nights)} total
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomSelector;
