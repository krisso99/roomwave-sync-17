
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "./components/layouts/MainLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Bookings from "./pages/Bookings";
import BookingDetail from "./pages/BookingDetail";
import Channels from "./pages/Channels";
import CalendarView from "./pages/CalendarView";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import CheckInOut from "./pages/CheckInOut";
import RateManagement from "./pages/RateManagement";
import Analytics from "./pages/Analytics";
import UserManagement from "./pages/UserManagement"; // Add new import

// Context Providers
import { PlatformIntegrationsProvider } from "./contexts/PlatformIntegrationsContext";
import { BookingProvider } from "./contexts/BookingContext";
import { RateProvider } from "./contexts/RateContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PlatformIntegrationsProvider>
        <BookingProvider>
          <RateProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route 
                  path="/app" 
                  element={
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="properties" element={<Properties />} />
                  <Route path="properties/:id" element={<PropertyDetail />} />
                  <Route path="bookings" element={<Bookings />} />
                  <Route path="bookings/:id" element={<BookingDetail />} />
                  <Route path="check-in-out" element={<CheckInOut />} />
                  <Route path="channels" element={<Channels />} />
                  <Route path="rates" element={<RateManagement />} />
                  <Route path="calendar" element={<CalendarView />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </RateProvider>
        </BookingProvider>
      </PlatformIntegrationsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
