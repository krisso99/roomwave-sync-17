
import React from 'react';
import { 
  ArrowUpRight, 
  Hotel, 
  BookOpen, 
  Calendar, 
  Activity, 
  AlertTriangle 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const bookingData = [
  { month: 'Jan', bookings: 12 },
  { month: 'Feb', bookings: 19 },
  { month: 'Mar', bookings: 24 },
  { month: 'Apr', bookings: 28 },
  { month: 'May', bookings: 32 },
  { month: 'Jun', bookings: 38 },
  { month: 'Jul', bookings: 42 },
  { month: 'Aug', bookings: 47 },
  { month: 'Sep', bookings: 35 },
  { month: 'Oct', bookings: 29 },
  { month: 'Nov', bookings: 22 },
  { month: 'Dec', bookings: 15 },
];

const recentSyncIssues = [
  { 
    id: '1', 
    property: 'Riad Al Jazira', 
    channel: 'Booking.com', 
    issue: 'API rate limit exceeded', 
    timestamp: '2023-09-15T14:35:00Z' 
  },
  { 
    id: '2', 
    property: 'Dar Anika', 
    channel: 'Airbnb', 
    issue: 'Connection timeout', 
    timestamp: '2023-09-14T09:22:00Z' 
  },
  { 
    id: '3', 
    property: 'Riad Kniza', 
    channel: 'Expedia', 
    issue: 'Invalid credential', 
    timestamp: '2023-09-13T11:47:00Z' 
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-8 animate-fade-in">
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
              <Calendar className="h-5 w-5 text-muted-foreground" />
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

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
        {/* Booking Statistics */}
        <Card className="lg:col-span-3 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Booking Statistics</CardTitle>
            <CardDescription>
              Total bookings per month in the current year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }} 
                  />
                  <Bar 
                    dataKey="bookings" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]} 
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sync Issues */}
        <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Sync Issues
            </CardTitle>
            <CardDescription>
              Recently detected synchronization issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSyncIssues.map((issue) => (
                <div key={issue.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span>{issue.property}</span>
                    <span className="text-amber-500">{issue.channel}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {issue.issue}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(issue.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/app/channels')}
            >
              View All Issues
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
