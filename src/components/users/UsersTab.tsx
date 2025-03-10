
import React, { useState } from 'react';
import { Search, Download, UserPlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const UsersTab = () => {
  const [usersFilter, setUsersFilter] = useState('all');
  
  return (
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
  );
};

export default UsersTab;
