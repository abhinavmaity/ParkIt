
import React from 'react';
import { motion } from 'framer-motion';
import { Bike, CreditCard, Bell, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export const QuickLinks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    navigate('/');
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 pb-2">
        <h3 className="text-lg font-medium mb-4">Quick Links</h3>
      </div>
      
      <div className="divide-y divide-border">
        <motion.div 
          whileHover={{ x: 5 }}
          className="p-4 px-6 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Bike className="h-4 w-4 text-primary" />
            </div>
            <span>My Vehicles</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </motion.div>
        
        <motion.div 
          whileHover={{ x: 5 }}
          className="p-4 px-6 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <span>Payment Methods</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </motion.div>
        
        <motion.div 
          whileHover={{ x: 5 }}
          className="p-4 px-6 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <span>Notifications</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </motion.div>
        
        <motion.div 
          whileHover={{ x: 5 }}
          className="p-4 px-6 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={handleLogout}
        >
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center mr-3">
              <LogOut className="h-4 w-4 text-destructive" />
            </div>
            <span>Logout</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </div>
    </div>
  );
};

export default QuickLinks;
