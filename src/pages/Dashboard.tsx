
import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Hotel, 
  BookOpen, 
  Calendar, 
  Activity, 
  AlertTriangle,
  DollarSign,
  Users,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Check,
  Clock,
  Plus,
  Calendar as CalendarIcon,
  Percent,
  RefreshCw,
  Link2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RevenueMetricsCard } from '@/components/dashboard/RevenueMetricsCard';
import { OccupancyChart } from '@/components/dashboard/OccupancyChart';
import { ChannelPerformance } from '@/components/dashboard/ChannelPerformance';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { UpcomingBookings } from '@/components/dashboard/UpcomingBookings';
import { QuickActions } from '@/components/dashboard/QuickActions';

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your channel manager dashboard</p>
        </div>
        
        <div className="flex gap-2">
          <Tabs defaultValue={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>Total Properties</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              4
              <Hotel className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xs text-muted-foreground">
              <span className="text-emerald-500 font-medium">+1</span> since last month
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button 
              variant="ghost" 
              className="p-0 h-auto text-primary text-sm"
              onClick={() => navigate('/app/properties')}
            >
              View all properties
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>Active Bookings</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              18
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xs text-muted-foreground">
              <span className="text-emerald-500 font-medium">+3</span> in the last 7 days
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button 
              variant="ghost" 
              className="p-0 h-auto text-primary text-sm"
              onClick={() => navigate('/app/bookings')}
            >
              View all bookings
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>Channel Connections</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              7
              <Link2 className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xs text-muted-foreground">
              <span className="text-amber-500 font-medium">2</span> need attention
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button 
              variant="ghost" 
              className="p-0 h-auto text-primary text-sm"
              onClick={() => navigate('/app/channels')}
            >
              Manage channels
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription>Occupancy Rate</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              78%
              <Activity className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-0">
            <Progress value={78} className="h-2" />
            <div className="text-xs text-muted-foreground mt-2">
              <span className="text-emerald-500 font-medium">+6%</span> from last month
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button 
              variant="ghost" 
              className="p-0 h-auto text-primary text-sm"
              onClick={() => navigate('/app/calendar')}
            >
              View calendar
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Revenue and Occupancy Stats */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <RevenueMetricsCard timeframe={timeframe} />
        <OccupancyChart timeframe={timeframe} />
      </div>

      {/* Channel Performance */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <ChannelPerformance className="lg:col-span-2" />
        <AlertsPanel />
      </div>
      
      {/* Upcoming Bookings and Quick Actions */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <UpcomingBookings className="lg:col-span-2" />
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;
