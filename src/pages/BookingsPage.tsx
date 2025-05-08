
import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { SectionTitle } from '@/components/ui/section-title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookingFilters from '@/components/bookings/BookingFilters';
import BookingList from '@/components/bookings/BookingList';
import { useBookings } from '@/hooks/useBookings';

const BookingsPage = () => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filterDate,
    setFilterDate,
    filteredBookings,
    clearFilters,
    isFilterActive
  } = useBookings();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <SectionTitle
          title="My Bookings"
          description="View and manage your parking reservations"
        />

        <Tabs 
          defaultValue="upcoming" 
          className="w-full" 
          onValueChange={value => setActiveTab(value)}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            
            <BookingFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterDate={filterDate}
              setFilterDate={setFilterDate}
            />
          </div>

          <TabsContent value="upcoming">
            <BookingList 
              bookings={filteredBookings} 
              showQR={true} 
              isFilterActive={isFilterActive} 
              onClearFilter={clearFilters} 
            />
          </TabsContent>
          
          <TabsContent value="past">
            <BookingList 
              bookings={filteredBookings} 
              showQR={false} 
              isFilterActive={isFilterActive} 
              onClearFilter={clearFilters} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default BookingsPage;
