
export interface Transaction {
  id: string;
  bookingId: string;
  amount: number;
  paymentMode: 'upi' | 'card';
  timestamp: Date;
  status: 'success' | 'failed' | 'pending';
}

export interface Booking {
  id: string;
  userId: string;
  spotId: string;
  spotNumber: string;
  date: Date;
  startTime: string;
  endTime: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  amount: number;
  transactionId?: string;
  qrCode?: string;
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  userId: string;
  type: 'Bike' | 'Car';
  registrationNumber: string;
  model: string;
  isDefault?: boolean;
}

export interface NotificationPreference {
  bookingConfirmations: boolean;
  bookingReminders: boolean;
  parkingUpdates: boolean;
  promotionalOffers: boolean;
  securityAlerts: boolean;
}
