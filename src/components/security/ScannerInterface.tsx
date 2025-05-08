
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScanLine, Check, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QrScanner } from '@/utils/qrScanner';

type ScanState = 'idle' | 'scanning' | 'success' | 'invalid';

interface ScannerInterfaceProps {
  scanState?: ScanState;
  handleStartScan?: () => void;
  resetScan?: () => void;
  onScan?: (data: string) => Promise<void>;
}

const ScannerInterface: React.FC<ScannerInterfaceProps> = ({
  scanState = 'idle',
  handleStartScan = () => {},
  resetScan = () => {},
  onScan = async () => {},
}) => {
  const [hasCamera, setHasCamera] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check for camera permission when in scanning state
    if (scanState === 'scanning') {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => setHasCamera(true))
        .catch(error => {
          console.error('Camera access error:', error);
          setHasCamera(false);
          setCameraError(error.message || 'Failed to access camera');
        });
    }
  }, [scanState]);

  return (
    <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden mb-6">
      <div className="p-6">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
            <ScanLine className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-center mb-4">
          {scanState === 'idle' && "Ready to Scan"}
          {scanState === 'scanning' && "Scanning..."}
          {scanState === 'success' && "Valid Booking"}
          {scanState === 'invalid' && "Invalid Booking"}
        </h3>
        
        <div className={`
          aspect-square max-w-xs mx-auto 
          rounded-lg border-2 border-dashed 
          flex items-center justify-center relative
          ${scanState === 'scanning' ? 'border-primary' : 
            scanState === 'success' ? 'border-green-500' : 
            scanState === 'invalid' ? 'border-red-500' : 
            'border-border'}
        `}>
          {scanState === 'idle' && (
            <div className="text-center p-6 text-muted-foreground">
              <Camera className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Tap the button below to start scanning</p>
            </div>
          )}
          
          {scanState === 'scanning' && (
            <>
              {hasCamera ? (
                <QrScanner 
                  onScan={onScan} 
                  className="w-full h-full absolute inset-0 object-cover rounded-lg"
                />
              ) : (
                <div className="text-center p-6 text-destructive">
                  <Camera className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Camera access denied. Please check your browser permissions.</p>
                  <p className="text-xs mt-2">{cameraError}</p>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [1, 0.6, 1]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5 
                  }}
                >
                  <ScanLine size={60} className="text-primary opacity-70" />
                </motion.div>
              </div>
            </>
          )}
          
          {scanState === 'success' && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-green-100 rounded-full p-4">
                <Check size={60} className="text-green-600" />
              </div>
            </motion.div>
          )}
          
          {scanState === 'invalid' && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-red-100 rounded-full p-4">
                <X size={60} className="text-red-600" />
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="mt-6">
          {scanState === 'idle' && (
            <Button 
              className="w-full" 
              onClick={handleStartScan}
            >
              Start Scanning
            </Button>
          )}
          
          {scanState === 'scanning' && (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={resetScan}
            >
              Cancel
            </Button>
          )}
          
          {(scanState === 'success' || scanState === 'invalid') && (
            <Button 
              className="w-full" 
              onClick={resetScan}
            >
              Scan New Code
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerInterface;
