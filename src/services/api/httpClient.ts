
import { toast } from "@/components/ui/use-toast";

export interface HttpRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
  error?: Error;
}

export class HttpError extends Error {
  status: number;
  data: any;
  
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

export class RateLimitError extends HttpError {
  resetTime: Date;
  
  constructor(message: string, status: number, resetTime: Date, data?: any) {
    super(message, status, data);
    this.name = 'RateLimitError';
    this.resetTime = resetTime;
  }
}

export default class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultOptions: HttpRequestOptions;
  
  constructor(
    baseUrl: string,
    defaultHeaders: Record<string, string> = {},
    defaultOptions: HttpRequestOptions = {}
  ) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders
    };
    this.defaultOptions = {
      timeout: 30000, // 30 seconds
      retries: 3,
      retryDelay: 1000, // 1 second
      ...defaultOptions
    };
  }
  
  private async performRequest<T>(
    method: string,
    endpoint: string,
    data?: any,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<T>> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const url = this.buildUrl(endpoint, mergedOptions.params);
    const headers = { ...this.defaultHeaders, ...mergedOptions.headers };
    
    let retries = 0;
    const maxRetries = mergedOptions.retries || 0;
    
    while (true) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), mergedOptions.timeout);
        
        const response = await fetch(url, {
          method,
          headers,
          body: data ? JSON.stringify(data) : undefined,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Handle rate limiting (generally 429 status)
        if (response.status === 429) {
          const resetTimeHeader = response.headers.get('X-RateLimit-Reset') || 
                                 response.headers.get('RateLimit-Reset') || 
                                 response.headers.get('Retry-After');
          
          const resetTime = resetTimeHeader ? 
            new Date(Date.now() + parseInt(resetTimeHeader) * 1000) :
            new Date(Date.now() + 60000); // Default to 1 minute if no header
            
          throw new RateLimitError(
            'Rate limit exceeded',
            response.status,
            resetTime,
            await this.parseResponseData(response)
          );
        }
        
        // Handle error responses
        if (!response.ok) {
          throw new HttpError(
            `HTTP Error: ${response.status} ${response.statusText}`,
            response.status,
            await this.parseResponseData(response)
          );
        }
        
        // Parse successful response
        const responseData = await this.parseResponseData(response);
        
        return {
          data: responseData,
          status: response.status,
          headers: this.extractHeaders(response.headers)
        };
      } catch (error: any) {
        // Check if we should retry
        if (
          retries < maxRetries &&
          !(error instanceof RateLimitError) && // Don't retry rate limits immediately
          (error.name === 'AbortError' || // Timeout
           error.status >= 500 || // Server errors
           error.status === 408) // Request timeout
        ) {
          retries++;
          const delay = mergedOptions.retryDelay || 1000;
          
          // Exponential backoff
          const backoffDelay = delay * Math.pow(2, retries - 1);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          continue;
        }
        
        // Rethrow if we can't/shouldn't retry
        throw error;
      }
    }
  }
  
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(endpoint, this.baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    return url.toString();
  }
  
  private async parseResponseData(response: Response): Promise<any> {
    const contentType = response.headers.get('Content-Type') || '';
    
    if (contentType.includes('application/json')) {
      return await response.json();
    } else if (contentType.includes('text/')) {
      return await response.text();
    } else {
      // For binary data or other formats
      return await response.blob();
    }
  }
  
  private extractHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  
  // Public methods for different HTTP verbs
  public async get<T>(endpoint: string, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    return this.performRequest<T>('GET', endpoint, undefined, options);
  }
  
  public async post<T>(endpoint: string, data?: any, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    return this.performRequest<T>('POST', endpoint, data, options);
  }
  
  public async put<T>(endpoint: string, data?: any, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    return this.performRequest<T>('PUT', endpoint, data, options);
  }
  
  public async patch<T>(endpoint: string, data?: any, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    return this.performRequest<T>('PATCH', endpoint, data, options);
  }
  
  public async delete<T>(endpoint: string, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    return this.performRequest<T>('DELETE', endpoint, undefined, options);
  }
}
