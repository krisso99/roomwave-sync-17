import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Link2, 
  RefreshCw, 
  AlertTriangle,
  Clock, 
  CheckCircle2, 
  XCircle,
  Layers,
  Building,
  Home,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { PlatformIntegrationsProvider, usePlatformIntegrations } from '@/contexts/PlatformIntegrationsContext';
import PlatformStatusCard from '@/components/channels/PlatformStatusCard';
import PlatformIntegrationForm from '@/components/channels/PlatformIntegrationForm';
import { PlatformCredentials, SyncOptions } from '@/services/api/bookingPlatforms';

// Icons for each platform
const platformIcons: Record<string, React.ReactNode> = {
  'Booking.com': <Building className="h-5 w-5 text-blue-600" />,
  'Expedia': <Layers className="h-5 w-5 text-yellow-600" />,
  'Airbnb': <Home className="h-5 w-5 text-red-600" />,
};

const ChannelsContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('platforms');
  const [showSyncIssues, setShowSyncIssues] = useState<boolean>(false);
  
  const { 
    platforms, 
    supportedPlatforms, 
    connectPlatform, 
    disconnectPlatform, 
    getPlatformStatus, 
    syncPlatform, 
    configurePlatformSync,
    isConnecting,
    isSyncing,
  } = usePlatformIntegrations();
  
  // Filter platforms based on search query
  const filteredPlatforms = supportedPlatforms.filter(platform => 
    platform.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate if we have any sync issues
  useEffect(() => {
    let hasIssues = false;
    
    for (const platform of supportedPlatforms) {
      const status = getPlatformStatus(platform);
      if (status && status.connected && status.errorCount > 0) {
        hasIssues = true;
        break;
      }
    }
    
    setShowSyncIssues(hasIssues);
  }, [supportedPlatforms, getPlatformStatus]);
  
  // Handle platform configuration
  const handleConfigurePlatform = (platform: string) => {
    setSelectedPlatform(platform);
    setIsConfigDialogOpen(true);
  };
  
  // Handle connection to a platform
  const handleConnectPlatform = async (credentials: PlatformCredentials) => {
    if (!selectedPlatform) return false;
    
    try {
      const success = await connectPlatform(selectedPlatform, credentials);
      
      if (success) {
        toast({
          title: "Connection Successful",
          description: `${selectedPlatform} has been successfully connected.`,
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error connecting to platform:', error);
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${selectedPlatform}.`,
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Handle disconnection from a platform
  const handleDisconnectPlatform = (platform: string) => {
    disconnectPlatform(platform);
    
    toast({
      title: "Platform Disconnected",
      description: `${platform} has been disconnected.`,
    });
  };
  
  // Handle platform sync
  const handleSyncPlatform = async (platform: string) => {
    try {
      // In a real application, you would get the actual property ID
      const propertyId = "current-property-id";
      
      const success = await syncPlatform(platform, propertyId);
      
      if (success) {
        toast({
          title: "Sync Completed",
          description: `${platform} has been successfully synchronized.`,
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error syncing platform:', error);
      toast({
        title: "Sync Failed",
        description: `Failed to synchronize with ${platform}.`,
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Handle sync configuration
  const handleConfigureSync = (options: SyncOptions) => {
    if (!selectedPlatform) return;
    
    configurePlatformSync(selectedPlatform, options);
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
        </div>
      </div>

      {/* Channels Tabs */}
      <Tabs defaultValue="platforms" onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="platforms">API Platforms</TabsTrigger>
          <TabsTrigger value="ical">iCal Feeds</TabsTrigger>
          {showSyncIssues && (
            <TabsTrigger value="issues" className="relative">
              Issues
              <Badge variant="destructive" className="ml-2">
                !
              </Badge>
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>

      {/* Platform Integration Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedPlatform} Integration</DialogTitle>
          </DialogHeader>
          
          {selectedPlatform && (
            <PlatformIntegrationForm
              platform={selectedPlatform}
              onConnect={handleConnectPlatform}
              onConfigureSync={handleConfigureSync}
              isConnected={getPlatformStatus(selectedPlatform)?.connected || false}
              isConnecting={isConnecting[selectedPlatform] || false}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Platforms List */}
      {activeTab === 'platforms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlatforms.length > 0 ? (
            filteredPlatforms.map((platform) => {
              const status = getPlatformStatus(platform) || {
                connected: false,
                lastSync: null,
                errorCount: 0,
                syncInProgress: false,
                rateLimit: { remaining: 0, resetTime: null },
              };
              
              return (
                <PlatformStatusCard
                  key={platform}
                  platform={platform}
                  status={status}
                  onSync={() => handleSyncPlatform(platform)}
                  onDisconnect={() => handleDisconnectPlatform(platform)}
                  onConfigure={() => handleConfigurePlatform(platform)}
                  isSyncing={isSyncing[platform] || false}
                  platformIcon={platformIcons[platform]}
                />
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg border border-dashed">
              <Link2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No channels found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery ? 
                  `No channels match your search "${searchQuery}".` : 
                  "Start by connecting to a booking platform."}
              </p>
              {searchQuery ? (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              ) : (
                <Button onClick={() => handleConfigurePlatform('Booking.com')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Connect Your First Platform
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* iCal Feeds Tab - This is a placeholder for the existing iCal functionality */}
      {activeTab === 'ical' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-full flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg border border-dashed">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">iCal Integration</h3>
            <p className="text-muted-foreground text-center mb-4">
              Import and export iCal feeds for your properties.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add iCal Feed
            </Button>
          </div>
        </div>
      )}

      {/* Issues Tab */}
      {activeTab === 'issues' && showSyncIssues && (
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 border rounded-lg bg-amber-50 text-amber-800 flex items-start">
            <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Synchronization Issues Detected</h3>
              <p className="text-sm mt-1">
                We've detected issues with some of your channel connections. Please review and resolve them to ensure your inventory stays synchronized.
              </p>
            </div>
          </div>
          
          {supportedPlatforms.map(platform => {
            const status = getPlatformStatus(platform);
            
            if (status && status.connected && status.errorCount > 0) {
              return (
                <div key={platform} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      {platformIcons[platform]}
                      <h3 className="font-medium ml-2">{platform}</h3>
                    </div>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {status.errorCount} {status.errorCount === 1 ? 'Issue' : 'Issues'}
                    </Badge>
                  </div>
                  <p className="text-sm mb-3">
                    There {status.errorCount === 1 ? 'is' : 'are'} {status.errorCount} synchronization {status.errorCount === 1 ? 'error' : 'errors'} with this platform.
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleSyncPlatform(platform)}
                      disabled={isSyncing[platform]}
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing[platform] ? 'animate-spin' : ''}`} />
                      {isSyncing[platform] ? 'Retrying...' : 'Retry Sync'}
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleConfigurePlatform(platform)}
                    >
                      Troubleshoot
                    </Button>
                  </div>
                </div>
              );
            }
            
            return null;
          })}
        </div>
      )}
    </div>
  );
};

// Wrap the component with the Provider
const Channels = () => {
  return (
    <PlatformIntegrationsProvider>
      <ChannelsContent />
    </PlatformIntegrationsProvider>
  );
};

export default Channels;
