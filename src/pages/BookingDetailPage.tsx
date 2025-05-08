
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { SectionTitle } from '@/components/ui/section-title';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import QRCodeDisplay from '@/components/payment/QRCodeDisplay';
import { format } from 'date-fns';

const BookingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<{
    id: string;
    date: Date;
    spotNumber: string;
    startTime: string;
    endTime: string;
    paymentStatus: 'paid' | 'pending';
    amount: number;
  } | null>(null);

  useEffect(() => {
    // Simulate API call to fetch booking details
    setTimeout(() => {
      // Mock data for the booking
      setBookingDetails({
        id: id || 'BK-1001',
        date: new Date(),
        spotNumber: 'A12',
        startTime: '9:00 AM',
        endTime: '5:00 PM',
        paymentStatus: 'paid',
        amount: 30
      });
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const handleCancelBooking = () => {
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been successfully cancelled.",
    });
    
    setTimeout(() => {
      navigate('/bookings');
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <Link to="/bookings" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Bookings
          </Link>
        </div>

        <SectionTitle
          title="Booking Details"
          description="View and manage your parking reservation"
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-32 w-32 bg-muted rounded-lg mb-4"></div>
              <div className="h-4 w-48 bg-muted rounded mb-3"></div>
              <div className="h-4 w-40 bg-muted rounded"></div>
            </div>
          </div>
        ) : bookingDetails ? (
          <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="md:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Booking #{bookingDetails.id}</h3>
                  <p className="text-muted-foreground text-sm">
                    {format(bookingDetails.date, 'PPPP')}
                  </p>
                </div>

                <div className={`px-3 py-1 rounded-full text-sm ${
                  bookingDetails.paymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {bookingDetails.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Spot Number</p>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-primary" />
                    <p className="font-medium">{bookingDetails.spotNumber}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Time</p>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-primary" />
                    <p className="font-medium">{bookingDetails.startTime} - {bookingDetails.endTime}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-primary" />
                    <p className="font-medium">{format(bookingDetails.date, 'PP')}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-1 text-primary" />
                    <p className="font-medium">₹{bookingDetails.amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col items-center"
            >
              <h3 className="text-center font-medium mb-4">Entry QR Code</h3>
              <div className="mb-6">
                <QRCodeDisplay 
                  bookingId={bookingDetails.id}
                  status={bookingDetails.paymentStatus === 'paid' ? 'confirmed' : 'pending'}
                  expiryTime={`${bookingDetails.date.toLocaleDateString()} ${bookingDetails.endTime}`}
                />
              </div>
              <p className="text-xs text-center text-muted-foreground mb-3">
                Show this QR code to the security personnel at the entrance
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-card rounded-xl border border-border p-6 shadow-sm"
            >
              <h3 className="text-center font-medium mb-4">Booking Actions</h3>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Receipt Downloaded",
                      description: "Your booking receipt has been downloaded.",
                    });
                  }}
                >
                  Download Receipt
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(bookingDetails.id);
                    toast({
                      title: "Booking ID Copied",
                      description: "Booking ID has been copied to clipboard.",
                    });
                  }}
                >
                  Copy Booking ID
                </Button>
                
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleCancelBooking}
                >
                  Cancel Booking
                </Button>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Booking not found</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate('/bookings')}
            >
              Go to My Bookings
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BookingDetailPage;
