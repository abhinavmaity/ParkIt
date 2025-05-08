
export interface Profile {
  id: string;
  full_name: string;
  phone?: string;
  role?: 'admin' | 'security' | 'user';
  updated_at: string;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  spot_id: string;
  spot_number: string;
  date: Date;
  start_time: string;
  end_time: string;
  payment_status: 'paid' | 'pending' | 'failed';
  amount: number;
  transaction_id?: string;
  qr_code?: string;
  status: 'booked' | 'checked_in' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  booking_id?: string;
  amount: number;
  payment_method: 'upi' | 'card';
  transaction_id: string;
  status: 'completed' | 'failed' | 'pending';
  created_at: string;
}
