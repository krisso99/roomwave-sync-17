
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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

const RolesTab = () => {
  return (
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
  );
};

export default RolesTab;
