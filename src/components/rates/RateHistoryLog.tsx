
import React, { useState } from 'react';
import { useRates, RateChangeLog, RoomType } from '@/contexts/RateContext';
import { format, subDays } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { DateRangePickerInline } from '@/components/ui/date-range-picker-inline';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RateHistoryLogProps {
  roomTypes: RoomType[];
}

const RateHistoryLog: React.FC<RateHistoryLogProps> = ({ roomTypes }) => {
  const { rateChangeLogs } = useRates();
  
  // State for filtering
  const [selectedRoomType, setSelectedRoomType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  // Sort options
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  // Filter logs
  const filteredLogs = rateChangeLogs.filter(log => {
    // Filter by room type
    if (selectedRoomType !== 'all' && log.roomTypeId !== selectedRoomType) {
      return false;
    }
    
    // Filter by date range
    const logDate = new Date(log.dateChanged);
    if (
      (dateRange.from && logDate < dateRange.from) || 
      (dateRange.to && logDate > dateRange.to)
    ) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const roomType = roomTypes.find(rt => rt.id === log.roomTypeId);
      const searchLower = searchQuery.toLowerCase();
      const roomTypeName = roomType?.name.toLowerCase() || '';
      const reason = (log.reason || '').toLowerCase();
      
      if (
        !roomTypeName.includes(searchLower) && 
        !reason.includes(searchLower) &&
        !log.changedBy.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sort logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const dateA = new Date(a.dateChanged).getTime();
    const dateB = new Date(b.dateChanged).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });
  
  // Format percent or amount change
  const formatChange = (previous: number, current: number) => {
    const diff = current - previous;
    const percentChange = ((diff / previous) * 100).toFixed(1);
    
    return (
      <div className="flex items-center">
        <span className="mr-2">${current.toFixed(2)}</span>
        <Badge 
          variant={diff > 0 ? "default" : diff < 0 ? "destructive" : "outline"}
          className="flex items-center gap-1"
        >
          {diff > 0 ? (
            <ArrowUp className="h-3 w-3" />
          ) : diff < 0 ? (
            <ArrowDown className="h-3 w-3" />
          ) : (
            <Minus className="h-3 w-3" />
          )}
          
          {diff !== 0 ? (
            <>
              {diff > 0 ? '+' : ''}{diff.toFixed(2)} ({diff > 0 ? '+' : ''}{percentChange}%)
            </>
          ) : (
            'No change'
          )}
        </Badge>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Room Type</label>
            <Select 
              value={selectedRoomType} 
              onValueChange={setSelectedRoomType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Room Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Room Types</SelectItem>
                {roomTypes.map(roomType => (
                  <SelectItem key={roomType.id} value={roomType.id}>
                    {roomType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Search</label>
            <Input
              placeholder="Search by user, reason, etc."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Order</label>
            <Select 
              value={sortOrder} 
              onValueChange={(value) => setSortOrder(value as 'newest' | 'oldest')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">Date Range</label>
          <DateRangePickerInline
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Room Type</TableHead>
              <TableHead>Changed By</TableHead>
              <TableHead>Rate Change</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLogs.length > 0 ? (
              sortedLogs.map((log) => {
                const roomType = roomTypes.find(rt => rt.id === log.roomTypeId);
                
                return (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.dateChanged), 'PPP p')}
                    </TableCell>
                    <TableCell>
                      {roomType?.name || log.roomTypeId}
                    </TableCell>
                    <TableCell>
                      {log.changedBy}
                    </TableCell>
                    <TableCell>
                      {formatChange(log.previousValue, log.newValue)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{log.reason || 'No reason provided'}</span>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No rate changes found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Showing {sortedLogs.length} of {rateChangeLogs.length} total changes
      </div>
    </div>
  );
};

export default RateHistoryLog;
