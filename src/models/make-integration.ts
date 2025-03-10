
/**
 * Make (Integromat) Integration Model
 * 
 * This file defines the structures for integrating with Make scenarios
 * for channel management and booking synchronization.
 */

// Main scenario types
export enum ScenarioType {
  INVENTORY_SYNC = 'inventory_sync',
  BOOKING_SYNC = 'booking_sync',
  PRICE_SYNC = 'price_sync',
  AVAILABILITY_SYNC = 'availability_sync',
  CHANNEL_HEALTH = 'channel_health',
}

// Webhook direction
export enum WebhookDirection {
  INBOUND = 'inbound', // External system to our system
  OUTBOUND = 'outbound', // Our system to external system
}

// Communication protocol
export enum ProtocolType {
  API = 'api',
  ICAL = 'ical',
  WEBHOOK = 'webhook',
}

// Scenario status
export enum ScenarioStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  ERROR = 'error',
  DRAFT = 'draft',
}

// Make (Integromat) scenario configuration
export interface MakeScenario {
  id: string;
  name: string;
  type: ScenarioType;
  description: string;
  status: ScenarioStatus;
  webhookUrl?: string;
  webhookDirection?: WebhookDirection;
  protocolType: ProtocolType;
  channelId?: string;
  propertyIds: string[];
  scheduleInterval?: number; // in minutes
  lastExecuted?: string;
  nextExecution?: string;
  createdAt: string;
  updatedAt: string;
}

// Execution log for a Make scenario
export interface ScenarioExecution {
  id: string;
  scenarioId: string;
  status: 'success' | 'warning' | 'error';
  startTime: string;
  endTime?: string;
  duration?: number; // in milliseconds
  errorMessage?: string;
  operationsExecuted: number;
  dataTransferred?: number; // in bytes
}

// Data mapping between channel fields and our system fields
export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transform?: string; // optional transformation logic
}

// Channel-specific configuration for Make integration
export interface ChannelConfiguration {
  channelId: string;
  scenarioIds: string[];
  fieldMappings: {
    property?: FieldMapping[];
    room?: FieldMapping[];
    booking?: FieldMapping[];
    price?: FieldMapping[];
    availability?: FieldMapping[];
  };
  apiSettings?: {
    baseUrl: string;
    authType: 'basic' | 'oauth2' | 'apiKey';
    credentials: Record<string, string>;
    rateLimit?: number;
  };
  iCalSettings?: {
    importUrl?: string;
    exportUrl?: string;
    refreshInterval?: number; // in minutes
  };
}

// Make webhook payload for booking creation
export interface BookingWebhookPayload {
  action: 'create' | 'update' | 'cancel';
  bookingId?: string;
  channelBookingId: string;
  channelId: string;
  propertyId: string;
  roomId: string;
  guestInfo: {
    name: string;
    email?: string;
    phone?: string;
    nationality?: string;
    address?: string;
  };
  stay: {
    checkIn: string; // ISO date format
    checkOut: string; // ISO date format
    adults: number;
    children?: number;
    specialRequests?: string;
  };
  pricing: {
    currency: string;
    totalAmount: number;
    dailyRates?: {
      date: string;
      amount: number;
    }[];
    taxes?: {
      name: string;
      amount: number;
    }[];
    fees?: {
      name: string;
      amount: number;
    }[];
    deposit?: number;
  };
  status: 'confirmed' | 'pending' | 'cancelled';
  source: string;
  createdAt: string;
}

// Make webhook payload for availability/inventory update
export interface InventoryWebhookPayload {
  action: 'update';
  propertyId: string;
  roomId: string;
  channelId?: string; // Optional: only if updating a specific channel
  dates: {
    date: string; // ISO date format
    available: boolean;
    inventory?: number;
    price?: number;
    restrictions?: {
      minStay?: number;
      maxStay?: number;
      closedToArrival?: boolean;
      closedToDeparture?: boolean;
    };
  }[];
  source: string;
  createdAt: string;
}

// Synchronization result
export interface SyncResult {
  success: boolean;
  timestamp: string;
  operation: 'push' | 'pull';
  entityType: 'booking' | 'inventory' | 'property' | 'room';
  channelId: string;
  propertyId: string;
  details?: string;
  errorMessage?: string;
  changesCount?: number;
}

// Function to generate a webhook URL for Make scenario
export function generateMakeWebhookUrl(scenarioId: string, token: string): string {
  return `https://hook.make.com/your-account/${scenarioId}?token=${token}`;
}

// Function to prepare a booking webhook payload
export function prepareBookingPayload(
  booking: any, // Replace with your actual booking type
  action: 'create' | 'update' | 'cancel'
): BookingWebhookPayload {
  // Implementation would map your booking data to the webhook payload format
  return {
    action,
    // Map the rest of the booking properties here
    bookingId: booking.id,
    channelBookingId: booking.channelBookingId,
    channelId: booking.channelId,
    propertyId: booking.propertyId,
    roomId: booking.roomId,
    guestInfo: {
      name: booking.guestName,
      email: booking.guestEmail,
      phone: booking.guestPhone,
    },
    stay: {
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      adults: booking.adults || 1,
      children: booking.children || 0,
      specialRequests: booking.specialRequests,
    },
    pricing: {
      currency: booking.currency || 'MAD',
      totalAmount: booking.totalPrice,
    },
    status: booking.status,
    source: 'channel_manager',
    createdAt: new Date().toISOString(),
  };
}

// Function to trigger a Make scenario manually
export async function triggerMakeScenario(
  scenarioId: string, 
  webhookUrl: string, 
  payload: any
): Promise<SyncResult> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to trigger scenario: ${response.statusText}`);
    }
    
    return {
      success: true,
      timestamp: new Date().toISOString(),
      operation: 'push',
      entityType: 'booking', // Determine based on payload
      channelId: payload.channelId,
      propertyId: payload.propertyId,
      details: 'Scenario triggered successfully',
    };
  } catch (error) {
    console.error('Error triggering Make scenario:', error);
    return {
      success: false,
      timestamp: new Date().toISOString(),
      operation: 'push',
      entityType: 'booking', // Determine based on payload
      channelId: payload.channelId,
      propertyId: payload.propertyId,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
