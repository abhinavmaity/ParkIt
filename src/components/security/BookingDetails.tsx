
import React from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Clock, MapPin, CheckCircle, XCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { BookingDetails as BookingDetailsType } from '@/types/parking';

interface BookingDetailsProps {
  bookingData: BookingDetailsType | null;
  onVerify: (approved: boolean, isExit?: boolean) => Promise<void>;
  onReset: () => void;
  loading: boolean;
  showExitOption?: boolean;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ 
  bookingData, 
  onVerify,
  onReset,
  loading,
  showExitOption = false
}) => {
  if (!bookingData) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No booking data available</p>
        <Button onClick={onReset} className="mt-4">Back to Scanner</Button>
      </div>
    );
  }

  const isCompleted = bookingData.status === 'completed';
  const isCheckedIn = bookingData.status === 'checked_in';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-primary/10 rounded-lg p-4 text-center">
        <h3 className="text-lg font-medium mb-1">Booking #{bookingData.id.substring(0, 8).toUpperCase()}</h3>
        <p className="text-sm text-muted-foreground">
          Status: <span className={`font-medium ${
            isCompleted ? 'text-green-600' : 
            isCheckedIn ? 'text-amber-600' : 
            'text-primary'
          }`}>
            {bookingData.status === 'booked' ? 'Booked' : 
             bookingData.status === 'checked_in' ? 'Checked In' :
             bookingData.status === 'completed' ? 'Completed' : 
             bookingData.status === 'cancelled' ? 'Cancelled' : 
             bookingData.status}
          </span>
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <User className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="font-medium">{bookingData.user_id.substring(0, 8).toUpperCase()}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <MapPin className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Parking Spot</p>
            <p className="font-medium">{bookingData.spot_number}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Calendar className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium">
              {bookingData.booking_date ? format(new Date(bookingData.booking_date), 'dd MMM yyyy') : 'N/A'}
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Clock className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Time</p>
            <p className="font-medium">
              {bookingData.start_time} - {bookingData.end_time}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 mt-6">
        {!isCompleted && (
          showExitOption && isCheckedIn ? (
            // Show check-out button for checked-in bookings
            <Button 
              variant="default"
              className="w-full"
              disabled={loading}
              onClick={() => onVerify(true, true)}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {loading ? 'Processing...' : 'Check Out'}
            </Button>
          ) : !isCheckedIn && (
            // Show verify buttons for new bookings
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="w-full"
                disabled={loading}
                onClick={() => onVerify(false)}
              >
                <XCircle className="h-4 w-4 mr-2 text-destructive" />
                {loading ? 'Processing...' : 'Deny Entry'}
              </Button>
              
              <Button 
                variant="default"
                className="w-full"
                disabled={loading}
                onClick={() => onVerify(true)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {loading ? 'Processing...' : 'Approve Entry'}
              </Button>
            </div>
          )
        )}
        
        <Button 
          variant={isCompleted || (showExitOption && isCheckedIn) ? "default" : "outline"} 
          className="w-full"
          onClick={onReset}
        >
          Back to Scanner
        </Button>
      </div>
    </motion.div>
  );
};

export default BookingDetails;
