
import React from 'react';
import { BookingSummary, ParkingSpot, Transaction } from '@/types/parking';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminPanelProps {
  bookingSummary: BookingSummary | undefined;
  parkingSpots: ParkingSpot[] | undefined;
  transactions: Transaction[] | undefined;
  isLoading: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  bookingSummary,
  parkingSpots,
  transactions,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {bookingSummary && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Bookings:</span>
                <span className="font-bold">{bookingSummary.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Bookings:</span>
                <span className="font-bold">{bookingSummary.active}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span className="font-bold">{bookingSummary.completed}</span>
              </div>
              <div className="flex justify-between">
                <span>Cancelled:</span>
                <span className="font-bold">{bookingSummary.cancelled}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Total Revenue:</span>
                <span className="font-bold">₹{bookingSummary.revenue}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Parking Spots</CardTitle>
        </CardHeader>
        <CardContent>
          {parkingSpots && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Spots:</span>
                <span className="font-bold">{parkingSpots.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Available:</span>
                <span className="font-bold">
                  {parkingSpots.filter(spot => spot.status === 'available').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Booked:</span>
                <span className="font-bold">
                  {parkingSpots.filter(spot => spot.status === 'booked').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Maintenance:</span>
                <span className="font-bold">
                  {parkingSpots.filter(spot => spot.status === 'maintenance').length}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions && transactions.length > 0 ? (
            <div className="space-y-2 max-h-[200px] overflow-auto">
              {transactions.slice(0, 5).map(transaction => (
                <div key={transaction.id} className="flex justify-between text-sm">
                  <span className="truncate">#{transaction.transaction_id.substring(0, 8)}</span>
                  <span className={transaction.status === 'completed' ? 'text-green-600' : 'text-red-600'}>
                    ₹{transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No transactions found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
