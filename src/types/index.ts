
export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  description: string;
  imageUrl: string;
  contactEmail: string;
  contactPhone: string;
  totalRooms: number;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  propertyId: string;
  name: string;
  type: string;
  description: string;
  maxOccupancy: number;
  basePrice: number;
  amenities: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  id: string;
  roomId: string;
  date: string;
  available: boolean;
  price: number;
  restrictions: {
    minStay?: number;
    maxStay?: number;
    closedToArrival?: boolean;
    closedToDeparture?: boolean;
  };
  updatedAt: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  roomId: string;
  channelId: string;
  channelName: string;
  bookingRef: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'pending' | 'checked-in' | 'checked-out';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Channel {
  id: string;
  name: string;
  type: 'api' | 'ical';
  connectionDetails: {
    apiKey?: string;
    apiSecret?: string;
    icalUrl?: string;
    webhookUrl?: string;
  };
  status: 'active' | 'inactive' | 'error';
  lastSyncedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyChannel {
  id: string;
  propertyId: string;
  channelId: string;
  externalPropertyId: string;
  mappingDetails: Record<string, any>;
  status: 'active' | 'inactive';
  lastSyncedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyncLog {
  id: string;
  propertyId: string;
  channelId: string;
  operation: 'pull' | 'push';
  status: 'success' | 'failure';
  details: string;
  timestamp: string;
}

// For API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
