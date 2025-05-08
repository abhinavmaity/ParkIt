
import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Clock, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface Booking {
  id: string;
  date: Date;
  spotNumber: string;
  startTime: string;
  endTime: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  amount: number;
}

const BookingHistory = () => {
  const { toast } = useToast();
  
  // Mock data for booking history
  const bookings: Booking[] = [
    {
      id: 'BK-1001',
      date: new Date(2023, 9, 15),
      spotNumber: 'A12',
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      paymentStatus: 'paid',
      amount: 30
    },
    {
      id: 'BK-1002',
      date: new Date(2023, 9, 16),
      spotNumber: 'A8',
      startTime: '10:00 AM',
      endTime: '4:00 PM',
      paymentStatus: 'paid',
      amount: 25
    },
    {
      id: 'BK-1003',
      date: new Date(2023, 9, 18),
      spotNumber: 'A15',
      startTime: '9:00 AM',
      endTime: '3:00 PM',
      paymentStatus: 'pending',
      amount: 20
    }
  ];
  
  const handleViewQR = (id: string) => {
    toast({
      title: "QR Code",
      description: `QR code for booking #${id} has been opened.`,
    });
  };
  
  const handleCancelBooking = (id: string) => {
    toast({
      title: "Booking Cancelled",
      description: `Booking #${id} has been cancelled.`,
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Booking History</CardTitle>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      
      <CardContent className="pt-4">
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>You don't have any booking history yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg overflow-hidden"
              >
                <div className="bg-muted p-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{format(booking.date, 'PP')}</span>
                  </div>
                  <div className="flex items-center">
                    {booking.paymentStatus === 'paid' ? (
                      <span className="flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Paid
                      </span>
                    ) : booking.paymentStatus === 'pending' ? (
                      <span className="flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </span>
                    ) : (
                      <span className="flex items-center text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        <XCircle className="h-3 w-3 mr-1" />
                        Failed
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Booking ID:</span>
                      <span>{booking.id}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spot Number:</span>
                      <span className="font-medium">{booking.spotNumber}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="text-primary font-medium">₹{booking.amount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-3 pt-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      onClick={() => handleViewQR(booking.id)}
                    >
                      View QR Code
                    </Button>
                    
                    {booking.date > new Date() && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-xs text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingHistory;
