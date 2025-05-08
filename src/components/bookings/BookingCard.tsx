
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Bike, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QRCodeDisplay from '@/components/payment/QRCodeDisplay';
import { BookingDetails } from '@/types/parking';

interface BookingCardProps {
  booking: BookingDetails;
  index: number;
  showQR: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, index, showQR }) => {
  // Parse the booking date
  const bookingDate = parseISO(booking.booking_date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="bg-muted p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{format(bookingDate, "MMMM d, yyyy")}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                booking.payment_status === 'paid' 
                  ? 'bg-green-100 text-green-800' 
                  : booking.payment_status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {booking.payment_status === 'paid' ? 'Paid' : 
                 booking.payment_status === 'pending' ? 'Pending' : 'Failed'}
              </span>
            </div>
          </div>
          
          <div className="p-4 space-y-3 flex-grow">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bike className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Spot {booking.spot_number}</h3>
                <p className="text-xs text-muted-foreground">
                  {booking.start_time} - {booking.end_time}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between text-sm border-t pt-3">
              <span className="text-muted-foreground">Booking ID:</span>
              <span>{booking.id.substring(0, 8)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">₹{booking.amount.toFixed(2)}</span>
            </div>
          </div>
          
          {showQR && booking.payment_status === 'paid' && (
            <div className="p-4 pt-0 flex justify-center">
              <div className="transform scale-75 origin-center">
                <QRCodeDisplay 
                  bookingId={booking.id}
                  status="confirmed"
                  expiryTime={`${format(bookingDate, "MM/dd/yyyy")} ${booking.end_time}`}
                  qrData={booking.qr_code}
                />
              </div>
            </div>
          )}
          
          <div className="p-4 border-t">
            <Button asChild variant="ghost" className="w-full justify-between">
              <Link to={`/bookings/${booking.id}`}>
                View Details
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BookingCard;
