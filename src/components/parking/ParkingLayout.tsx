
import React from 'react';
import { motion } from 'framer-motion';
import ParkingSpot, { ParkingSpotProps } from './ParkingSpot';

interface ParkingLayoutProps {
  spots: Omit<ParkingSpotProps, 'onClick'>[];
  onSelectSpot: (id: string) => void;
  selectedSpotId?: string;
}

const ParkingLayout: React.FC<ParkingLayoutProps> = ({
  spots,
  onSelectSpot,
  selectedSpotId,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto bg-card rounded-xl p-6 shadow-sm border border-border"
    >
      <div className="w-full bg-muted rounded-lg p-4 mb-6 text-center">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-medium text-muted-foreground"
        >
          ENTRANCE
        </motion.div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 md:gap-6">
        {spots.map((spot, index) => (
          <motion.div
            key={spot.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <ParkingSpot
              {...spot}
              isSelected={selectedSpotId === spot.id}
              onClick={onSelectSpot}
            />
          </motion.div>
        ))}
      </div>

      <div className="w-full bg-muted rounded-lg p-4 mt-6 text-center">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-medium text-muted-foreground"
        >
          EXIT
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ParkingLayout;
