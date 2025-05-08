
import { useState, useMemo, useEffect } from 'react';
import { fetchUserBookings } from '@/services/bookingService';
import { BookingDetails } from '@/types/parking';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useBookings = () => {
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('upcoming');
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          setBookings([]);
          return;
        }
        
        const userBookings = await fetchUserBookings();
        setBookings(userBookings);
      } catch (err) {
        console.error('Error loading bookings:', err);
        toast({
          title: 'Failed to load bookings',
          description: err instanceof Error ? err.message : 'An unexpected error occurred',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadBookings();
  }, [user, toast]);
  
  const upcomingBookings = useMemo(() => 
    bookings.filter(booking => new Date(booking.booking_date) > new Date()),
  [bookings]);
  
  const pastBookings = useMemo(() => 
    bookings.filter(booking => new Date(booking.booking_date) <= new Date()),
  [bookings]);
  
  const filteredBookings = useMemo(() => {
    const bookingsToFilter = activeTab === 'upcoming' ? upcomingBookings : pastBookings;
    
    return bookingsToFilter.filter(booking => {
      const matchesSearch = 
        booking.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        booking.spot_number.toLowerCase().includes(searchQuery.toLowerCase());
                           
      const matchesDate = filterDate 
        ? new Date(booking.booking_date).toDateString() === filterDate.toDateString() 
        : true;
      
      return matchesSearch && matchesDate;
    });
  }, [activeTab, upcomingBookings, pastBookings, searchQuery, filterDate]);
  
  const clearFilters = () => {
    setSearchQuery('');
    setFilterDate(undefined);
  };
  
  return {
    bookings,
    loading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filterDate,
    setFilterDate,
    filteredBookings,
    clearFilters,
    isFilterActive: !!searchQuery || !!filterDate
  };
};
