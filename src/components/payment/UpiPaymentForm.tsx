
import React from 'react';
import { motion } from 'framer-motion';
import { QrCode as QrCodeIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UpiPaymentFormProps {
  upiId: string;
  onChange: (value: string) => void;
}

const UpiPaymentForm: React.FC<UpiPaymentFormProps> = ({ upiId, onChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 mb-6"
    >
      <div className="space-y-2">
        <Label htmlFor="upiId">UPI ID</Label>
        <div className="relative">
          <QrCodeIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="upiId"
            placeholder="yourname@bankupi"
            className="pl-10"
            value={upiId}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground">Enter your UPI ID to make the payment</p>
      </div>
    </motion.div>
  );
};

export default UpiPaymentForm;
