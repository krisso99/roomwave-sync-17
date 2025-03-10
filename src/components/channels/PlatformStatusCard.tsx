import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Clock } from 'lucide-react';
import { IntegrationStatus } from '@/services/api/bookingPlatforms';

interface PlatformStatusCardProps {
  platform: string;
  status: IntegrationStatus;
  onSync: () => Promise<boolean>;
  onDisconnect: () => void;
  onConfigure: () => void;
  isSyncing: boolean;
  platformIcon?: React.ReactNode;
}

export const PlatformStatusCard: React.FC<PlatformStatusCardProps> = ({
  platform,
  status,
  onSync,
  onDisconnect,
  onConfigure,
  isSyncing,
  platformIcon,
}) => {
  const getStatusBadge = () => {
    if (!status.connected) {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Disconnected</Badge>;
    }
    
    if (status.syncInProgress) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Syncing</Badge>;
    }
    
    if (status.errorCount > 5) {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>;
    }
    
    return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Connected</Badge>;
  };
  
  const formatLastSync = () => {
    if (!status.lastSync) return 'Never';
    
    const now = new Date();
    const diff = Math.abs(now.getTime() - status.lastSync.getTime());
    
    // If less than 24 hours ago, show relative time
    if (diff < 24 * 60 * 60 * 1000) {
      return formatDistanceToNow(status.lastSync, { addSuffix: true });
    }
    
    // Otherwise show the date
    return format(status.lastSync, 'MMM d, yyyy h:mm a');
  };
  
  const getRateLimitInfo = () => {
    if (!status.rateLimit.resetTime) return 'No rate limit info';
    
    const now = new Date();
    if (status.rateLimit.resetTime < now) {
      return `${status.rateLimit.remaining} requests available`;
    }
    
    const minutesUntilReset = Math.ceil((status.rateLimit.resetTime.getTime() - now.getTime()) / (60 * 1000));
    return `${status.rateLimit.remaining} requests (resets in ${minutesUntilReset} min)`;
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-md bg-muted">
              {platformIcon || <Calendar className="h-5 w-5 text-muted-foreground" />}
            </div>
            <div>
              <CardTitle className="text-lg">{platform}</CardTitle>
              <CardDescription>API Integration</CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <div className="flex items-center">
              {status.connected ? (
                status.errorCount > 0 ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                )
              ) : (
                <XCircle className="h-4 w-4 text-gray-400 mr-1" />
              )}
              <span className="text-sm">
                {status.connected 
                  ? (status.errorCount > 0 ? `Issues (${status.errorCount})` : 'Operational') 
                  : 'Disconnected'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last Sync</span>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-sm">{formatLastSync()}</span>
            </div>
          </div>
          
          {status.connected && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Rate Limit</span>
                        <span className="text-sm font-medium">{status.rateLimit.remaining}</span>
                      </div>
                      <Progress 
                        value={status.rateLimit.remaining} 
                        max={1000} // Assuming 1000 is the max, adjust accordingly
                        className="h-2" 
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{getRateLimitInfo()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2 border-t pt-4">
        {status.connected ? (
          <>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={onSync} 
              disabled={isSyncing || !status.connected}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
            
            <div className="flex w-full gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1" 
                onClick={onConfigure}
              >
                Configure
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-destructive hover:text-destructive" 
                onClick={onDisconnect}
              >
                Disconnect
              </Button>
            </div>
          </>
        ) : (
          <Button className="w-full" onClick={onConfigure}>
            Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PlatformStatusCard;
