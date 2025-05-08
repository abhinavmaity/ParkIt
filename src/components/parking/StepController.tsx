
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface StepControllerProps {
  bookingStep: number;
  onContinue: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const StepController: React.FC<StepControllerProps> = ({
  bookingStep,
  onContinue,
  onCancel,
  loading = false
}) => {
  return (
    <div className="mt-10 flex justify-between w-full max-w-4xl mx-auto px-4 sm:px-0">
      {bookingStep > 1 ? (
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Back
        </Button>
      ) : (
        <div></div>
      )}
      <Button onClick={onContinue} disabled={loading}>
        {loading ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </div>
        ) : (
          bookingStep === 1 ? 'Continue to Payment' : 
          bookingStep === 2 ? 'Pay Now' : 
          'View My Bookings'
        )}
      </Button>
    </div>
  );
};

export default StepController;
