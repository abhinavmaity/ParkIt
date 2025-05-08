
export interface ParkingSpot {
  id: string;
  spot_number: string;
  location: string;
  type: string;
  hourly_rate: number;
  status: 'available' | 'booked' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface SpotAvailability {
  id: string;
  spot_number: string;
  isAvailable: boolean;
  hourly_rate: number;
  type?: string;
  location?: string;
}

export interface BookingRequest {
  user_id: string;
  spot_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  amount: number;
  status?: 'booked' | 'checked_in' | 'completed' | 'cancelled';
  payment_status?: 'pending' | 'paid' | 'failed';
}

export interface BookingDetails {
  id: string;
  user_id: string;
  spot_id: string;
  spot_number: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  amount: number;
  status: 'booked' | 'checked_in' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
  updated_at: string;
  qr_code?: string;
  transaction_id?: string;
  parking_spots?: {
    spot_number: string;
    location: string;
    type: string;
  };
}

export interface BookingSummary {
  total: number;
  completed: number;
  active: number;
  cancelled: number;
  revenue: number;
}

export interface PaymentMethod {
  id?: string;
  user_id: string;
  payment_type: string;
  card_network?: string;
  card_last_four?: string;
  nickname?: string;
  expiry_date?: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Vehicle {
  id?: string;
  user_id: string;
  model: string;
  registration_number: string;
  vehicle_type: string;
  document_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  booking_id?: string;
  amount: number;
  payment_method: string;
  transaction_id: string;
  status: string;
  created_at: string;
}
