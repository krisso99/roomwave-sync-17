
import React, { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Check, X } from 'lucide-react';

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

// Available permissions for selection
const availablePermissions = [
  { id: 'bookings', name: 'Bookings', description: 'Create and manage bookings' },
  { id: 'properties', name: 'Properties', description: 'Manage property details' },
  { id: 'rates', name: 'Rates', description: 'Configure pricing and availability' },
  { id: 'reports', name: 'Reports', description: 'View analytics and reports' },
  { id: 'users', name: 'Users', description: 'Manage user accounts' },
  { id: 'settings', name: 'Settings', description: 'Configure system settings' },
  { id: 'calendar', name: 'Calendar', description: 'View and manage calendar' },
  { id: 'checkin', name: 'Check-in/out', description: 'Process guest check-ins and check-outs' },
];

const RolesTab = () => {
  const [open, setOpen] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would call an API to add the role
    toast({
      title: "Role created successfully",
      description: `${roleName} has been created with ${selectedPermissions.length} permissions`,
    });
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setRoleName('');
    setRoleDescription('');
    setSelectedPermissions([]);
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId) 
        : [...prev, permissionId]
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>User Roles</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
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

      {/* Create Role Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Define a new role and its permissions for your team members.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name</Label>
              <Input 
                id="roleName" 
                value={roleName} 
                onChange={(e) => setRoleName(e.target.value)} 
                placeholder="e.g. Front Desk Manager"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roleDescription">Description</Label>
              <Input 
                id="roleDescription" 
                value={roleDescription} 
                onChange={(e) => setRoleDescription(e.target.value)} 
                placeholder="Describe what this role is responsible for"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="permissions">Permissions</Label>
              <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto space-y-2">
                {availablePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => togglePermission(permission.id)}
                    >
                      {selectedPermissions.includes(permission.id) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <div>
                      <div className="font-medium text-sm">{permission.name}</div>
                      <div className="text-xs text-muted-foreground">{permission.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Role</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RolesTab;
