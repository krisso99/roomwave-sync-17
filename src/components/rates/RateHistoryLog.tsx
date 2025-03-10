
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useRates, RateChangeLog, RoomType } from '@/contexts/RateContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, History, Search } from 'lucide-react';

interface RateHistoryLogProps {
  roomTypes: RoomType[];
}

const RateHistoryLog: React.FC<RateHistoryLogProps> = ({ roomTypes }) => {
  const { rateChangeLogs } = useRates();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter logs based on search and room type
  const filteredLogs = rateChangeLogs.filter(log => {
    // Filter by room type if one is selected
    if (selectedRoomType && !log.roomTypeId.includes(selectedRoomType)) {
      return false;
    }
    
    // Filter by search query if provided
    if (searchQuery) {
      const roomType = roomTypes.find(rt => log.roomTypeId.includes(rt.id));
      const roomTypeName = roomType ? roomType.name : 'Unknown';
      
      return (
        roomTypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.changedBy.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return true;
  });
  
  // Sort logs by date
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const dateA = new Date(a.dateChanged).getTime();
    const dateB = new Date(b.dateChanged).getTime();
    
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            className="pl-8"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select
          value={selectedRoomType}
          onValueChange={setSelectedRoomType}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All room types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All room types</SelectItem>
            {roomTypes.map(roomType => (
              <SelectItem key={roomType.id} value={roomType.id}>
                {roomType.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={toggleSortOrder} className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          {sortOrder === 'asc' ? 'Oldest first' : 'Newest first'}
        </Button>
      </div>
      
      {sortedLogs.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Room Type</TableHead>
                <TableHead>Changed By</TableHead>
                <TableHead>Previous Rate</TableHead>
                <TableHead>New Rate</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLogs.map(log => {
                const roomType = roomTypes.find(rt => log.roomTypeId.includes(rt.id));
                const percentChange = ((log.newValue - log.previousValue) / log.previousValue) * 100;
                const isIncrease = percentChange > 0;
                const changeText = percentChange !== 0 
                  ? `${isIncrease ? '+' : ''}${percentChange.toFixed(1)}%` 
                  : '0%';
                  
                return (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.dateChanged), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell>{roomType ? roomType.name : 'Multiple'}</TableCell>
                    <TableCell>{log.changedBy}</TableCell>
                    <TableCell>${log.previousValue.toFixed(2)}</TableCell>
                    <TableCell>${log.newValue.toFixed(2)}</TableCell>
                    <TableCell className={
                      percentChange > 0 
                        ? 'text-green-600' 
                        : percentChange < 0 
                          ? 'text-red-600' 
                          : ''
                    }>
                      {changeText}
                    </TableCell>
                    <TableCell>{log.reason || 'No reason provided'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md">
          <History className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No rate changes found</h3>
          <p className="text-muted-foreground mt-2">
            {searchQuery || selectedRoomType
              ? 'Try adjusting your filters to see more results'
              : 'Rate changes will appear here once they are made'}
          </p>
        </div>
      )}
    </div>
  );
};

export default RateHistoryLog;
