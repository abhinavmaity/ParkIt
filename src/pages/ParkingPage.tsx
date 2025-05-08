
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/layouts/MainLayout';
import { SectionTitle } from '@/components/ui/section-title';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import BookingSteps from '@/components/parking/BookingSteps';
import SelectSpotSection from '@/components/parking/SelectSpotSection';
import PaymentSummary from '@/components/parking/PaymentSummary';
import BookingConfirmation from '@/components/parking/BookingConfirmation';
import StepController from '@/components/parking/StepController';
import PaymentGateway from '@/components/payment/PaymentGateway';
import { useAuth } from '@/contexts/AuthContext';
import { useParkingSpots } from '@/hooks/useParkingSpots';
import { createBooking, generateBookingQR } from '@/services/bookingService';
import { processUpiPayment, verifyPayment } from '@/services/paymentService';
import { SpotAvailability } from '@/types/parking';

const ParkingPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedSpotId, setSelectedSpotId] = useState<string | undefined>();
  const [bookingStep, setBookingStep] = useState(1);
  const [transactionId, setTransactionId] = useState<string | undefined>();
  const [bookingId, setBookingId] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [paymentVerified, setPaymentVerified] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { spots, loading: spotsLoading } = useParkingSpots(
    date, 
    `${startTime}:00`, 
    `${endTime}:00`
  );

  // Reset spot selection when date or time changes
  useEffect(() => {
    setSelectedSpotId(undefined);
  }, [date, startTime, endTime]);

  // Verify payment if transactionId exists
  useEffect(() => {
    const verify = async () => {
      if (transactionId && !paymentVerified) {
        try {
          const isValid = await verifyPayment(transactionId);
          setPaymentVerified(isValid);
          if (!isValid) {
            toast({
              title: "Payment Verification Failed",
              description: "There was an issue verifying your payment. Please contact support.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Payment verification error:", error);
        }
      }
    };
    
    verify();
  }, [transactionId, paymentVerified]);

  const handleSelectSpot = (id: string) => {
    setSelectedSpotId(id);
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };
  
  const handleTimeChange = (start: string, end: string) => {
    setStartTime(start);
    setEndTime(end);
  };

  const selectedSpot = spots.find(spot => spot.id === selectedSpotId);
  
  // Calculate hours and rate
  const hours = endTime && startTime 
    ? parseInt(endTime.split(':')[0]) - parseInt(startTime.split(':')[0]) 
    : 8; // Default to 8 hours
  
  const parkingFee = selectedSpot ? selectedSpot.hourly_rate * hours : 30.00 * hours;

  const handlePaymentComplete = async (success: boolean, txnId?: string) => {
    if (success && txnId && selectedSpot && user) {
      try {
        setIsSubmitting(true);
        
        // Create booking with user_id included
        const bookingData = {
          spot_id: selectedSpot.id,
          booking_date: format(date, 'yyyy-MM-dd'),
          start_time: `${startTime}:00`,
          end_time: `${endTime}:00`,
          amount: parkingFee,
          user_id: user.id // Add the user ID to the booking data
        };
        
        const newBooking = await createBooking(bookingData);
        setBookingId(newBooking.id);
        
        // Process payment
        const paymentResult = await processUpiPayment({
          userId: user.id,
          bookingId: newBooking.id,
          amount: parkingFee,
          paymentMethod: 'upi'
        }, user.id + '@upi');
        
        if (paymentResult.success && paymentResult.transactionId) {
          setTransactionId(paymentResult.transactionId);
          
          // Generate QR code
          const qrData = JSON.stringify({
            id: newBooking.id,
            spot: selectedSpot.spot_number,
            date: format(date, 'yyyy-MM-dd'),
            user: user.id,
            transaction: paymentResult.transactionId
          });
          await generateBookingQR(newBooking.id, qrData);
          
          setBookingStep(3);
          
          toast({
            title: "Payment Successful",
            description: "Your booking has been confirmed.",
          });
        } else {
          throw new Error(paymentResult.message || 'Payment failed');
        }
      } catch (error) {
        console.error('Booking error:', error);
        toast({
          title: "Booking Failed",
          description: "There was an issue processing your booking. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContinue = () => {
    if (bookingStep === 1) {
      if (!selectedSpotId) {
        toast({
          title: "No parking spot selected",
          description: "Please select an available parking spot to continue.",
          variant: "destructive",
        });
        return;
      }
      setBookingStep(2);
    } else if (bookingStep === 3) {
      navigate('/bookings');
    }
  };

  const handleCancel = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1);
    } else {
      setSelectedSpotId(undefined);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <SectionTitle 
          title="Find & Book Parking"
          description="Select your preferred date and parking spot"
        />

        <BookingSteps currentStep={bookingStep} />

        {bookingStep === 1 && (
          <SelectSpotSection
            date={date}
            onDateSelect={handleDateSelect}
            parkingSpots={spots.map(spot => ({
              id: spot.id,
              number: spot.spot_number,
              isAvailable: spot.isAvailable,
              type: spot.type,
              hourlyRate: spot.hourly_rate,
              location: spot.location
            }))}
            selectedSpotId={selectedSpotId}
            onSelectSpot={handleSelectSpot}
            loading={spotsLoading}
            startTime={startTime}
            endTime={endTime}
            onTimeChange={handleTimeChange}
          />
        )}

        {bookingStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div>
              <PaymentSummary 
                selectedSpot={{
                  number: selectedSpot?.spot_number || '',
                  type: selectedSpot?.type || 'standard',
                  hourlyRate: selectedSpot?.hourly_rate || 30
                }}
                date={date}
                startTime={startTime}
                endTime={endTime}
                hours={hours}
                amount={parkingFee}
              />
            </div>
            <div>
              <PaymentGateway 
                amount={parkingFee} 
                onPaymentComplete={handlePaymentComplete}
                isProcessing={isSubmitting}
              />
            </div>
          </motion.div>
        )}

        {bookingStep === 3 && bookingId && (
          <BookingConfirmation
            bookingId={bookingId}
            selectedSpot={{
              number: selectedSpot?.spot_number || '',
              type: selectedSpot?.type || 'standard'
            }}
            date={date}
            startTime={startTime}
            endTime={endTime}
            amount={parkingFee}
            transactionId={transactionId}
            paymentVerified={paymentVerified}
          />
        )}

        <StepController
          bookingStep={bookingStep}
          onContinue={handleContinue}
          onCancel={handleCancel}
          loading={isSubmitting}
        />
      </div>
    </MainLayout>
  );
};

export default ParkingPage;
