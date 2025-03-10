
import { 
  handleAvailabilityUpdate, 
  handleRateUpdate, 
  handleBookingOperation,
  verifyWebhookAuth,
  AvailabilityUpdatePayload,
  RateUpdatePayload,
  BookingPayload,
  WebhookResponse,
  WebhookErrorResponse
} from './webhookService';

/**
 * Controller for Make webhook endpoints
 */
export class WebhookController {
  /**
   * Function to handle availability update webhooks
   */
  static async handleAvailabilityWebhook(
    request: Request
  ): Promise<Response> {
    try {
      // Check authorization
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return WebhookController.createErrorResponse(401, 'Unauthorized', 'missing_auth');
      }
      
      const token = authHeader.split(' ')[1];
      if (!verifyWebhookAuth(token)) {
        return WebhookController.createErrorResponse(403, 'Invalid webhook token', 'invalid_token');
      }
      
      // Parse request body
      const payload = await request.json() as AvailabilityUpdatePayload;
      
      // Process the update
      const result = await handleAvailabilityUpdate(payload);
      
      // Return formatted response
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error in availability webhook:', error);
      return WebhookController.createErrorResponse(
        500,
        'Internal server error processing availability update',
        'server_error'
      );
    }
  }
  
  /**
   * Function to handle rate update webhooks
   */
  static async handleRateWebhook(
    request: Request
  ): Promise<Response> {
    try {
      // Check authorization
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return WebhookController.createErrorResponse(401, 'Unauthorized', 'missing_auth');
      }
      
      const token = authHeader.split(' ')[1];
      if (!verifyWebhookAuth(token)) {
        return WebhookController.createErrorResponse(403, 'Invalid webhook token', 'invalid_token');
      }
      
      // Parse request body
      const payload = await request.json() as RateUpdatePayload;
      
      // Process the update
      const result = await handleRateUpdate(payload);
      
      // Return formatted response
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error in rate webhook:', error);
      return WebhookController.createErrorResponse(
        500,
        'Internal server error processing rate update',
        'server_error'
      );
    }
  }
  
  /**
   * Function to handle booking operation webhooks
   */
  static async handleBookingWebhook(
    request: Request
  ): Promise<Response> {
    try {
      // Check authorization
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return WebhookController.createErrorResponse(401, 'Unauthorized', 'missing_auth');
      }
      
      const token = authHeader.split(' ')[1];
      if (!verifyWebhookAuth(token)) {
        return WebhookController.createErrorResponse(403, 'Invalid webhook token', 'invalid_token');
      }
      
      // Parse request body
      const payload = await request.json() as BookingPayload;
      
      // Process the booking operation
      const result = await handleBookingOperation(payload);
      
      // Return formatted response
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : (result.data?.requiresResolution ? 409 : 400),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error in booking webhook:', error);
      return WebhookController.createErrorResponse(
        500,
        'Internal server error processing booking operation',
        'server_error'
      );
    }
  }
  
  /**
   * Helper function to create standardized error responses
   */
  private static createErrorResponse(
    statusCode: number,
    errorMessage: string,
    errorCode: string,
    details?: any
  ): Response {
    const errorResponse: WebhookErrorResponse = {
      error: errorMessage,
      code: errorCode,
      details: details
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
