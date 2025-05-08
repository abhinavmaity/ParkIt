
import React from 'react';
import { Link } from 'react-router-dom';
import { Bike } from 'lucide-react';
import { motion } from 'framer-motion';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Link to="/" className={`inline-flex items-center justify-center ${className || 'mb-4'}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-10 h-10 bg-primary rounded-md flex items-center justify-center"
      >
        <Bike className="text-primary-foreground" size={20} />
      </motion.div>
    </Link>
  );
};

export default Logo;
