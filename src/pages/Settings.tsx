
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConfigPanel from '@/components/settings/ConfigPanel';

const Settings = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your channel manager and property settings
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <ConfigPanel />
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Account settings content will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Notification settings content will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>
                Manage connections to third-party services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Integration settings content will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
