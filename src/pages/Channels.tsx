
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Link2, 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';

// Mock data
const mockChannels = [
  {
    id: 'ch1',
    name: 'Booking.com',
    type: 'API',
    status: 'Connected',
    properties: 4,
    lastSync: '2023-09-15T14:35:00Z',
    syncRate: 95,
    apiKey: 'bk_api_123456',
    imageUrl: 'https://cdn.worldvectorlogo.com/logos/bookingcom.svg',
  },
  {
    id: 'ch2',
    name: 'Airbnb',
    type: 'API',
    status: 'Connected',
    properties: 3,
    lastSync: '2023-09-14T09:22:00Z',
    syncRate: 98,
    apiKey: 'ab_api_234567',
    imageUrl: 'https://cdn.worldvectorlogo.com/logos/airbnb.svg',
  },
  {
    id: 'ch3',
    name: 'Expedia',
    type: 'API',
    status: 'Error',
    properties: 2,
    lastSync: '2023-09-13T11:47:00Z',
    syncRate: 60,
    apiKey: 'ex_api_345678',
    imageUrl: 'https://cdn.worldvectorlogo.com/logos/expedia.svg',
  },
  {
    id: 'ch4',
    name: 'TripAdvisor',
    type: 'iCal',
    status: 'Connected',
    properties: 2,
    lastSync: '2023-09-12T16:30:00Z',
    syncRate: 85,
    icalUrl: 'https://calendar.example.com/tripadvisor.ics',
    imageUrl: 'https://cdn.worldvectorlogo.com/logos/tripadvisor-logo-circle-green.svg',
  },
  {
    id: 'ch5',
    name: 'VRBO',
    type: 'iCal',
    status: 'Connected',
    properties: 1,
    lastSync: '2023-09-11T10:15:00Z',
    syncRate: 90,
    icalUrl: 'https://calendar.example.com/vrbo.ics',
    imageUrl: 'https://cdn.worldvectorlogo.com/logos/vrbo.svg',
  },
];

const mockSyncIssues = [
  { 
    id: '1', 
    property: 'Riad Al Jazira', 
    channel: 'Expedia', 
    issue: 'API rate limit exceeded', 
    timestamp: '2023-09-15T14:35:00Z',
    status: 'active'
  },
  { 
    id: '2', 
    property: 'Dar Anika', 
    channel: 'Airbnb', 
    issue: 'Connection timeout', 
    timestamp: '2023-09-14T09:22:00Z',
    status: 'resolved'
  },
  { 
    id: '3', 
    property: 'Riad Kniza', 
    channel: 'Expedia', 
    issue: 'Invalid credential', 
    timestamp: '2023-09-13T11:47:00Z',
    status: 'active'
  },
];

const Channels = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isAddChannelOpen, setIsAddChannelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [newChannelType, setNewChannelType] = useState<'API' | 'iCal'>('API');

  // Filter channels based on search query and active tab
  const filteredChannels = mockChannels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'api' && channel.type === 'API') ||
                      (activeTab === 'ical' && channel.type === 'iCal') ||
                      (activeTab === 'issues' && channel.status === 'Error');
    
    return matchesSearch && matchesTab;
  });

  // Filter sync issues based on active tab
  const filteredSyncIssues = activeTab === 'issues' 
    ? mockSyncIssues.filter(issue => issue.status === 'active')
    : [];

  const handleAddChannel = () => {
    // Add channel logic would go here
    toast({
      title: "Channel added",
      description: "The new channel has been successfully added.",
    });
    setIsAddChannelOpen(false);
  };

  const handleSyncChannel = (id: string, name: string) => {
    // Sync channel logic would go here
    toast({
      title: "Sync initiated",
      description: `Synchronizing with ${name}...`,
    });

    // Simulate successful sync after 2 seconds
    setTimeout(() => {
      toast({
        title: "Sync complete",
        description: `Successfully synchronized with ${name}.`,
      });
    }, 2000);
  };

  const handleDisconnectChannel = (id: string, name: string) => {
    // Disconnect channel logic would go here
    toast({
      title: "Channel disconnected",
      description: `${name} has been disconnected.`,
    });
  };

  const resolveIssue = (id: string) => {
    toast({
      title: "Issue resolved",
      description: "The synchronization issue has been marked as resolved.",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Connected':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Connected</Badge>;
      case 'Error':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>;
      case 'Pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-display font-bold">Channel Manager</h1>
        
        <div className="flex w-full md:w-auto flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search channels..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dialog open={isAddChannelOpen} onOpenChange={setIsAddChannelOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Channel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Connect New Channel</DialogTitle>
                <DialogDescription>
                  Add a new distribution channel to your properties.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Tabs defaultValue="api" onValueChange={(value) => setNewChannelType(value as 'API' | 'iCal')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="API">API Integration</TabsTrigger>
                    <TabsTrigger value="iCal">iCal Feed</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="API" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="channel">Channel</Label>
                      <Select>
                        <SelectTrigger id="channel">
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="booking">Booking.com</SelectItem>
                          <SelectItem value="airbnb">Airbnb</SelectItem>
                          <SelectItem value="expedia">Expedia</SelectItem>
                          <SelectItem value="tripadvisor">TripAdvisor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <Input id="apiKey" placeholder="Enter API key" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="apiSecret">API Secret</Label>
                      <Input id="apiSecret" type="password" placeholder="Enter API secret" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="properties">Properties</Label>
                      <Select>
                        <SelectTrigger id="properties">
                          <SelectValue placeholder="Select properties" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Properties</SelectItem>
                          <SelectItem value="1">Riad Al Jazira</SelectItem>
                          <SelectItem value="2">Dar Anika</SelectItem>
                          <SelectItem value="3">Riad Kniza</SelectItem>
                          <SelectItem value="4">Kasbah Tamadot</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="iCal" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="icalName">Channel Name</Label>
                      <Input id="icalName" placeholder="Enter channel name" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="icalUrl">iCal URL</Label>
                      <Input id="icalUrl" placeholder="https://example.com/calendar.ics" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="icalProperty">Property</Label>
                      <Select>
                        <SelectTrigger id="icalProperty">
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Riad Al Jazira</SelectItem>
                          <SelectItem value="2">Dar Anika</SelectItem>
                          <SelectItem value="3">Riad Kniza</SelectItem>
                          <SelectItem value="4">Kasbah Tamadot</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="icalRoom">Room</Label>
                      <Select>
                        <SelectTrigger id="icalRoom">
                          <SelectValue placeholder="Select room" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="101">Jasmine Room</SelectItem>
                          <SelectItem value="102">Rose Room</SelectItem>
                          <SelectItem value="103">Mint Suite</SelectItem>
                          <SelectItem value="104">Saffron Room</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Add any additional notes here" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddChannelOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddChannel}>
                  Connect Channel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Channels Tabs */}
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Channels</TabsTrigger>
          <TabsTrigger value="api">API Integrations</TabsTrigger>
          <TabsTrigger value="ical">iCal Feeds</TabsTrigger>
          <TabsTrigger value="issues" className="relative">
            Issues
            {mockSyncIssues.filter(issue => issue.status === 'active').length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {mockSyncIssues.filter(issue => issue.status === 'active').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Channel Cards */}
      {activeTab !== 'issues' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChannels.length > 0 ? (
            filteredChannels.map((channel) => (
              <Card key={channel.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 flex items-center justify-center rounded-md bg-muted">
                        {channel.imageUrl ? (
                          <img src={channel.imageUrl} alt={channel.name} className="h-6 w-6 object-contain" />
                        ) : (
                          <Link2 className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{channel.name}</CardTitle>
                        <CardDescription>{channel.type} Integration</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => handleSyncChannel(channel.id, channel.name)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Sync Now
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Channel
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDisconnectChannel(channel.id, channel.name)}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Disconnect
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      {getStatusBadge(channel.status)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Properties</span>
                      <Badge variant="outline">{channel.properties}</Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Sync Rate</span>
                        <span className="text-sm font-medium">{channel.syncRate}%</span>
                      </div>
                      <Progress value={channel.syncRate} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Sync</span>
                      <span className="text-sm">{formatDate(channel.lastSync)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleSyncChannel(channel.id, channel.name)}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Now
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg border border-dashed">
              <Link2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No channels found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery ? 
                  `No channels match your search "${searchQuery}".` : 
                  "You haven't added any distribution channels yet."}
              </p>
              {searchQuery ? (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              ) : (
                <Button onClick={() => setIsAddChannelOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Channel
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        // Issues View
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Synchronization Issues
            </CardTitle>
            <CardDescription>
              Recent issues detected with channel synchronization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredSyncIssues.length > 0 ? (
              <div className="space-y-4">
                {filteredSyncIssues.map((issue) => (
                  <div key={issue.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{issue.property}</h3>
                        <p className="text-sm text-muted-foreground">{issue.channel}</p>
                      </div>
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>
                    </div>
                    <p className="text-sm mb-2">{issue.issue}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{formatDate(issue.timestamp)}</span>
                      <Button size="sm" variant="outline" onClick={() => resolveIssue(issue.id)}>Resolve</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">No active issues</h3>
                <p className="text-muted-foreground text-center">
                  All channels are currently synchronizing correctly.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Channels;
