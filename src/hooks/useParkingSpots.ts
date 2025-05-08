
import { useState, useEffect } from 'react';
import { fetchAvailableSpots } from '@/services/parkingService';
import { SpotAvailability } from '@/types/parking';
import { format } from 'date-fns';

export const useParkingSpots = (
  date: Date,
  startTime: string = '09:00:00',
  endTime: string = '17:00:00'
) => {
  const [spots, setSpots] = useState<SpotAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const loadSpots = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const formattedDate = format(date, 'yyyy-MM-dd');
        const availableSpots = await fetchAvailableSpots(formattedDate, startTime, endTime);
        
        console.log('Loaded parking spots:', availableSpots);
        
        setSpots(availableSpots);
      } catch (err) {
        console.error('Error loading parking spots:', err);
        setError(err instanceof Error ? err : new Error('Failed to load parking spots'));
      } finally {
        setLoading(false);
      }
    };
    
    loadSpots();
  }, [date, startTime, endTime]);
  
  return { spots, loading, error };
};
