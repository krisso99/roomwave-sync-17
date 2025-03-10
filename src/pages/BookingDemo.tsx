
import React, { useState } from 'react';
import BookingWidget from '@/components/booking/BookingWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BookingDemo = () => {
  const [propertyName, setPropertyName] = useState('Desert Rose Riad & Spa');
  const [primaryColor, setPrimaryColor] = useState('#8B5CF6');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Booking Widget Demo</h1>
        
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Widget Configuration</CardTitle>
                <CardDescription>
                  Customize how the booking widget looks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyName">Property Name</Label>
                  <Input
                    id="propertyName"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                    />
                    <div
                      className="w-10 h-10 rounded-full border"
                      style={{ backgroundColor: primaryColor }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Embed Code</CardTitle>
                <CardDescription>
                  Add this code to your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                  {`<script src="https://example.com/booking-widget.js"></script>
<div id="booking-widget" 
  data-property-id="123456"
  data-color="${primaryColor}"
></div>`}
                </pre>
              </CardContent>
            </Card>
          </div>
          
          <div className="border rounded-xl p-6 bg-card shadow-sm">
            <BookingWidget 
              propertyName={propertyName}
              primaryColor={primaryColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDemo;
