
import React from 'react';
import { format } from 'date-fns';
import { AlertTriangle, CheckSquare, XSquare, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ICalConflict } from '@/services/api/icalService';

interface ICalConflictResolverProps {
  conflicts: ICalConflict[];
  onResolve: (conflict: ICalConflict, resolution: 'keep_existing' | 'use_incoming' | 'manual') => Promise<void>;
}

const ICalConflictResolver: React.FC<ICalConflictResolverProps> = ({
  conflicts,
  onResolve,
}) => {
  if (conflicts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 flex items-start">
        <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium">Calendar Conflicts Detected</h3>
          <p className="text-sm mt-1">
            We've detected {conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''} between your calendars. 
            Please review and resolve each conflict to ensure your availability is accurate.
          </p>
        </div>
      </div>

      {conflicts.map((conflict, index) => (
        <Card key={index} className="border-amber-200">
          <CardHeader className="bg-amber-50 text-amber-800">
            <CardTitle className="text-lg flex items-center">
              <ArrowRightLeft className="h-5 w-5 mr-2" />
              Booking Conflict #{index + 1}
            </CardTitle>
            <CardDescription className="text-amber-700">
              Two different bookings are scheduled for the same dates.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-3">
                <h4 className="font-medium text-sm mb-2">Existing Booking</h4>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="w-1/3">Summary</TableHead>
                      <TableCell>{conflict.existingEvent.summary}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Check-in</TableHead>
                      <TableCell>{format(conflict.existingEvent.startDate, 'PPP')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Check-out</TableHead>
                      <TableCell>{format(conflict.existingEvent.endDate, 'PPP')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Created</TableHead>
                      <TableCell>{format(conflict.existingEvent.createdAt, 'PPp')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="border rounded-md p-3">
                <h4 className="font-medium text-sm mb-2">Incoming Booking</h4>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="w-1/3">Summary</TableHead>
                      <TableCell>{conflict.incomingEvent.summary}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Check-in</TableHead>
                      <TableCell>{format(conflict.incomingEvent.startDate, 'PPP')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Check-out</TableHead>
                      <TableCell>{format(conflict.incomingEvent.endDate, 'PPP')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Created</TableHead>
                      <TableCell>{format(conflict.incomingEvent.createdAt, 'PPp')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 bg-gray-50 p-4">
            <Button 
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50 w-full sm:w-auto"
              onClick={() => onResolve(conflict, 'keep_existing')}
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Keep Existing
            </Button>
            <Button 
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
              onClick={() => onResolve(conflict, 'use_incoming')}
            >
              <XSquare className="h-4 w-4 mr-2" />
              Use Incoming
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onResolve(conflict, 'manual')}
            >
              Resolve Manually
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ICalConflictResolver;
