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
  Calendar,
  CalendarDays,
  FileText,
  Copy,
  Pencil
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
import { ICalFeedsProvider, useICalFeeds } from '@/contexts/ICalFeedsContext';
import PlatformStatusCard from '@/components/channels/PlatformStatusCard';
import PlatformIntegrationForm from '@/components/channels/PlatformIntegrationForm';
import ICalFeedCard from '@/components/channels/ICalFeedCard';
import ICalFeedForm from '@/components/channels/ICalFeedForm';
import ICalConflictResolver from '@/components/channels/ICalConflictResolver';
import ICalLimitations from '@/components/channels/ICalLimitations';
import { PlatformCredentials, SyncOptions } from '@/services/api/bookingPlatforms';
import { ICalFeed, ICalConflict } from '@/services/api/icalService';

const platformIcons: Record<string, React.ReactNode> = {
  'Booking.com': <Building className="h-5 w-5 text-blue-600" />,
  'Expedia': <Layers className="h-5 w-5 text-yellow-600" />,
  'Airbnb': <Home className="h-5 w-5 text-red-600" />,
};

const ChannelsContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isPlatformDialogOpen, setIsPlatformDialogOpen] = useState(false);
  const [isICalDialogOpen, setIsICalDialogOpen] = useState(false);
  const [isICalInfoOpen, setIsICalInfoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('platforms');
  const [showSyncIssues, setShowSyncIssues] = useState<boolean>(false);
  const [selectedICalFeed, setSelectedICalFeed] = useState<ICalFeed | null>(null);
  const [iCalConflicts, setICalConflicts] = useState<ICalConflict[]>([]);
  
  const { 
    platforms, 
    supportedPlatforms, 
    connectPlatform, 
    disconnectPlatform, 
    getPlatformStatus, 
    syncPlatform, 
    configurePlatformSync,
    isConnecting,
    isSyncing: isPlatformSyncing,
  } = usePlatformIntegrations();
  
  const {
    feeds: icalFeeds,
    isLoading: isLoadingFeeds,
    isRefreshing: isICalSyncing,
    refreshFeeds,
    addFeed,
    updateFeed,
    deleteFeed,
    syncFeed,
    resolveConflict,
    generateExportUrl
  } = useICalFeeds();
  
  const filteredPlatforms = supportedPlatforms.filter(platform => 
    platform.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredICalFeeds = icalFeeds.filter(feed => 
    feed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feed.url.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  useEffect(() => {
    let hasIssues = false;
    
    for (const platform of supportedPlatforms) {
      const status = getPlatformStatus(platform);
      if (status && status.connected && status.errorCount > 0) {
        hasIssues = true;
        break;
      }
    }
    
    if (!hasIssues) {
      for (const feed of icalFeeds) {
        if (feed.status === 'error') {
          hasIssues = true;
          break;
        }
      }
    }
    
    setShowSyncIssues(hasIssues);
  }, [supportedPlatforms, getPlatformStatus, icalFeeds]);
  
  const handleConfigurePlatform = (platform: string) => {
    setSelectedPlatform(platform);
    setIsPlatformDialogOpen(true);
  };
  
  const handleConfigureICalFeed = (feed: ICalFeed | null = null) => {
    setSelectedICalFeed(feed);
    setIsICalDialogOpen(true);
  };
  
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
  
  const handleDisconnectPlatform = (platform: string) => {
    disconnectPlatform(platform);
    
    toast({
      title: "Platform Disconnected",
      description: `${platform} has been disconnected.`,
    });
  };
  
  const handleSyncPlatform = async (platform: string) => {
    try {
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
  
  const handleConfigureSync = (options: SyncOptions) => {
    if (!selectedPlatform) return;
    
    configurePlatformSync(selectedPlatform, options);
  };
  
  const handleICalFormSubmit = async (values: any) => {
    try {
      if (selectedICalFeed) {
        await updateFeed(selectedICalFeed.id, values);
      } else {
        await addFeed(values);
      }
      
      setIsICalDialogOpen(false);
      refreshFeeds();
    } catch (error) {
      console.error("Error saving iCal feed:", error);
    }
  };
  
  const handleDeleteICalFeed = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this feed?");
    if (confirmed) {
      await deleteFeed(id);
    }
  };
  
  const handleSyncICalFeed = async (id: string) => {
    try {
      const result = await syncFeed(id);
      
      if (result.conflicts.length > 0) {
        setICalConflicts(result.conflicts);
      }
      
      return result.success;
    } catch (error) {
      console.error('Error syncing iCal feed:', error);
      return false;
    }
  };
  
  const handleResolveConflict = async (conflict: ICalConflict, resolution: 'keep_existing' | 'use_incoming' | 'manual') => {
    try {
      await resolveConflict(conflict, resolution);
      
      setICalConflicts(current => 
        current.filter(c => 
          c.existingEvent.uid !== conflict.existingEvent.uid || 
          c.incomingEvent.uid !== conflict.incomingEvent.uid
        )
      );
      
      toast({
        title: "Conflict Resolved",
        description: `The booking conflict has been resolved using the "${
          resolution === 'keep_existing' ? 'keep existing booking' : 
          resolution === 'use_incoming' ? 'use incoming booking' : 
          'manual resolution'
        }" method.`,
      });
    } catch (error) {
      console.error('Error resolving conflict:', error);
      toast({
        title: "Resolution Failed",
        description: "Failed to resolve the booking conflict.",
        variant: "destructive",
      });
    }
  };
  
  const propertyICalUrl = generateExportUrl('property-1');
  
  const handleCopyICalUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "URL Copied",
        description: "The iCal URL has been copied to your clipboard.",
      });
    }).catch(err => {
      console.error('Failed to copy URL:', err);
      toast({
        title: "Copy Failed",
        description: "Failed to copy the URL to clipboard.",
        variant: "destructive",
      });
    });
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

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
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

      <Dialog open={isPlatformDialogOpen} onOpenChange={setIsPlatformDialogOpen}>
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
      
      <Dialog open={isICalDialogOpen} onOpenChange={setIsICalDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedICalFeed ? `Edit ${selectedICalFeed.name}` : 'Add iCal Feed'}
            </DialogTitle>
          </DialogHeader>
          
          <ICalFeedForm
            feed={selectedICalFeed || undefined}
            onSubmit={handleICalFormSubmit}
            onCancel={() => setIsICalDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isICalInfoOpen} onOpenChange={setIsICalInfoOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Understanding iCal Synchronization</DialogTitle>
          </DialogHeader>
          
          <ICalLimitations />
        </DialogContent>
      </Dialog>

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
                  isSyncing={isPlatformSyncing[platform] || false}
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

      {activeTab === 'ical' && (
        <>
          {iCalConflicts.length > 0 && (
            <div className="mb-6">
              <ICalConflictResolver 
                conflicts={iCalConflicts} 
                onResolve={handleResolveConflict} 
              />
            </div>
          )}
        
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-medium">iCal Calendar Feeds</h2>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsICalInfoOpen(true)}
              >
                <FileText className="h-4 w-4 mr-2" />
                About iCal
              </Button>
              <Button 
                size="sm"
                onClick={() => handleConfigureICalFeed()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feed
              </Button>
            </div>
          </div>
          
          <div className="mb-6 p-4 border rounded-lg bg-slate-50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-medium">Your Property's iCal Export URL</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Share this URL with external platforms to export your property's availability
                </p>
              </div>
              <div className="flex space-x-2 w-full sm:w-auto">
                <Input 
                  readOnly 
                  value={propertyICalUrl}
                  className="text-xs font-mono bg-white"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleCopyICalUrl(propertyICalUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingFeeds ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-48 rounded-lg bg-muted animate-pulse" />
              ))
            ) : filteredICalFeeds.length > 0 ? (
              filteredICalFeeds.map((feed) => (
                <ICalFeedCard
                  key={feed.id}
                  feed={feed}
                  onSync={() => handleSyncICalFeed(feed.id)}
                  onEdit={() => handleConfigureICalFeed(feed)}
                  onDelete={(id) => handleDeleteICalFeed(id)}
                  isSyncing={isICalSyncing[feed.id] || false}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg border border-dashed">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No iCal feeds found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchQuery ? 
                    `No feeds match your search "${searchQuery}".` : 
                    "Add your first iCal feed to synchronize with external platforms."}
                </p>
                {searchQuery ? (
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                ) : (
                  <Button onClick={() => handleConfigureICalFeed()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First iCal Feed
                  </Button>
                )}
              </div>
            )}
          </div>
        </>
      )}

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
                      disabled={isPlatformSyncing[platform]}
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${isPlatformSyncing[platform] ? 'animate-spin' : ''}`} />
                      {isPlatformSyncing[platform] ? 'Retrying...' : 'Retry Sync'}
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
          
          {icalFeeds.map(feed => {
            if (feed.status === 'error') {
              return (
                <div key={feed.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium ml-2">{feed.name}</h3>
                    </div>
                    <Badge variant="destructive">
                      Error
                    </Badge>
                  </div>
                  <p className="text-sm mb-2 truncate">
                    {feed.url}
                  </p>
                  <p className="text-sm mb-3 text-red-600">
                    {feed.error || 'Unknown error during synchronization'}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleSyncICalFeed(feed.id)}
                      disabled={isICalSyncing[feed.id]}
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${isICalSyncing[feed.id] ? 'animate-spin' : ''}`} />
                      {isICalSyncing[feed.id] ? 'Retrying...' : 'Retry Sync'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleConfigureICalFeed(feed)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
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

const Channels = () => {
  return (
    <PlatformIntegrationsProvider>
      <ICalFeedsProvider>
        <ChannelsContent />
      </ICalFeedsProvider>
    </PlatformIntegrationsProvider>
  );
};

export default Channels;
