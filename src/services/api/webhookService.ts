import { toast } from "@/hooks/use-toast";
import HttpClient from "./httpClient";
import { ICalEvent, ICalFeed, ICalConflict } from "./icalService";

export type PropertyPlatform = 'airbnb' | 'booking.com' | 'vrbo' | 'expedia' | 'tripadvisor' | 'other';

export interface AvailabilityUpdatePayload {
  propertyId: string;
  roomId: string;
  dates: {
    date: string;
    available: boolean;
    channel: string;
  }[];
  syncId: string;
}

export interface RateUpdatePayload {
  propertyId: string;
  roomId: string;
  rates: {
    date: string;
    amount: number;
    currency: string;
    channel: string;
  }[];
  syncId: string;
}

export interface BookingPayload {
  propertyId: string;
  roomId: string;
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  dates: {
    checkIn: string;
    checkOut: string;
  };
  source: string;
  status: string;
  payment: {
    amount: number;
    currency: string;
    status: string;
  };
  operationType: string;
}

export type WebhookPayload = {
  type: string;
  timestamp: number;
  platform: string;
  data: any;
};

export type WebhookResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export interface WebhookErrorResponse {
  error: string;
  code: string;
  details?: any;
}

export type WebhookEndpoint = {
  id: string;
  name: string;
  path: string;
  description: string;
  platform: PropertyPlatform;
  method: "GET" | "POST" | "PUT" | "DELETE";
  testPayload: any;
};

let webhooks: WebhookEndpoint[] = [
  {
    id: "availability",
    name: "Availability Update",
    path: "/api/webhooks/availability",
    description: "Receive availability updates from Make integrations",
    platform: "airbnb",
    method: "POST",
    testPayload: {
      type: "availability_update",
      timestamp: Date.now(),
      platform: "airbnb",
      data: {
        property_id: "property-1",
        room_id: "room-123",
        dates: [
          {
            date: "2023-11-01",
            available: true,
            min_nights: 2,
            max_nights: 14,
          },
          {
            date: "2023-11-02",
            available: true,
            min_nights: 2,
            max_nights: 14,
          },
          {
            date: "2023-11-03",
            available: false,
            min_nights: 0,
            max_nights: 0,
          }
        ]
      }
    }
  },
  {
    id: "rates",
    name: "Rate Update",
    path: "/api/webhooks/rates",
    description: "Receive rate updates from Make integrations",
    platform: "booking.com",
    method: "POST",
    testPayload: {
      type: "rate_update",
      timestamp: Date.now(),
      platform: "booking.com",
      data: {
        property_id: "property-1",
        room_id: "room-456",
        currency: "USD",
        rates: [
          {
            date: "2023-11-01",
            rate: 149.99,
            min_stay_through: 2
          },
          {
            date: "2023-11-02",
            rate: 149.99,
            min_stay_through: 2
          },
          {
            date: "2023-11-03",
            rate: 199.99,
            min_stay_through: 2
          }
        ]
      }
    }
  },
  {
    id: "booking",
    name: "New Booking",
    path: "/api/webhooks/bookings",
    description: "Receive new booking notifications from Make integrations",
    platform: "vrbo",
    method: "POST",
    testPayload: {
      type: "new_booking",
      timestamp: Date.now(),
      platform: "vrbo",
      data: {
        property_id: "property-1",
        room_id: "room-789",
        booking_id: "book-12345",
        dates: {
          check_in: "2023-11-10",
          check_out: "2023-11-13",
        },
        guest: {
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          phone: "+1234567890"
        },
        price: {
          currency: "USD",
          total: 599.97,
          taxes: 59.97,
          fees: 50.00
        }
      }
    }
  },
  {
    id: "modification",
    name: "Booking Modification",
    path: "/api/webhooks/bookings",
    description: "Receive booking modification requests from Make integrations",
    platform: "expedia",
    method: "PUT",
    testPayload: {
      type: "modify_booking",
      timestamp: Date.now(),
      platform: "expedia",
      data: {
        property_id: "property-1",
        booking_id: "book-12345",
        changes: {
          old_dates: {
            check_in: "2023-11-10",
            check_out: "2023-11-13",
          },
          new_dates: {
            check_in: "2023-11-11",
            check_out: "2023-11-15",
          },
          old_price: {
            currency: "USD",
            total: 599.97
          },
          new_price: {
            currency: "USD",
            total: 799.96
          }
        }
      }
    }
  },
  {
    id: "cancellation",
    name: "Booking Cancellation",
    path: "/api/webhooks/bookings",
    description: "Receive booking cancellation requests from Make integrations",
    platform: "tripadvisor",
    method: "DELETE",
    testPayload: {
      type: "cancel_booking",
      timestamp: Date.now(),
      platform: "tripadvisor",
      data: {
        property_id: "property-1",
        booking_id: "book-12345",
        cancellation_reason: "Guest requested",
        refund_amount: 299.98,
        refund_percentage: 50,
        cancellation_date: "2023-10-25"
      }
    }
  }
];

export function verifyWebhookAuth(token: string): boolean {
  return token === 'make-webhook-secret-token';
}

export async function handleAvailabilityUpdate(payload: AvailabilityUpdatePayload): Promise<WebhookResponse> {
  try {
    console.log(`Processing availability update for property ${payload.propertyId}, room ${payload.roomId}`);
    
    return {
      success: true,
      message: `Processed availability update for ${payload.dates.length} dates`,
      data: {
        propertyId: payload.propertyId,
        updatedDates: payload.dates.map(d => d.date)
      }
    };
  } catch (error) {
    console.error('Error handling availability update:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function handleRateUpdate(payload: RateUpdatePayload): Promise<WebhookResponse> {
  try {
    console.log(`Processing rate update for property ${payload.propertyId}, room ${payload.roomId}`);
    
    return {
      success: true,
      message: `Processed rate update for ${payload.rates.length} dates`,
      data: {
        propertyId: payload.propertyId,
        updatedDates: payload.rates.map(r => r.date)
      }
    };
  } catch (error) {
    console.error('Error handling rate update:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function handleBookingOperation(payload: BookingPayload): Promise<WebhookResponse> {
  try {
    console.log(`Processing booking operation for property ${payload.propertyId}, room ${payload.roomId}`);
    
    if (Math.random() > 0.7) {
      const existingEvent: ICalEvent = {
        uid: "existing-123",
        summary: "Existing Booking",
        startDate: new Date(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: "CONFIRMED"
      };
      
      const incomingEvent: ICalEvent = {
        uid: "incoming-456",
        summary: "New Overlapping Booking",
        startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        lastModified: new Date(),
        status: "CONFIRMED"
      };
      
      const conflict: ICalConflict = {
        existingEvent,
        incomingEvent,
        resolution: 'keep_existing',
        propertyId: payload.propertyId,
        roomId: payload.roomId
      };
      
      return {
        success: false,
        message: "Booking creation failed due to date conflict",
        data: {
          conflict,
          requiresResolution: true
        }
      };
    }
    
    return {
      success: true,
      message: "Booking processed successfully",
      data: {
        bookingId: `generated-${Date.now()}`,
        propertyId: payload.propertyId,
        status: "confirmed"
      }
    };
  } catch (error) {
    console.error('Error handling booking operation:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export class WebhookService {
  private httpClient: HttpClient;
  
  constructor() {
    this.httpClient = new HttpClient('');
  }
  
  getWebhookEndpoints(): WebhookEndpoint[] {
    return [...webhooks];
  }
  
  getWebhookEndpoint(id: string): WebhookEndpoint | undefined {
    return webhooks.find(webhook => webhook.id === id);
  }
  
  processWebhook(path: string, method: string, payload: WebhookPayload): WebhookResponse {
    const endpoint = webhooks.find(wh => wh.path === path && wh.method === method);
    
    if (!endpoint) {
      return {
        success: false,
        message: "Webhook endpoint not found"
      };
    }
    
    try {
      switch(payload.type) {
        case "availability_update":
          return this.processAvailabilityUpdate(payload);
        case "rate_update":
          return this.processRateUpdate(payload);
        case "new_booking":
          return this.processNewBooking(payload);
        case "modify_booking":
          return this.processBookingModification(payload);
        case "cancel_booking":
          return this.processBookingCancellation(payload);
        default:
          return {
            success: false,
            message: `Unknown webhook type: ${payload.type}`
          };
      }
    } catch (err) {
      console.error("Error processing webhook:", err);
      return {
        success: false,
        message: err instanceof Error ? err.message : "Unknown error"
      };
    }
  }
  
  private processAvailabilityUpdate(payload: WebhookPayload): WebhookResponse {
    return {
      success: true,
      message: `Processed availability update for ${payload.data.dates.length} dates`,
      data: {
        property_id: payload.data.property_id,
        updated_dates: payload.data.dates.map((d: any) => d.date)
      }
    };
  }
  
  private processRateUpdate(payload: WebhookPayload): WebhookResponse {
    return {
      success: true,
      message: `Processed rate update for ${payload.data.rates.length} dates`,
      data: {
        property_id: payload.data.property_id,
        updated_dates: payload.data.rates.map((r: any) => r.date)
      }
    };
  }
  
  private processNewBooking(payload: WebhookPayload): WebhookResponse {
    if (Math.random() > 0.7) {
      const existingEvent: ICalEvent = {
        uid: "existing-123",
        summary: "Existing Booking",
        startDate: new Date(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: "CONFIRMED"
      };
      
      const incomingEvent: ICalEvent = {
        uid: "incoming-456",
        summary: "New Overlapping Booking",
        startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        lastModified: new Date(),
        status: "CONFIRMED"
      };
      
      const conflict: ICalConflict = {
        existingEvent,
        incomingEvent,
        resolution: 'keep_existing',
        propertyId: payload.data.property_id,
        roomId: payload.data.room_id
      };
      
      return {
        success: false,
        message: "Booking creation failed due to date conflict",
        data: {
          conflict
        }
      };
    }
    
    return {
      success: true,
      message: "Booking created successfully",
      data: {
        booking_id: `generated-${Date.now()}`,
        property_id: payload.data.property_id,
        status: "confirmed"
      }
    };
  }
  
  private processBookingModification(payload: WebhookPayload): WebhookResponse {
    return {
      success: true,
      message: "Booking modification processed successfully",
      data: {
        booking_id: payload.data.booking_id,
        property_id: payload.data.property_id,
        status: "modified"
      }
    };
  }
  
  private processBookingCancellation(payload: WebhookPayload): WebhookResponse {
    return {
      success: true,
      message: "Booking cancellation processed successfully",
      data: {
        booking_id: payload.data.booking_id,
        property_id: payload.data.property_id,
        status: "cancelled",
        refund_amount: payload.data.refund_amount
      }
    };
  }
}

export const webhookService = new WebhookService();
