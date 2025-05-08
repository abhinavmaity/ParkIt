
import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CardPaymentForm: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 mb-6"
    >
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input 
          id="cardNumber" 
          placeholder="1234 5678 9012 3456" 
          maxLength={19} 
          className="font-mono" 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input id="expiryDate" placeholder="MM/YY" maxLength={5} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input id="cvv" placeholder="123" maxLength={3} type="password" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="nameOnCard">Name on Card</Label>
        <Input id="nameOnCard" placeholder="John Doe" />
      </div>
    </motion.div>
  );
};

export default CardPaymentForm;
