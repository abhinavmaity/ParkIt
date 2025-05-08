
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Bike } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface ParkingSpotProps {
  id: string;
  number: string;
  isAvailable: boolean;
  isSelected?: boolean;
  type?: string;
  hourlyRate?: number;
  onClick?: (id: string) => void;
}

export const ParkingSpot: React.FC<ParkingSpotProps> = ({
  id,
  number,
  isAvailable,
  isSelected = false,
  type = 'standard',
  hourlyRate = 30,
  onClick,
}) => {
  const handleClick = () => {
    if (isAvailable && onClick) {
      onClick(id);
    }
  };

  // Helper function for type color
  const getTypeColor = () => {
    switch(type) {
      case 'premium':
        return 'bg-amber-100 text-amber-800';
      case 'reserved':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  console.log(`Rendering ParkingSpot ${number} - Available: ${isAvailable}, Selected: ${isSelected}`);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }}
      whileHover={isAvailable ? { scale: 1.05 } : {}}
      whileTap={isAvailable ? { scale: 0.95 } : {}}
      className={cn(
        "flex flex-col items-center justify-center w-24 h-24 rounded-lg border-2 shadow-sm relative",
        isAvailable 
          ? isSelected 
            ? "border-primary bg-primary/10 cursor-pointer" 
            : "border-border bg-card hover:border-primary/50 cursor-pointer" 
          : "border-muted bg-muted cursor-not-allowed",
      )}
      onClick={handleClick}
    >
      <span className={cn(
        "absolute top-2 left-2 text-xs font-semibold",
        isAvailable 
          ? isSelected 
            ? "text-primary" 
            : "text-foreground" 
          : "text-muted-foreground"
      )}>
        {number}
      </span>
      
      <Badge 
        className={cn(
          "absolute top-2 right-2 text-[10px] py-0 px-1", 
          getTypeColor()
        )}
      >
        {hourlyRate}₹
      </Badge>
      
      <Bike 
        size={40} 
        className={cn(
          isAvailable 
            ? isSelected 
              ? "text-primary" 
              : "text-foreground" 
            : "text-muted-foreground"
        )} 
      />
      
      <span className={cn(
        "text-xs mt-2 font-medium",
        isAvailable 
          ? isSelected 
            ? "text-primary" 
            : "text-foreground" 
          : "text-muted-foreground"
      )}>
        {isAvailable ? 'Available' : 'Taken'}
      </span>
    </motion.div>
  );
};

export default ParkingSpot;
