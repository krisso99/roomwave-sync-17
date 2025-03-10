
import React from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { RoomType, RateRule } from '@/contexts/RateContext';

interface RateListTabContentProps {
  roomTypes: RoomType[];
  rateRules: RateRule[];
  selectedRoomTypes: string[];
  onEditRate: (rate: RateRule) => void;
  onDeleteRate: (rateId: string) => void;
}

const RateListTabContent: React.FC<RateListTabContentProps> = ({
  roomTypes,
  rateRules,
  selectedRoomTypes,
  onEditRate,
  onDeleteRate,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate List</CardTitle>
        <CardDescription>
          Detailed list of all rate rules
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Type</TableHead>
                <TableHead>Rate Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rateRules.filter(rule => 
                (selectedRoomTypes.length === 0 || selectedRoomTypes.includes(rule.roomTypeId))
              ).map(rule => {
                const roomType = roomTypes.find(rt => rt.id === rule.roomTypeId);
                
                return (
                  <TableRow key={rule.id}>
                    <TableCell>{roomType?.name || 'Unknown'}</TableCell>
                    <TableCell>{rule.name}</TableCell>
                    <TableCell>
                      <Badge variant={
                        rule.type === 'special' ? 'destructive' : 
                        rule.type === 'seasonal' ? 'default' : 
                        'outline'
                      }>
                        {rule.type.charAt(0).toUpperCase() + rule.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>${rule.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {rule.startDate && rule.endDate ? (
                        <span className="text-sm">
                          {format(new Date(rule.startDate), 'MMM d, yyyy')} - {format(new Date(rule.endDate), 'MMM d, yyyy')}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Standard</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onEditRate(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this rate rule?')) {
                              onDeleteRate(rule.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RateListTabContent;
