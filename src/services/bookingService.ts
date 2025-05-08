
import { supabase } from '@/integrations/supabase/client';
import { BookingDetails, BookingRequest, BookingSummary } from '@/types/parking';

export const createBooking = async (bookingData: BookingRequest): Promise<BookingDetails> => {
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
  
  return data as BookingDetails;
};

export const fetchUserBookings = async (): Promise<BookingDetails[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      parking_spots:spot_id(
        spot_number,
        location,
        type
      )
    `)
    .order('booking_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
  
  // Transform the data to match our BookingDetails interface
  const bookings = data.map(booking => ({
    ...booking,
    spot_number: booking.parking_spots?.spot_number
  }));
  
  return bookings as BookingDetails[];
};

export const fetchBookingById = async (bookingId: string): Promise<BookingDetails> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      parking_spots:spot_id(
        spot_number,
        location,
        type
      )
    `)
    .eq('id', bookingId)
    .single();
  
  if (error) {
    console.error(`Error fetching booking ${bookingId}:`, error);
    throw error;
  }
  
  return {
    ...data,
    spot_number: data.parking_spots?.spot_number
  } as BookingDetails;
};

export const updateBookingStatus = async (
  bookingId: string, 
  status: 'booked' | 'checked_in' | 'completed' | 'cancelled',
  paymentStatus?: 'pending' | 'paid' | 'failed'
): Promise<void> => {
  const updateData: any = { 
    status, 
    updated_at: new Date().toISOString() 
  };
  
  if (paymentStatus) {
    updateData.payment_status = paymentStatus;
  }
  
  const { error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', bookingId);
  
  if (error) {
    console.error(`Error updating booking status ${bookingId}:`, error);
    throw error;
  }
};

export const generateBookingQR = async (bookingId: string, qrCode: string): Promise<void> => {
  const { error } = await supabase
    .from('bookings')
    .update({ qr_code: qrCode })
    .eq('id', bookingId);
  
  if (error) {
    console.error(`Error updating QR code for booking ${bookingId}:`, error);
    throw error;
  }
};

export const getBookingSummary = async (): Promise<BookingSummary> => {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*');
  
  if (error) {
    console.error('Error fetching bookings for summary:', error);
    throw error;
  }
  
  const summary: BookingSummary = {
    total: bookings.length,
    completed: bookings.filter(b => b.status === 'completed').length,
    active: bookings.filter(b => ['booked', 'checked_in'].includes(b.status)).length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    revenue: bookings
      .filter(b => b.payment_status === 'paid')
      .reduce((sum, booking) => sum + booking.amount, 0)
  };
  
  return summary;
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
  const { error } = await supabase
    .from('bookings')
    .update({ 
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('id', bookingId);
  
  if (error) {
    console.error(`Error cancelling booking ${bookingId}:`, error);
    throw error;
  }
};
