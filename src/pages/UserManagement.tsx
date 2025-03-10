
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Shield, ClipboardList } from 'lucide-react';

// Import refactored components
import UsersTab from '@/components/users/UsersTab';
import RolesTab from '@/components/users/RolesTab';
import ActivityTab from '@/components/users/ActivityTab';
import AddUserButton from '@/components/users/AddUserButton';

const UserManagement = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage users, roles, and activity</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <AddUserButton />
        </div>
      </div>
      
      <Tabs defaultValue="users">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="users" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center">
            <ClipboardList className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>
        
        {/* Users Tab */}
        <TabsContent value="users" className="mt-6">
          <UsersTab />
        </TabsContent>
        
        {/* Roles Tab */}
        <TabsContent value="roles" className="mt-6">
          <RolesTab />
        </TabsContent>
        
        {/* Activity Tab */}
        <TabsContent value="activity" className="mt-6">
          <ActivityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
