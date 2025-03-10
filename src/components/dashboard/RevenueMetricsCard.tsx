
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const revenueData = {
  daily: [
    { name: 'Mon', revenue: 420 },
    { name: 'Tue', revenue: 380 },
    { name: 'Wed', revenue: 450 },
    { name: 'Thu', revenue: 520 },
    { name: 'Fri', revenue: 680 },
    { name: 'Sat', revenue: 720 },
    { name: 'Sun', revenue: 650 },
  ],
  weekly: [
    { name: 'Week 1', revenue: 2800 },
    { name: 'Week 2', revenue: 3200 },
    { name: 'Week 3', revenue: 2950 },
    { name: 'Week 4', revenue: 3580 },
  ],
  monthly: [
    { name: 'Jan', revenue: 10500 },
    { name: 'Feb', revenue: 9200 },
    { name: 'Mar', revenue: 12800 },
    { name: 'Apr', revenue: 13900 },
    { name: 'May', revenue: 16200 },
    { name: 'Jun', revenue: 18100 },
    { name: 'Jul', revenue: 19500 },
    { name: 'Aug', revenue: 21300 },
    { name: 'Sep', revenue: 18700 },
    { name: 'Oct', revenue: 15400 },
    { name: 'Nov', revenue: 12300 },
    { name: 'Dec', revenue: 14200 },
  ],
};

interface RevenueMetricsCardProps {
  timeframe: 'daily' | 'weekly' | 'monthly';
  className?: string;
}

export const RevenueMetricsCard: React.FC<RevenueMetricsCardProps> = ({ 
  timeframe,
  className = ''
}) => {
  const data = revenueData[timeframe];
  
  const currentRevenue = timeframe === 'daily' 
    ? '€3,820' 
    : timeframe === 'weekly' 
      ? '€12,530' 
      : '€48,700';
      
  const changePercentage = timeframe === 'daily'
    ? 12.4
    : timeframe === 'weekly'
      ? 8.3
      : 15.7;
  
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-primary" />
          Revenue Metrics
        </CardTitle>
        <CardDescription>
          {timeframe === 'daily' 
            ? 'Daily revenue overview' 
            : timeframe === 'weekly' 
              ? 'Weekly revenue summary' 
              : 'Monthly revenue analysis'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Current {timeframe === 'monthly' ? 'Month' : timeframe === 'weekly' ? 'Week' : 'Day'}</p>
            <h3 className="text-2xl font-bold">{currentRevenue}</h3>
            <div className="flex items-center text-xs">
              {changePercentage > 0 ? (
                <div className="flex items-center text-emerald-500">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>+{changePercentage}%</span>
                </div>
              ) : (
                <div className="flex items-center text-rose-500">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  <span>{changePercentage}%</span>
                </div>
              )}
              <span className="text-muted-foreground ml-1">vs previous</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">YTD Revenue</p>
            <h3 className="text-2xl font-bold">€176,430</h3>
            <div className="flex items-center text-xs">
              <div className="flex items-center text-emerald-500">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>+23.8%</span>
              </div>
              <span className="text-muted-foreground ml-1">vs last year</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Forecasted</p>
            <h3 className="text-2xl font-bold">€214,800</h3>
            <div className="flex items-center text-xs">
              <div className="flex items-center text-emerald-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>On track</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip 
                formatter={(value) => [`€${value}`, 'Revenue']}
                contentStyle={{ 
                  background: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
