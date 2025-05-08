
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/layouts/MainLayout';
import { SectionTitle } from '@/components/ui/section-title';
import ProfileInformation from '@/components/profile/ProfileInformation';
import NotificationPreferences from '@/components/profile/NotificationPreferences';
import ProfileSummary from '@/components/profile/ProfileSummary';
import QuickLinks from '@/components/profile/QuickLinks';
import VehicleManagement from '@/components/profile/VehicleManagement';
import PaymentMethodManagement from '@/components/profile/PaymentMethodManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const { toast } = useToast();
  
  const [notificationPreferences, setNotificationPreferences] = useState({
    bookingConfirmations: true,
    bookingReminders: true,
    parkingUpdates: false,
    promotionalOffers: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', user.id)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setUserData({
            name: data.full_name || '',
            email: user.email || '',
            phone: data.phone || '',
          });
        }
      } catch (error: any) {
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setProfileLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, toast]);

  const handleNotificationChange = (key: keyof typeof notificationPreferences) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (loading || profileLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-10 flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <SectionTitle 
          title="My Profile"
          description="Manage your account information and preferences"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full mb-6">
                <TabsTrigger value="info">Personal Info</TabsTrigger>
                <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                <TabsTrigger value="payment">Payment Methods</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-8">
                <ProfileInformation 
                  userData={userData}
                  setUserData={setUserData}
                />

                <NotificationPreferences 
                  preferences={notificationPreferences}
                  onPreferenceChange={handleNotificationChange}
                />
              </TabsContent>
              
              <TabsContent value="vehicles">
                <VehicleManagement />
              </TabsContent>
              
              <TabsContent value="payment">
                <PaymentMethodManagement />
              </TabsContent>
            </Tabs>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-8"
          >
            <ProfileSummary userData={userData} />
            <QuickLinks />
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
