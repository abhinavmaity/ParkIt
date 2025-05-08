
import React from 'react';
import { motion } from 'framer-motion';
import { Bike, CreditCard, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingStepsProps {
  currentStep: number;
}

const BookingSteps: React.FC<BookingStepsProps> = ({
  currentStep,
}) => {
  return (
    <div className="w-full max-w-md mx-auto mb-10 px-4">
      <div className="flex items-center justify-center">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                backgroundColor: currentStep >= step ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
              }}
              transition={{ duration: 0.3 }}
              className={cn(
                "rounded-full h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-sm font-medium shadow-sm",
                currentStep >= step 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step === 1 ? (
                <Bike size={16} className="sm:size-18" />
              ) : step === 2 ? (
                <CreditCard size={16} className="sm:size-18" />
              ) : (
                <CalendarIcon size={16} className="sm:size-18" />
              )}
            </motion.div>
            
            {step < 3 && (
              <motion.div 
                className={cn(
                  "h-1 w-8 sm:w-16 mx-1",
                  currentStep > step 
                    ? "bg-primary" 
                    : "bg-muted"
                )}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ 
                  scaleX: 1, 
                  opacity: 1,
                  backgroundColor: currentStep > step ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
                }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-center mt-2 text-xs sm:text-sm text-muted-foreground">
        <div className="w-1/3 text-center">Select Spot</div>
        <div className="w-1/3 text-center">Payment</div>
        <div className="w-1/3 text-center">Confirmation</div>
      </div>
    </div>
  );
};

export default BookingSteps;
