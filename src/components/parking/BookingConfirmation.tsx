
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Check } from 'lucide-react';
import QRCodeDisplay from '../payment/QRCodeDisplay';
import { fetchBookingById } from '@/services/bookingService';
import { Skeleton } from '@/components/ui/skeleton';

interface BookingConfirmationProps {
  bookingId: string;
  selectedSpot: {
    number: string;
    type: string;
  };
  date: Date;
  startTime: string;
  endTime: string;
  amount: number;
  transactionId?: string;
  paymentVerified?: boolean;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingId,
  selectedSpot,
  date,
  startTime,
  endTime,
  amount,
  transactionId,
  paymentVerified
}) => {
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState<string | undefined>();
  
  // Fetch booking details to get QR code
  useEffect(() => {
    const getBooking = async () => {
      try {
        setLoading(true);
        const booking = await fetchBookingById(bookingId);
        setQrCode(booking.qr_code);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getBooking();
  }, [bookingId]);
  
  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="mb-6 flex flex-col items-center">
        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.3 
            }}
          >
            <Check className="h-10 w-10 text-green-600" />
          </motion.div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-muted-foreground mb-6">
          Your parking spot has been reserved for {format(date, "MMMM d, yyyy")}
        </p>
        
        <div className="bg-card border border-border rounded-xl p-6 w-full mb-6">
          <div className="flex justify-between mb-4 pb-4 border-b border-border">
            <span className="text-muted-foreground">Booking ID</span>
            <span className="font-medium">#{bookingId.substring(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between mb-4 pb-4 border-b border-border">
            <span className="text-muted-foreground">Parking Spot</span>
            <div className="text-right">
              <span className="font-medium block">{selectedSpot?.number}</span>
              <span className="text-xs text-muted-foreground capitalize">{selectedSpot?.type}</span>
            </div>
          </div>
          <div className="flex justify-between mb-4 pb-4 border-b border-border">
            <span className="text-muted-foreground">Date & Time</span>
            <span className="font-medium">{format(date, "MMM d, yyyy")} • {startTime}-{endTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount Paid</span>
            <span className="text-green-600 font-medium">₹{amount.toFixed(2)}</span>
          </div>
          {transactionId && (
            <div className="flex justify-between mt-4 pt-4 border-t border-border">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-medium">{transactionId}</span>
            </div>
          )}
          {paymentVerified && (
            <div className="mt-4 text-green-600 text-sm flex items-center justify-center">
              <Check className="h-4 w-4 mr-1" /> Payment verified
            </div>
          )}
        </div>
        
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 w-full flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-4">
            Scan this QR code at the entrance or show it to security personnel when entering the parking area.
          </p>
          
          {loading ? (
            <Skeleton className="h-56 w-56 rounded-lg" />
          ) : (
            <QRCodeDisplay 
              bookingId={bookingId} 
              status="confirmed"
              expiryTime={`${format(date, "MMMM d, yyyy")} ${endTime}`}
              qrData={qrCode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
