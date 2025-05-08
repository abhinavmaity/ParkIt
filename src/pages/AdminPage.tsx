
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { SectionTitle } from '@/components/ui/section-title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminReservations from '@/components/admin/AdminReservations';
import AdminUsers from '@/components/admin/AdminUsers';
import { useQuery } from '@tanstack/react-query';
import { getBookingSummary } from '@/services/bookingService';
import { fetchParkingSpots } from '@/services/parkingService';
import { getAllTransactions } from '@/services/paymentService';
import { useToast } from '@/components/ui/use-toast';
import AdminPanel from '@/components/admin/AdminPanel';
import { Transaction } from '@/types/parking';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  
  const { data: bookingSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ['bookingSummary'],
    queryFn: getBookingSummary,
    meta: {
      onError: (error: Error) => {
        toast({
          title: 'Failed to load booking summary',
          description: error.message || 'An unexpected error occurred',
          variant: 'destructive'
        });
      }
    }
  });
  
  const { data: parkingSpots, isLoading: spotsLoading } = useQuery({
    queryKey: ['parkingSpots'],
    queryFn: fetchParkingSpots,
    meta: {
      onError: (error: Error) => {
        toast({
          title: 'Failed to load parking spots',
          description: error.message || 'An unexpected error occurred',
          variant: 'destructive'
        });
      }
    }
  });
  
  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ['adminTransactions'],
    queryFn: getAllTransactions,
    meta: {
      onError: (error: Error) => {
        toast({
          title: 'Failed to load transactions',
          description: error.message || 'An unexpected error occurred',
          variant: 'destructive'
        });
      }
    }
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <SectionTitle 
          title="Admin Dashboard"
          description="Manage bookings, users, and view analytics"
        />

        <Tabs 
          defaultValue="overview" 
          value={activeTab}
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <AdminPanel
              bookingSummary={bookingSummary}
              parkingSpots={parkingSpots}
              transactions={transactions || []}
              isLoading={summaryLoading || spotsLoading || transactionsLoading}
            />
          </TabsContent>
          
          <TabsContent value="reservations">
            <AdminReservations />
          </TabsContent>
          
          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminPage;
