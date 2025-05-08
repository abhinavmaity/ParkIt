
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bike, Calendar, DollarSign, Users } from 'lucide-react';

const AdminOverview = () => {
  // This would be fetched from the database in a real implementation
  const stats = {
    totalBookings: 127,
    activeBookings: 42,
    revenue: 12560,
    users: 89
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<Calendar className="h-5 w-5" />}
          color="blue"
        />
        <StatsCard 
          title="Active Bookings"
          value={stats.activeBookings}
          icon={<Bike className="h-5 w-5" />}
          color="green"
        />
        <StatsCard 
          title="Total Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          color="amber"
        />
        <StatsCard 
          title="Registered Users"
          value={stats.users}
          icon={<Users className="h-5 w-5" />}
          color="purple"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <div key={index} className="flex items-center border-b pb-3 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New booking created</p>
                    <p className="text-xs text-muted-foreground">{30 - index * 5} minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              Chart will be implemented here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'amber' | 'purple';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
              {icon}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <h3 className="text-2xl font-bold">{value}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminOverview;
