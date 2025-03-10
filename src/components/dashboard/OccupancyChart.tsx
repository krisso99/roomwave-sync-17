
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Hotel, ArrowUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const occupancyData = {
  daily: [
    { name: 'Mon', occupancy: 62 },
    { name: 'Tue', occupancy: 58 },
    { name: 'Wed', occupancy: 65 },
    { name: 'Thu', occupancy: 72 },
    { name: 'Fri', occupancy: 85 },
    { name: 'Sat', occupancy: 92 },
    { name: 'Sun', occupancy: 78 },
  ],
  weekly: [
    { name: 'Week 1', occupancy: 68 },
    { name: 'Week 2', occupancy: 75 },
    { name: 'Week 3', occupancy: 82 },
    { name: 'Week 4', occupancy: 79 },
  ],
  monthly: [
    { name: 'Jan', occupancy: 55 },
    { name: 'Feb', occupancy: 62 },
    { name: 'Mar', occupancy: 70 },
    { name: 'Apr', occupancy: 75 },
    { name: 'May', occupancy: 82 },
    { name: 'Jun', occupancy: 88 },
    { name: 'Jul', occupancy: 92 },
    { name: 'Aug', occupancy: 95 },
    { name: 'Sep', occupancy: 85 },
    { name: 'Oct', occupancy: 78 },
    { name: 'Nov', occupancy: 68 },
    { name: 'Dec', occupancy: 75 },
  ],
};

interface OccupancyChartProps {
  timeframe: 'daily' | 'weekly' | 'monthly';
  className?: string;
}

export const OccupancyChart: React.FC<OccupancyChartProps> = ({
  timeframe,
  className = ''
}) => {
  const data = occupancyData[timeframe];
  
  // Calculate average occupancy
  const averageOccupancy = Math.round(
    data.reduce((sum, item) => sum + item.occupancy, 0) / data.length
  );
  
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Hotel className="h-5 w-5 mr-2 text-primary" />
          Occupancy Statistics
        </CardTitle>
        <CardDescription>
          {timeframe === 'daily' 
            ? 'Daily occupancy rates' 
            : timeframe === 'weekly' 
              ? 'Weekly occupancy overview' 
              : 'Monthly occupancy trends'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Average Occupancy</p>
            <h3 className="text-2xl font-bold">{averageOccupancy}%</h3>
            <div className="flex items-center text-xs text-emerald-500">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+8% vs previous</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Peak Occupancy</p>
            <h3 className="text-2xl font-bold">
              {Math.max(...data.map(item => item.occupancy))}%
            </h3>
            <div className="text-xs text-muted-foreground">
              {timeframe === 'daily' ? 'Saturday' : timeframe === 'weekly' ? 'Week 3' : 'August'}
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Low Occupancy</p>
            <h3 className="text-2xl font-bold">
              {Math.min(...data.map(item => item.occupancy))}%
            </h3>
            <div className="text-xs text-muted-foreground">
              {timeframe === 'daily' ? 'Tuesday' : timeframe === 'weekly' ? 'Week 1' : 'January'}
            </div>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Occupancy']}
                contentStyle={{ 
                  background: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar 
                dataKey="occupancy" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
                barSize={timeframe === 'monthly' ? 20 : 30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
