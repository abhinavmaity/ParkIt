
import { supabase } from '@/integrations/supabase/client';
import { ParkingSpot, SpotAvailability } from '@/types/parking';
import { format } from 'date-fns';

export const fetchParkingSpots = async (): Promise<ParkingSpot[]> => {
  const { data, error } = await supabase
    .from('parking_spots')
    .select('*');
  
  if (error) {
    console.error('Error fetching parking spots:', error);
    throw error;
  }
  
  return data as ParkingSpot[];
};

export const callSpotAvailabilityFunction = async (
  spotId: string,
  bookingDate: string,
  startTime: string,
  endTime: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .rpc('check_spot_availability', {
      spot_id: spotId,
      booking_date: bookingDate,
      start_time: startTime,
      end_time: endTime
    });
  
  if (error) {
    console.error('Error checking spot availability:', error);
    throw error;
  }
  
  return data;
};

export const fetchAvailableSpots = async (
  date: string,
  startTime: string,
  endTime: string
): Promise<SpotAvailability[]> => {
  // First get all spots
  const spots = await fetchParkingSpots();
  
  console.log('Fetched all spots:', spots);
  
  // Prepare the result array
  const availableSpots: SpotAvailability[] = [];
  
  // Check each spot's availability
  for (const spot of spots) {
    try {
      // By default, consider the spot available if its status is 'available'
      let isAvailable = spot.status === 'available';
      
      console.log(`Spot ${spot.spot_number} initial status: ${spot.status}, isAvailable: ${isAvailable}`);
      
      // Only if the spot has an 'available' status, check for time-specific availability
      if (isAvailable) {
        try {
          // Check if the spot is available for the selected time period
          const timeAvailable = await callSpotAvailabilityFunction(
            spot.id,
            date,
            startTime,
            endTime
          );
          
          console.log(`Spot ${spot.spot_number} time availability check: ${timeAvailable}`);
          isAvailable = timeAvailable;
        } catch (timeError) {
          console.error(`Time availability check error for spot ${spot.id}:`, timeError);
          // If there's an error checking time availability, still consider the spot available
          // if its general status is 'available'
        }
      }
      
      availableSpots.push({
        id: spot.id,
        spot_number: spot.spot_number,
        isAvailable: isAvailable,
        hourly_rate: spot.hourly_rate,
        type: spot.type,
        location: spot.location
      });
      
      console.log(`Final availability for spot ${spot.spot_number}: ${isAvailable}`);
    } catch (error) {
      console.error(`Error processing spot ${spot.id}:`, error);
      // If there's an error checking availability, treat the spot as not available
      availableSpots.push({
        id: spot.id,
        spot_number: spot.spot_number,
        isAvailable: false,
        hourly_rate: spot.hourly_rate,
        type: spot.type,
        location: spot.location
      });
    }
  }
  
  console.log('Final availability results:', availableSpots.map(s => ({
    spot: s.spot_number,
    available: s.isAvailable
  })));
  
  return availableSpots;
};

export const updateParkingSpotStatus = async (
  spotId: string, 
  status: 'available' | 'booked' | 'maintenance'
): Promise<void> => {
  const { error } = await supabase
    .from('parking_spots')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', spotId);
  
  if (error) {
    console.error(`Error updating parking spot status ${spotId}:`, error);
    throw error;
  }
};
