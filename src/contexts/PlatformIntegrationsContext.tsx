
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  BookingPlatformIntegration, 
  PlatformCredentials, 
  SyncOptions,
  IntegrationStatus,
  createPlatformIntegration,
  getSupportedPlatforms
} from '@/services/api/bookingPlatforms';

type PlatformIntegrationsContextType = {
  platforms: Record<string, BookingPlatformIntegration>;
  connectPlatform: (platform: string, credentials: PlatformCredentials) => Promise<boolean>;
  disconnectPlatform: (platform: string) => void;
  getPlatformStatus: (platform: string) => IntegrationStatus | null;
  syncPlatform: (platform: string, propertyId: string) => Promise<boolean>;
  configurePlatformSync: (platform: string, options: SyncOptions) => void;
  supportedPlatforms: string[];
  isConnecting: Record<string, boolean>;
  isSyncing: Record<string, boolean>;
};

const PlatformIntegrationsContext = createContext<PlatformIntegrationsContextType | undefined>(undefined);

export const PlatformIntegrationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [platforms, setPlatforms] = useState<Record<string, BookingPlatformIntegration>>({});
  const [isConnecting, setIsConnecting] = useState<Record<string, boolean>>({});
  const [isSyncing, setIsSyncing] = useState<Record<string, boolean>>({});
  const supportedPlatforms = getSupportedPlatforms();
  
  // Initialize supported platforms
  useEffect(() => {
    const initialPlatforms: Record<string, BookingPlatformIntegration> = {};
    
    supportedPlatforms.forEach(platform => {
      initialPlatforms[platform] = createPlatformIntegration(platform);
    });
    
    setPlatforms(initialPlatforms);
    
    // Cleanup on unmount - stop any auto-sync
    return () => {
      Object.values(initialPlatforms).forEach(platform => {
        platform.stopAutoSync();
      });
    };
  }, []);
  
  // Connect to a booking platform
  const connectPlatform = async (platform: string, credentials: PlatformCredentials): Promise<boolean> => {
    if (!platforms[platform]) return false;
    
    setIsConnecting(prev => ({ ...prev, [platform]: true }));
    
    try {
      const result = await platforms[platform].authenticate(credentials);
      return result;
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      return false;
    } finally {
      setIsConnecting(prev => ({ ...prev, [platform]: false }));
    }
  };
  
  // Disconnect from a booking platform
  const disconnectPlatform = (platform: string) => {
    if (!platforms[platform]) return;
    
    // Stop any auto-sync
    platforms[platform].stopAutoSync();
    
    // Reset the platform instance
    setPlatforms(prev => ({
      ...prev,
      [platform]: createPlatformIntegration(platform)
    }));
  };
  
  // Get the status of a platform integration
  const getPlatformStatus = (platform: string): IntegrationStatus | null => {
    if (!platforms[platform]) return null;
    return platforms[platform].getStatus();
  };
  
  // Sync a platform
  const syncPlatform = async (platform: string, propertyId: string): Promise<boolean> => {
    if (!platforms[platform]) return false;
    
    setIsSyncing(prev => ({ ...prev, [platform]: true }));
    
    try {
      const result = await platforms[platform].manualSync(propertyId);
      return result;
    } catch (error) {
      console.error(`Error syncing ${platform}:`, error);
      return false;
    } finally {
      setIsSyncing(prev => ({ ...prev, [platform]: false }));
    }
  };
  
  // Configure sync options for a platform
  const configurePlatformSync = (platform: string, options: SyncOptions) => {
    if (!platforms[platform]) return;
    
    // Stop existing auto-sync if running
    platforms[platform].stopAutoSync();
    
    // Start new auto-sync with provided options
    if (options.autoSync) {
      platforms[platform].startAutoSync(options);
    }
  };
  
  const value = {
    platforms,
    connectPlatform,
    disconnectPlatform,
    getPlatformStatus,
    syncPlatform,
    configurePlatformSync,
    supportedPlatforms,
    isConnecting,
    isSyncing,
  };
  
  return (
    <PlatformIntegrationsContext.Provider value={value}>
      {children}
    </PlatformIntegrationsContext.Provider>
  );
};

export const usePlatformIntegrations = () => {
  const context = useContext(PlatformIntegrationsContext);
  if (context === undefined) {
    throw new Error('usePlatformIntegrations must be used within a PlatformIntegrationsProvider');
  }
  return context;
};
