
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { SectionTitle } from '@/components/ui/section-title';
import ScannerInterface from '@/components/security/ScannerInterface';
import BookingDetails from '@/components/security/BookingDetails';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchBookingById, updateBookingStatus } from '@/services/bookingService';
import { logEntryExit } from '@/services/securityService';
import { useToast } from '@/components/ui/use-toast';
import { BookingDetails as BookingDetailsType } from '@/types/parking';
import ViolationReport from '@/components/security/ViolationReport';

const SecurityScannerPage = () => {
  const [scanning, setScanning] = useState(true);
  const [booking, setBooking] = useState<BookingDetailsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'invalid'>('idle');
  const [activeTab, setActiveTab] = useState('scanner');
  const { toast } = useToast();

  const handleScan = async (data: string) => {
    if (data) {
      try {
        setLoading(true);
        setScanning(false);
        
        // Parse QR data
        const parsedData = JSON.parse(data);
        
        if (!parsedData.id) {
          throw new Error('Invalid QR code format');
        }
        
        // Fetch booking details
        const bookingData = await fetchBookingById(parsedData.id);
        setBooking(bookingData);
        setScanState('success');
        
      } catch (error) {
        console.error('Error scanning QR code:', error);
        setScanState('invalid');
        toast({
          title: 'Scan Failed',
          description: error instanceof Error ? error.message : 'Failed to process the QR code',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStartScan = () => {
    setScanState('scanning');
  };

  const handleVerify = async (approved: boolean, isExit: boolean = false) => {
    if (!booking) return;
    
    try {
      setLoading(true);
      
      if (approved) {
        // Update booking status
        const newStatus = isExit ? 'completed' : 'checked_in';
        await updateBookingStatus(booking.id, newStatus);
        
        // Log the entry or exit
        await logEntryExit({
          bookingId: booking.id,
          spotNumber: booking.spot_number || '',
          action: isExit ? 'exit' : 'entry',
          timestamp: new Date().toISOString()
        });
        
        toast({
          title: isExit ? 'Check-out Successful' : 'Check-in Successful',
          description: `Booking #${booking.id.substring(0, 8)} has been ${isExit ? 'checked out' : 'checked in'}.`
        });
      } else {
        toast({
          title: isExit ? 'Exit Denied' : 'Entry Denied',
          description: 'The booking was rejected.'
        });
      }
      
      resetScan();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update booking status.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setScanning(true);
    setBooking(null);
    setScanState('idle');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <SectionTitle 
          title="Security Portal"
          description="Scan QR codes, log entries/exits, and report violations"
        />

        <Tabs defaultValue="scanner" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
            <TabsTrigger value="violation">Report Violation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scanner">
            <Card className="max-w-md mx-auto p-6">
              {scanning ? (
                <ScannerInterface 
                  scanState={scanState}
                  handleStartScan={handleStartScan}
                  resetScan={resetScan}
                  onScan={handleScan}
                />
              ) : (
                <BookingDetails 
                  bookingData={booking}
                  onVerify={handleVerify}
                  onReset={resetScan}
                  loading={loading}
                  showExitOption={true}
                />
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="violation">
            <ViolationReport />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SecurityScannerPage;
