
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Hotel, CalendarDays, Link2, Check } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/app');
  };

  const features = [
    {
      icon: <Hotel className="h-10 w-10 text-primary" />,
      title: "Property Management",
      description: "Easily manage your riad or hotel properties from a central dashboard with intuitive controls."
    },
    {
      icon: <CalendarDays className="h-10 w-10 text-primary" />,
      title: "Unified Calendar",
      description: "View and manage all your bookings across different platforms in a single, easy-to-use calendar interface."
    },
    {
      icon: <Link2 className="h-10 w-10 text-primary" />,
      title: "Channel Integration",
      description: "Connect with all major booking platforms through API and iCal connections for seamless synchronization."
    }
  ];

  const benefits = [
    "No more double bookings",
    "Real-time availability updates",
    "Automatic price synchronization",
    "Simplified channel management",
    "Beautiful and intuitive interface",
    "Designed for Moroccan riads"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.0749 12.975 13.8623 12.975 13.5999C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.129 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z" fill="white" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="font-display text-xl font-semibold">RiadSync</div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#benefits" className="text-sm font-medium hover:text-primary transition-colors">Benefits</a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
          </nav>
          <Button onClick={handleGetStarted}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-accent to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block animate-fade-in">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                Simplified Channel Management for Riads
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 animate-slide-in">
              The Ultimate Channel Manager for Moroccan Riads
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-slide-in" style={{animationDelay: '0.1s'}}>
              Seamlessly manage your property inventory and bookings across all booking platforms with our intuitive, powerful channel manager designed specifically for riads and small hotels.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-in" style={{animationDelay: '0.2s'}}>
              <Button size="lg" onClick={handleGetStarted} className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline">
                Request Demo
              </Button>
            </div>
          </div>
        </div>
        
        {/* Abstract decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-2xl"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Key Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform provides everything you need to manage your property across multiple booking channels.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                <div className="mb-4 rounded-lg inline-flex items-center justify-center p-2 bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Why Choose RiadSync?</h2>
              <p className="text-lg text-muted-foreground">
                Designed specifically for the unique needs of Moroccan riads and small hotels.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-4">
                  <div className="rounded-full bg-primary/20 p-1 flex-shrink-0">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to Streamline Your Booking Management?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join riads and small hotels across Morocco who trust RiadSync to manage their bookings and inventory across multiple platforms.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={handleGetStarted}
            className="group text-primary font-medium"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-md bg-primary p-1">
                  <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.0749 12.975 13.8623 12.975 13.5999C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.129 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z" fill="white" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="font-display text-xl font-semibold">RiadSync</div>
              </div>
              <p className="text-muted-foreground">
                Simplifying channel management for riads and small hotels across Morocco.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Integrations</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Guides</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Support</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground">Email: contact@riadsync.com</li>
                <li className="text-muted-foreground">Phone: +212 522 123 456</li>
                <li className="text-muted-foreground">Address: Marrakech, Morocco</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} RiadSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
