
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Link2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data
const channelData = [
  { name: 'Booking.com', value: 42, color: '#0066CC', bookings: 76, revenue: '€32,450' },
  { name: 'Airbnb', value: 28, color: '#FF5A5F', bookings: 51, revenue: '€24,280' },
  { name: 'Expedia', value: 16, color: '#FFD700', bookings: 29, revenue: '€12,750' },
  { name: 'Direct', value: 10, color: '#4BC0C0', bookings: 18, revenue: '€8,940' },
  { name: 'Other', value: 4, color: '#9966FF', bookings: 7, revenue: '€3,120' },
];

interface ChannelPerformanceProps {
  className?: string;
}

export const ChannelPerformance: React.FC<ChannelPerformanceProps> = ({
  className = ''
}) => {
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Link2 className="h-5 w-5 mr-2 text-primary" />
          Channel Performance
        </CardTitle>
        <CardDescription>
          Booking distribution and revenue by channel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Share']}
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Channel Performance Metrics</h3>
            <div className="space-y-3">
              {channelData.map((channel, index) => (
                <div key={index} className="flex justify-between items-center p-2 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: channel.color }} 
                    />
                    <span className="font-medium">{channel.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="font-mono">
                      {channel.bookings}
                    </Badge>
                    <span className="font-medium">{channel.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Total Bookings</span>
                <span>181</span>
              </div>
              <div className="flex justify-between text-sm font-medium mt-1">
                <span>Total Revenue</span>
                <span>€81,540</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
