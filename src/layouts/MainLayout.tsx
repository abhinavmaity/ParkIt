
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bike, User, Calendar, Menu, X, ShieldCheck, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export const MainLayout = ({ children, showNav = true }: MainLayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { toast } = useToast();
  const { user, profile, signOut, isAdmin, isSecurity } = useAuth();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Base menu items that are accessible to all authenticated users
  let menuItems = [
    { icon: <Bike size={20} />, label: 'Find Parking', path: '/parking' },
    { icon: <Calendar size={20} />, label: 'My Bookings', path: '/bookings' },
    { icon: <User size={20} />, label: 'Profile', path: '/profile' },
  ];
  
  // Add role-specific menu items
  if (profile) {
    if (isSecurity()) {
      menuItems.push({ icon: <ShieldCheck size={20} />, label: 'Security Scanner', path: '/security' });
    }
    
    if (isAdmin()) {
      menuItems.push({ icon: <Settings size={20} />, label: 'Admin Panel', path: '/admin' });
    }
  }

  // Handle sign out functionality
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {showNav && (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative w-8 h-8 bg-primary rounded-md flex items-center justify-center"
              >
                <Bike className="text-primary-foreground" size={18} />
              </motion.div>
              <motion.span
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="font-semibold text-lg"
              >
                ParkIt
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                >
                  <Link 
                    to={item.path}
                    className="flex items-center space-x-1 px-2 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}
              
              {user ? (
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Button variant="outline" onClick={handleSignOut} className="flex items-center space-x-1">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Link to="/login">
                    <Button>Login</Button>
                  </Link>
                </motion.div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <motion.div
            className={cn(
              "md:hidden absolute w-full bg-background border-b border-border",
              isMenuOpen ? "block" : "hidden"
            )}
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: isMenuOpen ? 'auto' : 0,
              opacity: isMenuOpen ? 1 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-2 px-3 py-2.5 rounded-md hover:bg-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {user ? (
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="flex items-center justify-center space-x-2 mt-2 w-full"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              ) : (
                <Link 
                  to="/login"
                  className="mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full">Login</Button>
                </Link>
              )}
            </nav>
          </motion.div>
        </header>
      )}

      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} ParkIt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
