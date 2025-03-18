
import { useState, useEffect, ReactNode } from "react";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  Home, 
  Hotel, 
  CalendarDays, 
  BookOpen, 
  Link2, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  BarChart3,
  Users,
  DollarSign,
  Percent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check system preference
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (systemPrefersDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
  };

  const menuItems = [
    { label: "Dashboard", path: "/", icon: Home },
    { label: "Properties", path: "/properties", icon: Hotel },
    { label: "Bookings", path: "/bookings", icon: BookOpen },
    { label: "Calendar", path: "/calendar", icon: CalendarDays },
    { label: "Channels", path: "/channels", icon: Link2 },
    { label: "Rates", path: "/rates", icon: Percent },
    { label: "Analytics", path: "/analytics", icon: BarChart3 },
    { label: "Users", path: "/users", icon: Users },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    // Implement logout logic here
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    // Navigate to root in Next.js
    window.location.href = "/";
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-primary p-1">
                <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.0749 12.975 13.8623 12.975 13.5999C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.129 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">RiadSync</p>
                <p className="text-sidebar-foreground/60 text-xs">Channel Manager</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <Link href={item.path} passHref>
                        <SidebarMenuButton 
                          isActive={pathname === item.path}
                          asChild
                        >
                          <a>
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </a>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-sidebar-foreground/60">admin@riadsync.com</p>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
                  {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-0">
          <header className="h-14 border-b flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-xl font-medium">
                {menuItems.find(item => pathname === item.path)?.label || 
                 menuItems.find(item => pathname.startsWith(item.path + '/'))?.label || 
                 "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <DollarSign className="h-4 w-4 mr-1" />
                Revenue
              </Button>
              <Button variant="outline" size="sm" className="hidden md:flex">
                Quick Actions
              </Button>
            </div>
          </header>
          <main className="p-6 h-[calc(100vh-3.5rem)] overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
