
import React from 'react';
import { format } from 'date-fns';

interface SpotSummary {
  number: string;
  type: string;
  hourlyRate: number;
}

interface PaymentSummaryProps {
  selectedSpot: SpotSummary;
  date: Date;
  startTime: string;
  endTime: string;
  hours: number;
  amount: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  selectedSpot,
  date,
  startTime,
  endTime,
  hours,
  amount
}) => {
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Booking Summary</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Parking Spot</span>
            <div className="text-right">
              <span className="font-medium block">{selectedSpot.number}</span>
              <span className="text-xs text-muted-foreground capitalize">{selectedSpot.type}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{format(date, "MMMM d, yyyy")}</span>
          </div>
          
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Time</span>
            <span className="font-medium">{startTime} - {endTime}</span>
          </div>
          
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium">{hours} hours</span>
          </div>
          
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Rate</span>
            <span className="font-medium">₹{selectedSpot.hourlyRate.toFixed(2)} per hour</span>
          </div>
          
          <div className="flex justify-between items-center text-lg pt-2">
            <span className="font-semibold">Total Amount</span>
            <span className="font-semibold text-primary">₹{amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h3 className="text-lg font-medium mb-2">Booking Information</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="text-muted-foreground mr-2">•</span>
            <span>Your parking spot will be reserved for the entire duration.</span>
          </li>
          <li className="flex items-start">
            <span className="text-muted-foreground mr-2">•</span>
            <span>You can cancel your booking up to 1 hour before the start time.</span>
          </li>
          <li className="flex items-start">
            <span className="text-muted-foreground mr-2">•</span>
            <span>A QR code will be generated after payment for spot access.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentSummary;
