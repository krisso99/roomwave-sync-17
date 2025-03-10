
import React, { useState } from 'react';
import { Filter, Download } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

const ActivityTab = () => {
  const [activityFilter, setActivityFilter] = useState('all');
  
  return (
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
  );
};

export default ActivityTab;
