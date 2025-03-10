
import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  BarChart, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

// Mock data
const monthlyRevenueData = [
  { name: 'Jan', revenue: 10500, occupancy: 55, adr: 145 },
  { name: 'Feb', revenue: 9200, occupancy: 62, adr: 152 },
  { name: 'Mar', revenue: 12800, occupancy: 70, adr: 158 },
  { name: 'Apr', revenue: 13900, occupancy: 75, adr: 165 },
  { name: 'May', revenue: 16200, occupancy: 82, adr: 175 },
  { name: 'Jun', revenue: 18100, occupancy: 88, adr: 182 },
  { name: 'Jul', revenue: 19500, occupancy: 92, adr: 195 },
  { name: 'Aug', revenue: 21300, occupancy: 95, adr: 210 },
  { name: 'Sep', revenue: 18700, occupancy: 85, adr: 185 },
  { name: 'Oct', revenue: 15400, occupancy: 78, adr: 170 },
  { name: 'Nov', revenue: 12300, occupancy: 68, adr: 155 },
  { name: 'Dec', revenue: 14200, occupancy: 75, adr: 160 },
];

const channelSourceData = [
  { name: 'Booking.com', value: 42, color: '#0066CC' },
  { name: 'Airbnb', value: 28, color: '#FF5A5F' },
  { name: 'Expedia', value: 16, color: '#FFD700' },
  { name: 'Direct', value: 10, color: '#4BC0C0' },
  { name: 'Other', value: 4, color: '#9966FF' },
];

const roomTypeRevenueData = [
  { name: 'Standard Room', revenue: 35200, adr: 120, occupancy: 78 },
  { name: 'Deluxe Room', revenue: 58400, adr: 175, occupancy: 82 },
  { name: 'Junior Suite', revenue: 42600, adr: 210, occupancy: 65 },
  { name: 'Executive Suite', revenue: 32800, adr: 350, occupancy: 52 },
  { name: 'Family Room', revenue: 12700, adr: 195, occupancy: 72 },
];

const Analytics = () => {
  const [property, setProperty] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date()
  });
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Analytics</h1>
          <p className="text-muted-foreground">Analyze performance metrics for your properties</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto flex-wrap">
          <DateRangePicker 
            className="w-full md:w-auto"
            value={dateRange}
            onValueChange={setDateRange}
          />
          
          <Select value={property} onValueChange={setProperty}>
            <SelectTrigger className="w-full md:w-44">
              <SelectValue placeholder="All Properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="1">Riad Al Jazira</SelectItem>
              <SelectItem value="2">Dar Anika</SelectItem>
              <SelectItem value="3">Riad Kniza</SelectItem>
              <SelectItem value="4">Kasbah Tamadot</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* KPI Summary */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl">€182,100</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-emerald-500 font-medium">
              +12.5% from previous period
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Occupancy</CardDescription>
            <CardTitle className="text-2xl">78.5%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-emerald-500 font-medium">
              +5.3% from previous period
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Daily Rate</CardDescription>
            <CardTitle className="text-2xl">€171</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-emerald-500 font-medium">
              +8.9% from previous period
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>RevPAR</CardDescription>
            <CardTitle className="text-2xl">€134</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-emerald-500 font-medium">
              +14.2% from previous period
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Analysis Tabs */}
      <Tabs defaultValue="revenue">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="revenue" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="occupancy" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            Occupancy
          </TabsTrigger>
          <TabsTrigger value="sources" className="flex items-center">
            <PieChartIcon className="h-4 w-4 mr-2" />
            Sources
          </TabsTrigger>
          <TabsTrigger value="rooms" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Room Types
          </TabsTrigger>
        </TabsList>
        
        {/* Revenue Analysis */}
        <TabsContent value="revenue" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>
                Monthly revenue breakdown with year-over-year comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyRevenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `€${value}`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `€${value}`} />
                    <Tooltip formatter={(value) => `€${value}`} />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenue (Current Year)" 
                      stroke="hsl(var(--primary))" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="adr" 
                      name="ADR (€)" 
                      stroke="#82ca9d" 
                      activeDot={{ r: 6 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Occupancy Analysis */}
        <TabsContent value="occupancy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Analysis</CardTitle>
              <CardDescription>
                Monthly occupancy rates with year-over-year comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyRevenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="occupancy" 
                      name="Occupancy %" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Booking Sources */}
        <TabsContent value="sources" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Sources</CardTitle>
              <CardDescription>
                Distribution of bookings by source and channel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelSourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {channelSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Channel Distribution</h3>
                  <p className="text-sm text-muted-foreground">
                    Booking.com remains your primary channel with 42% of all bookings, followed by Airbnb at 28%. 
                    Direct bookings account for 10% of total bookings.
                  </p>
                  
                  <h4 className="font-medium mt-4">Year-over-Year Change</h4>
                  <div className="space-y-2">
                    {channelSourceData.map((channel, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: channel.color }} 
                          />
                          <span>{channel.name}</span>
                        </div>
                        <span className={index % 2 === 0 ? "text-emerald-500" : "text-red-500"}>
                          {index % 2 === 0 ? "+" : "-"}{Math.floor(Math.random() * 15) + 1}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Room Types */}
        <TabsContent value="rooms" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Room Type Performance</CardTitle>
              <CardDescription>
                Revenue and occupancy by room type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={roomTypeRevenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `€${value}`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="revenue" 
                      name="Revenue" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      yAxisId="right"
                      dataKey="occupancy" 
                      name="Occupancy %" 
                      fill="#82ca9d" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roomTypeRevenueData.map((room, index) => (
                  <Card key={index} className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardDescription>{room.name}</CardDescription>
                      <CardTitle className="text-lg">€{room.revenue.toLocaleString()}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs">
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">ADR:</span>
                        <span className="font-medium">€{room.adr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Occupancy:</span>
                        <span className="font-medium">{room.occupancy}%</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
