
import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  Calendar, 
  ExternalLink, 
  MoreHorizontal, 
  RefreshCw, 
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ICalFeed } from '@/services/api/icalService';

interface ICalFeedCardProps {
  feed: ICalFeed;
  onSync: (id: string) => void;
  onEdit: (feed: ICalFeed) => void;
  onDelete: (id: string) => void;
  isSyncing: boolean;
}

const ICalFeedCard: React.FC<ICalFeedCardProps> = ({
  feed,
  onSync,
  onEdit,
  onDelete,
  isSyncing
}) => {
  // Helper function to render the status badge
  const renderStatusBadge = () => {
    switch (feed.status) {
      case 'active':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" /> Active
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" /> Error
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Helper function to render the direction icon
  const renderDirectionIcon = () => {
    switch (feed.direction) {
      case 'import':
        return <ArrowDownToLine className="h-4 w-4 text-blue-500" />;
      case 'export':
        return <ArrowUpFromLine className="h-4 w-4 text-indigo-500" />;
      case 'both':
        return <ArrowLeftRight className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };
  
  // Helper function to render the last sync info
  const renderLastSync = () => {
    if (!feed.lastSync) {
      return <span className="text-muted-foreground text-sm">Never synced</span>;
    }
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-muted-foreground text-sm">
            Last sync: {formatDistanceToNow(feed.lastSync, { addSuffix: true })}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {format(feed.lastSync, 'PPpp')}
        </TooltipContent>
      </Tooltip>
    );
  };
  
  return (
    <Card className="shadow-sm hover:shadow transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-md">{feed.name}</CardTitle>
            {renderDirectionIcon()}
          </div>
          <CardDescription className="mt-1 truncate max-w-[250px]">
            {feed.url}
          </CardDescription>
        </div>
        {renderStatusBadge()}
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Auto Sync:</span>
            <span>{feed.autoSync ? `Every ${feed.syncInterval} minutes` : 'Disabled'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Conflict Priority:</span>
            <span>{feed.priority}</span>
          </div>
          {feed.error && (
            <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md text-xs">
              {feed.error}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        {renderLastSync()}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onSync(feed.id)}
            disabled={isSyncing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(feed)}>
                Edit Feed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(feed.url, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" /> Open URL
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => onDelete(feed.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ICalFeedCard;
