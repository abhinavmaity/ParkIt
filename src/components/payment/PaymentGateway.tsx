
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, ArrowRight, QrCode, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import PaymentMethodOption from './PaymentMethodOption';
import UpiPaymentForm from './UpiPaymentForm';
import CardPaymentForm from './CardPaymentForm';
import QRCodeDisplay from './QRCodeDisplay';

interface PaymentGatewayProps {
  amount: number;
  onPaymentComplete: (success: boolean, transactionId?: string) => void;
  isProcessing?: boolean;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ 
  amount, 
  onPaymentComplete,
  isProcessing = false
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handlePaymentSubmit = async () => {
    if (paymentMethod === 'upi' && !upiId) {
      toast({
        title: 'UPI ID Required',
        description: 'Please enter your UPI ID to proceed with payment.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);

    if (paymentMethod === 'upi') {
      // Show QR code for UPI payment
      setShowPaymentQR(true);
      
      // In a real app, this would generate a UPI payment link or QR code
      // For this demo, we'll simulate payment after a delay
      setTimeout(() => {
        completePayment();
      }, 3000);
    } else {
      // Process card payment
      // For this demo, we'll simulate payment immediately
      setTimeout(() => {
        completePayment();
      }, 2000);
    }
  };
  
  const completePayment = () => {
    try {
      // Generate a mock transaction ID
      const transactionId = `TXN-${Math.floor(Math.random() * 1000000)}`;
      
      setIsLoading(false);
      setShowPaymentQR(false);
      onPaymentComplete(true, transactionId);
    } catch (error) {
      console.error('Payment error:', error);
      setIsLoading(false);
      setShowPaymentQR(false);
      
      toast({
        title: 'Payment Failed',
        description: 'There was an issue processing your payment. Please try again.',
        variant: 'destructive',
      });
      
      onPaymentComplete(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-card p-6 rounded-xl border border-border shadow-sm"
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-1">Payment</h2>
        <p className="text-muted-foreground">
          Amount to pay: <span className="font-medium text-foreground">₹{amount.toFixed(2)}</span>
        </p>
      </div>
      
      {showPaymentQR ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center mb-2">
            <h3 className="font-medium">Scan QR to Pay</h3>
            <p className="text-sm text-muted-foreground">Use any UPI app to scan and pay</p>
          </div>
          
          <div className="relative">
            <QRCodeDisplay 
              bookingId={`PAYMENT-${Date.now()}`} 
              status="confirmed"
              expiryTime={`${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            />
            
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            )}
          </div>
          
          <div className="w-full mt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setShowPaymentQR(false);
                setIsLoading(false);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            <PaymentMethodOption 
              value="upi" 
              label="UPI Payment" 
              icon={Smartphone}
              selectedMethod={paymentMethod}
              onSelect={setPaymentMethod}
            />
            
            <PaymentMethodOption 
              value="card" 
              label="Card Payment" 
              icon={CreditCard}
              selectedMethod={paymentMethod}
              onSelect={setPaymentMethod}
            />
          </div>
          
          {paymentMethod === 'upi' && (
            <UpiPaymentForm upiId={upiId} onChange={setUpiId} />
          )}
          
          {paymentMethod === 'card' && (
            <CardPaymentForm />
          )}
          
          <Button
            className="w-full"
            disabled={isLoading || isProcessing}
            onClick={handlePaymentSubmit}
          >
            {isLoading || isProcessing ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </div>
            ) : (
              <>
                Make Payment
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </>
      )}
    </motion.div>
  );
};

export default PaymentGateway;
