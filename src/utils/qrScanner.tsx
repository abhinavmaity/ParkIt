
import React, { useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QrScannerProps {
  onScan: (data: string) => Promise<void>;
  className?: string;
  fps?: number;
  qrbox?: number;
}

export const QrScanner: React.FC<QrScannerProps> = ({ 
  onScan, 
  className = '', 
  fps = 10, 
  qrbox = 250 
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const qrScannerId = `qr-scanner-${Date.now()}`;
    containerRef.current.innerHTML = `<div id="${qrScannerId}" style="width: 100%; height: 100%;"></div>`;
    
    const html5QrCode = new Html5Qrcode(qrScannerId);
    scannerRef.current = html5QrCode;

    const config = {
      fps,
      qrbox: { width: qrbox, height: qrbox },
      aspectRatio: 1,
    };

    html5QrCode.start(
      { facingMode: "environment" },
      config,
      async (decodedText) => {
        try {
          // Pause scanning while processing
          await html5QrCode.pause();
          // Process the QR code
          await onScan(decodedText);
          // Stop scanning after successful scan
          html5QrCode.stop();
        } catch (error) {
          console.error('Error processing QR code:', error);
          // Resume scanning if there was an error
          html5QrCode.resume();
        }
      },
      (errorMessage) => {
        // QR code not detected error - these are fine and occur frequently while scanning
        if (!errorMessage.includes("No QR code found")) {
          console.error(`QR Code scanning error: ${errorMessage}`);
        }
      }
    ).catch(error => {
      console.error('Failed to start QR code scanner:', error);
    });

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(error => {
          console.error('Failed to stop QR code scanner:', error);
        });
      }
    };
  }, [onScan, fps, qrbox]);

  return <div ref={containerRef} className={className}></div>;
};
