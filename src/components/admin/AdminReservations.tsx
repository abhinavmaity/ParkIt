
import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Calendar, Check, Filter, MoreHorizontal, Search, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import { Booking } from '@/types/transaction';

const AdminReservations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { toast } = useToast();

  // Mock data for bookings - This would come from your database
  const bookings: Booking[] = [
    {
      id: 'BK-1001',
      userId: 'USR-001',
      spotId: 'SPOT-001',
      spotNumber: 'A12',
      date: new Date(2023, 9, 15),
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      paymentStatus: 'paid',
      amount: 30,
      createdAt: new Date(2023, 9, 14),
    },
    {
      id: 'BK-1002',
      userId: 'USR-002',
      spotId: 'SPOT-002',
      spotNumber: 'A8',
      date: new Date(2023, 9, 16),
      startTime: '10:00 AM',
      endTime: '4:00 PM',
      paymentStatus: 'paid',
      amount: 25,
      createdAt: new Date(2023, 9, 15),
    },
    {
      id: 'BK-1003',
      userId: 'USR-003',
      spotId: 'SPOT-003',
      spotNumber: 'B15',
      date: new Date(2023, 9, 18),
      startTime: '9:00 AM',
      endTime: '3:00 PM',
      paymentStatus: 'pending',
      amount: 20,
      createdAt: new Date(2023, 9, 16),
    },
    {
      id: 'BK-1004',
      userId: 'USR-001',
      spotId: 'SPOT-004',
      spotNumber: 'C5',
      date: new Date(2023, 9, 20),
      startTime: '11:00 AM',
      endTime: '6:00 PM',
      paymentStatus: 'failed',
      amount: 35,
      createdAt: new Date(2023, 9, 18),
    },
  ];

  const filteredBookings = bookings.filter(booking => 
    booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.spotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCancelBooking = () => {
    if (!selectedBooking) return;
    
    // In a real app, this would make an API call to cancel the booking
    toast({
      title: 'Booking Cancelled',
      description: `Booking ${selectedBooking.id} has been cancelled successfully.`,
    });
    
    setShowCancelDialog(false);
    setSelectedBooking(null);
  };

  const openCancelDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
          <h2 className="text-xl font-semibold">All Reservations</h2>
          <div className="flex space-x-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings"
                className="pl-9 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Spot</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.userId}</TableCell>
                    <TableCell>{booking.spotNumber}</TableCell>
                    <TableCell>{format(booking.date, 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{`${booking.startTime} - ${booking.endTime}`}</TableCell>
                    <TableCell>₹{booking.amount}</TableCell>
                    <TableCell>{getStatusBadge(booking.paymentStatus)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => {
                              toast({
                                title: "View Details",
                                description: `Viewing details for booking ${booking.id}`,
                              });
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => openCancelDialog(booking)}
                            className="text-red-600"
                          >
                            Cancel Booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No reservations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to cancel booking {selectedBooking?.id}? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              No, Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Yes, Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminReservations;
