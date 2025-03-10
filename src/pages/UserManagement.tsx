
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Shield, 
  ClipboardList, 
  UserPlus, 
  Search, 
  Filter,
  Download
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Sample user data
const users = [
  { 
    id: 1, 
    name: 'Sarah Johnson', 
    email: 'sarah.j@example.com', 
    role: 'Admin', 
    status: 'Active',
    properties: 'All Properties',
    lastActive: '10 minutes ago',
    avatar: null 
  },
  { 
    id: 2, 
    name: 'Michael Chen', 
    email: 'michael.c@example.com', 
    role: 'Manager', 
    status: 'Active',
    properties: 'Riad Al Jazira, Dar Anika',
    lastActive: '2 hours ago',
    avatar: null
  },
  { 
    id: 3, 
    name: 'Elena Rodriguez', 
    email: 'elena.r@example.com', 
    role: 'Staff', 
    status: 'Active',
    properties: 'Riad Al Jazira',
    lastActive: '3 days ago',
    avatar: null
  },
  { 
    id: 4, 
    name: 'James Wilson', 
    email: 'james.w@example.com', 
    role: 'Staff', 
    status: 'Inactive',
    properties: 'Kasbah Tamadot',
    lastActive: '2 weeks ago',
    avatar: null
  },
  { 
    id: 5, 
    name: 'Aisha Patel', 
    email: 'aisha.p@example.com', 
    role: 'Manager', 
    status: 'Active',
    properties: 'Riad Kniza',
    lastActive: 'Yesterday',
    avatar: null
  },
];

// Sample roles data
const roles = [
  { 
    name: 'Admin', 
    description: 'Full access to all settings and data',
    users: 1,
    permissions: 'All permissions'
  },
  { 
    name: 'Manager', 
    description: 'Manage bookings, rates, and limited settings',
    users: 2,
    permissions: 'Bookings, Properties, Rates, Reports'
  },
  { 
    name: 'Staff', 
    description: 'Day-to-day operations and guest management',
    users: 2,
    permissions: 'Bookings, Calendar, Check-in/out'
  },
];

// Sample activity logs
const activityLogs = [
  {
    id: 1,
    user: 'Sarah Johnson',
    action: 'Updated rate plan',
    details: 'Changed Standard Room rate for July 2023',
    timestamp: '2023-06-10 14:32',
    ipAddress: '192.168.1.45'
  },
  {
    id: 2,
    user: 'Michael Chen',
    action: 'Created booking',
    details: 'New booking #B12345 for Elena Smith',
    timestamp: '2023-06-10 12:18',
    ipAddress: '192.168.1.52'
  },
  {
    id: 3,
    user: 'System',
    action: 'Channel sync',
    details: 'Synchronized inventory with Booking.com',
    timestamp: '2023-06-10 12:00',
    ipAddress: 'System'
  },
  {
    id: 4,
    user: 'Elena Rodriguez',
    action: 'Check-in',
    details: 'Checked in guest for booking #B12340',
    timestamp: '2023-06-10 11:45',
    ipAddress: '192.168.1.48'
  },
  {
    id: 5,
    user: 'Sarah Johnson',
    action: 'Added user',
    details: 'Created new staff account for Aisha Patel',
    timestamp: '2023-06-09 16:22',
    ipAddress: '192.168.1.45'
  },
];

const UserManagement = () => {
  const [usersFilter, setUsersFilter] = useState('all');
  const [rolesFilter, setRolesFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage users, roles, and activity</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
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
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <CardTitle>User Accounts</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search users..."
                      className="pl-8 w-[180px] md:w-[200px] lg:w-[300px]"
                    />
                  </div>
                  
                  <Select value={usersFilter} onValueChange={setUsersFilter}>
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                      <SelectItem value="manager">Managers</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden md:table-cell">Properties</TableHead>
                    <TableHead className="hidden lg:table-cell">Last Active</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback>{user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.role === 'Admin' ? 'default' : 'outline'} 
                          className={user.role === 'Admin' ? '' : 'bg-muted text-foreground'}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm">{user.properties}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm">{user.lastActive}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'Active' ? 'success' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Roles Tab */}
        <TabsContent value="roles" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>User Roles</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Create Role
                  </Button>
                </div>
              </div>
              <CardDescription>
                Define roles and permissions for your team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead className="hidden md:table-cell">Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.name}>
                      <TableCell>
                        <div className="font-medium">{role.name}</div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{role.description}</span>
                      </TableCell>
                      <TableCell>{role.users}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm">{role.permissions}</span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        {role.name !== 'Admin' && (
                          <Button variant="ghost" size="sm">Delete</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Activity Tab */}
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <CardTitle>Activity Log</CardTitle>
                <div className="flex gap-2">
                  <Select value={activityFilter} onValueChange={setActivityFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="All Actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="booking">Bookings</SelectItem>
                      <SelectItem value="user">User Changes</SelectItem>
                      <SelectItem value="rates">Rate Changes</SelectItem>
                      <SelectItem value="sync">Channel Sync</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="hidden md:table-cell">Details</TableHead>
                    <TableHead className="hidden lg:table-cell">IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <span className="text-sm whitespace-nowrap">{log.timestamp}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{log.user}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm">{log.details}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-xs font-mono">{log.ipAddress}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
