
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PaymentMethodOptionProps {
  value: 'upi' | 'card';
  label: string;
  icon: React.ElementType;
  selectedMethod: 'upi' | 'card';
  onSelect: (method: 'upi' | 'card') => void;
}

const PaymentMethodOption: React.FC<PaymentMethodOptionProps> = ({ 
  value, 
  label, 
  icon: Icon,
  selectedMethod,
  onSelect
}) => (
  <div
    className={cn(
      "flex items-center p-4 border rounded-lg cursor-pointer transition-colors",
      selectedMethod === value 
        ? "border-primary bg-primary/5" 
        : "border-border hover:border-primary/50"
    )}
    onClick={() => onSelect(value)}
  >
    <div className={cn(
      "w-10 h-10 rounded-full flex items-center justify-center mr-3",
      selectedMethod === value ? "bg-primary/10" : "bg-accent"
    )}>
      <Icon 
        size={20} 
        className={selectedMethod === value ? "text-primary" : "text-muted-foreground"} 
      />
    </div>
    <span className={selectedMethod === value ? "font-medium" : "text-muted-foreground"}>
      {label}
    </span>
    
    {selectedMethod === value && (
      <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="w-2 h-2 bg-white rounded-full"
        />
      </div>
    )}
  </div>
);

export default PaymentMethodOption;
