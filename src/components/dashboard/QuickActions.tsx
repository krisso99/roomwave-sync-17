
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Hotel, 
  CalendarPlus, 
  BookOpen, 
  ArrowUpDown, 
  PanelLeft, 
  Link2, 
  Percent,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface QuickActionsProps {
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  className = ''
}) => {
  const navigate = useNavigate();
  
  const actions = [
    {
      icon: BookOpen,
      label: 'New Booking',
      path: '/app/bookings',
      color: 'text-blue-600',
    },
    {
      icon: Hotel,
      label: 'Add Property',
      path: '/app/properties',
      color: 'text-green-600',
    },
    {
      icon: CalendarPlus,
      label: 'Block Dates',
      path: '/app/calendar',
      color: 'text-purple-600',
    },
    {
      icon: Percent,
      label: 'Update Rates',
      path: '/app/rates',
      color: 'text-amber-600',
    },
    {
      icon: Link2,
      label: 'Connect Channel',
      path: '/app/channels',
      color: 'text-red-600',
    },
    {
      icon: RefreshCw,
      label: 'Sync All',
      path: '/app/channels',
      color: 'text-teal-600',
    },
  ];
  
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PanelLeft className="h-5 w-5 mr-2 text-primary" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Frequently used operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button 
              key={index}
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50"
              onClick={() => navigate(action.path)}
            >
              <action.icon className={`h-5 w-5 ${action.color}`} />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
        
        <div className="mt-6 space-y-3">
          <div className="text-sm font-medium mb-2">Recommended Actions</div>
          <div className="p-3 border rounded-lg bg-amber-50 text-amber-800">
            <div className="font-medium mb-1">Update Booking.com connection</div>
            <div className="text-xs mb-2">
              Your API key expires in 3 days
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full bg-white hover:bg-white/90"
              onClick={() => navigate('/app/channels')}
            >
              Update Now
            </Button>
          </div>
          
          <div className="p-3 border rounded-lg bg-blue-50 text-blue-800">
            <div className="font-medium mb-1">Rate parity check needed</div>
            <div className="text-xs mb-2">
              Rate discrepancies detected across channels
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full bg-white hover:bg-white/90"
              onClick={() => navigate('/app/rates')}
            >
              Review Rates
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
