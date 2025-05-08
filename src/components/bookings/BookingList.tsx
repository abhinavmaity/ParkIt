
import React from 'react';
import { Link } from 'react-router-dom';
import BookingCard from './BookingCard';
import EmptyState from './EmptyState';
import { Button } from '@/components/ui/button';
import { BookingDetails } from '@/types/parking';

interface BookingListProps {
  bookings: BookingDetails[];
  showQR: boolean;
  isFilterActive: boolean;
  onClearFilter: () => void;
}

const BookingList: React.FC<BookingListProps> = ({ 
  bookings, 
  showQR, 
  isFilterActive, 
  onClearFilter 
}) => {
  if (bookings.length === 0 && !isFilterActive) {
    return (
      <EmptyState
        title={showQR ? "No upcoming bookings" : "No past bookings"}
        description={showQR 
          ? "You don't have any upcoming parking reservations." 
          : "You don't have any past parking reservations."
        }
        action={showQR ? (
          <Button asChild>
            <Link to="/parking">Book a Spot</Link>
          </Button>
        ) : undefined}
      />
    );
  }

  if (bookings.length === 0 && isFilterActive) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No bookings found for the selected filters</p>
        <Button 
          variant="ghost" 
          className="mt-2"
          onClick={onClearFilter}
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking, index) => (
        <BookingCard 
          key={booking.id} 
          booking={booking} 
          index={index} 
          showQR={showQR} 
        />
      ))}
    </div>
  );
};

export default BookingList;
