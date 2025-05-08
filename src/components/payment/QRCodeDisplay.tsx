
import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Check, Clock, Shield } from 'lucide-react';

interface QRCodeDisplayProps {
  bookingId: string;
  status: 'pending' | 'confirmed';
  expiryTime?: string;
  qrData?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ 
  bookingId, 
  status, 
  expiryTime,
  qrData
}) => {
  // In a real app, you would use a QR code library to generate the QR code
  // This is a simplified mock implementation
  const encodeData = () => {
    if (qrData) {
      return JSON.parse(qrData);
    }
    
    // Fallback mock data
    return {
      id: bookingId,
      timestamp: new Date().toISOString(),
      signature: 'mock-signature-for-security'
    };
  };

  // Generate a mock QR code pattern (in a real app, you'd use a library like qrcode.react)
  const generateMockQRPattern = () => {
    const pattern = [];
    // Create a 10x10 grid of squares that will form our mock QR code
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        // Deterministic but seemingly random pattern based on booking ID
        const hash = (bookingId.charCodeAt(i % bookingId.length) + 
                     bookingId.charCodeAt(j % bookingId.length)) % 100;
        const isCorner = (i < 2 && j < 2) || (i < 2 && j > 7) || (i > 7 && j < 2);
        const shouldFill = isCorner || hash > 40;
        
        if (shouldFill) {
          pattern.push(<rect key={`${i}-${j}`} x={i * 10} y={j * 10} width="8" height="8" fill="currentColor" />);
        }
      }
    }
    
    // Add the position detection patterns (the three squares in the corners)
    pattern.push(
      <g key="position-patterns">
        {/* Top-left position pattern */}
        <rect x="0" y="0" width="30" height="30" fill="currentColor" />
        <rect x="5" y="5" width="20" height="20" fill="white" />
        <rect x="10" y="10" width="10" height="10" fill="currentColor" />
        
        {/* Top-right position pattern */}
        <rect x="70" y="0" width="30" height="30" fill="currentColor" />
        <rect x="75" y="5" width="20" height="20" fill="white" />
        <rect x="80" y="10" width="10" height="10" fill="currentColor" />
        
        {/* Bottom-left position pattern */}
        <rect x="0" y="70" width="30" height="30" fill="currentColor" />
        <rect x="5" y="75" width="20" height="20" fill="white" />
        <rect x="10" y="80" width="10" height="10" fill="currentColor" />
      </g>
    );
    
    return pattern;
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md"
    >
      <div className={`relative p-4 ${status === 'confirmed' ? 'bg-primary/10' : 'bg-muted'} rounded-lg`}>
        <svg 
          width="150" 
          height="150" 
          viewBox="0 0 100 100" 
          className={status === 'confirmed' ? 'text-primary' : 'text-muted-foreground'}
        >
          {generateMockQRPattern()}
        </svg>
        
        <div className="absolute -top-2 -right-2">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        
        {status === 'pending' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Clock size={40} className="text-primary" />
            </motion.div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center mb-2">
          {status === 'confirmed' ? (
            <div className="flex items-center text-green-600 bg-green-100 px-3 py-1 rounded-full">
              <Check size={16} className="mr-1" />
              <span className="text-sm font-medium">Confirmed</span>
            </div>
          ) : (
            <div className="flex items-center text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
              <Clock size={16} className="mr-1" />
              <span className="text-sm font-medium">Pending</span>
            </div>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground mb-1">Booking ID: {bookingId.substring(0, 8).toUpperCase()}</p>
        
        {expiryTime && (
          <p className="text-xs text-muted-foreground">Valid until: {expiryTime}</p>
        )}
      </div>
    </motion.div>
  );
};

export default QRCodeDisplay;
