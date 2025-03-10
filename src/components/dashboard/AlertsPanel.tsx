
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';

// Mock data
const alertData = [
  { 
    id: '1', 
    type: 'channel',
    channel: 'Booking.com', 
    property: 'Riad Al Jazira',
    message: 'API rate limit exceeded',
    severity: 'high', 
    timestamp: '2h ago'
  },
  { 
    id: '2', 
    type: 'inventory',
    channel: 'Airbnb', 
    property: 'Dar Anika',
    message: 'Inventory sync failed',
    severity: 'medium', 
    timestamp: '4h ago'
  },
  { 
    id: '3', 
    type: 'booking',
    channel: 'Expedia', 
    property: 'Riad Kniza',
    message: 'Double booking detected',
    severity: 'critical', 
    timestamp: '1d ago'
  },
  { 
    id: '4', 
    type: 'rate',
    channel: 'Direct', 
    property: 'Kasbah Tamadot',
    message: 'Rate parity issue detected',
    severity: 'low', 
    timestamp: '1d ago'
  },
  { 
    id: '5', 
    type: 'channel',
    channel: 'Booking.com', 
    property: 'Dar Anika',
    message: 'Connection timeout',
    severity: 'medium', 
    timestamp: '2d ago'
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-500 text-white';
    case 'high':
      return 'bg-orange-500 text-white';
    case 'medium':
      return 'bg-amber-500 text-white';
    case 'low':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-slate-500 text-white';
  }
};

interface AlertsPanelProps {
  className?: string;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  className = ''
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
          Alerts & Issues
        </CardTitle>
        <CardDescription>
          Issues requiring your attention
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[320px]">
          <div className="px-6 py-2 space-y-3">
            {alertData.map((alert) => (
              <div 
                key={alert.id} 
                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between mb-1">
                  <div className="font-medium">{alert.property}</div>
                  <Badge className={`${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {alert.message}
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-primary font-medium">{alert.channel}</span>
                  <span className="text-muted-foreground">{alert.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between p-4 border-t">
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button size="sm" onClick={() => navigate('/app/channels')}>
          <ExternalLink className="h-4 w-4 mr-2" />
          View All
        </Button>
      </CardFooter>
    </Card>
  );
};
