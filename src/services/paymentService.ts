import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/parking';
import { generateRandom } from '@/utils/validation';

interface PaymentDetails {
  userId: string;
  bookingId: string;
  amount: number;
  paymentMethod: string;
}

export const initiatePayment = async (
  details: PaymentDetails
): Promise<{ success: boolean; transactionId?: string; message?: string }> => {
  try {
    console.log('Initiating payment:', details);
    
    // In a real application, this would call a payment gateway API
    // For the demo, we'll simulate a successful payment
    
    // Generate a mock transaction ID
    const transactionId = `TXN${generateRandom(12)}`;
    
    // Create a transaction record
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: details.userId,
        booking_id: details.bookingId,
        amount: details.amount,
        payment_method: details.paymentMethod,
        transaction_id: transactionId,
        status: 'completed'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating transaction record:', error);
      return { 
        success: false, 
        message: 'Failed to process payment. Please try again.' 
      };
    }
    
    console.log('Payment processed successfully:', data);
    
    // Update booking payment status
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ 
        payment_status: 'paid',
        transaction_id: transactionId
      })
      .eq('id', details.bookingId);
    
    if (bookingError) {
      console.error('Error updating booking payment status:', bookingError);
    }
    
    return {
      success: true,
      transactionId: transactionId
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred during payment processing.'
    };
  }
};

export const processCardPayment = async (
  details: PaymentDetails,
  cardDetails: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
  }
): Promise<{ success: boolean; transactionId?: string; message?: string }> => {
  try {
    console.log('Processing card payment:', { details, cardDetails });
    
    // In a real application, this would validate the card details and call a payment gateway API
    // For the demo, we'll simulate a successful payment
    
    // Validate card details (basic validation for demo)
    if (!cardDetails.cardNumber || cardDetails.cardNumber.length < 13) {
      return { 
        success: false, 
        message: 'Invalid card number.' 
      };
    }
    
    // Generate a mock transaction ID
    const transactionId = `CARD${generateRandom(12)}`;
    
    // Create a transaction record
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: details.userId,
        booking_id: details.bookingId,
        amount: details.amount,
        payment_method: 'card',
        transaction_id: transactionId,
        status: 'completed'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating transaction record:', error);
      return { 
        success: false, 
        message: 'Failed to process card payment. Please try again.' 
      };
    }
    
    console.log('Card payment processed successfully:', data);
    
    // Update booking payment status
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ 
        payment_status: 'paid',
        transaction_id: transactionId
      })
      .eq('id', details.bookingId);
    
    if (bookingError) {
      console.error('Error updating booking payment status:', bookingError);
    }
    
    return {
      success: true,
      transactionId: transactionId
    };
  } catch (error) {
    console.error('Card payment processing error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred during card payment processing.'
    };
  }
};

export const processUpiPayment = async (
  details: PaymentDetails,
  upiId: string
): Promise<{ success: boolean; transactionId?: string; qrCode?: string; message?: string }> => {
  try {
    console.log('Processing UPI payment:', { details, upiId });
    
    // In a real application, this would generate a UPI payment link and QR code
    // For the demo, we'll simulate a successful payment
    
    // Validate UPI ID (basic validation for demo)
    if (!upiId || !upiId.includes('@')) {
      return { 
        success: false, 
        message: 'Invalid UPI ID.' 
      };
    }
    
    // Generate a mock transaction ID and QR code
    const transactionId = `UPI${generateRandom(12)}`;
    const qrCode = `upi://pay?pa=${upiId}&pn=ParkIt&am=${details.amount}&cu=INR&tn=Booking-${details.bookingId}`;
    
    // Create a transaction record
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: details.userId,
        booking_id: details.bookingId,
        amount: details.amount,
        payment_method: 'upi',
        transaction_id: transactionId,
        status: 'completed'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating transaction record:', error);
      return { 
        success: false, 
        message: 'Failed to process UPI payment. Please try again.' 
      };
    }
    
    console.log('UPI payment processed successfully:', data);
    
    // Update booking payment status
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ 
        payment_status: 'paid',
        transaction_id: transactionId
      })
      .eq('id', details.bookingId);
    
    if (bookingError) {
      console.error('Error updating booking payment status:', bookingError);
    }
    
    return {
      success: true,
      transactionId: transactionId,
      qrCode: qrCode
    };
  } catch (error) {
    console.error('UPI payment processing error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred during UPI payment processing.'
    };
  }
};

/**
 * Process payment using the specified method
 */
export const processPayment = async (
  userId: string,
  bookingId: string,
  amount: number,
  paymentMethod: string
): Promise<string> => {
  try {
    // Generate a mock transaction ID
    const transactionId = `${paymentMethod.toUpperCase()}${generateRandom(12)}`;
    
    // Create a transaction record
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        booking_id: bookingId,
        amount: amount,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        status: 'completed'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating transaction record:', error);
      throw new Error('Failed to process payment');
    }
    
    // Update booking payment status
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ 
        payment_status: 'paid',
        transaction_id: transactionId
      })
      .eq('id', bookingId);
    
    if (bookingError) {
      console.error('Error updating booking payment status:', bookingError);
    }
    
    return transactionId;
  } catch (error) {
    console.error('Payment processing error:', error);
    throw new Error('Payment processing failed');
  }
};

export const verifyPayment = async (transactionId: string): Promise<boolean> => {
  try {
    // In a real application, this would verify the payment status with a payment gateway
    // For the demo, we'll just check if the transaction exists in our database
    
    const { data, error } = await supabase
      .rpc('is_transaction_valid', { transaction_id: transactionId });
    
    if (error) {
      console.error('Error verifying transaction:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};

export const fetchTransactionById = async (transactionId: string) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();
    
    if (error) {
      console.error(`Error fetching transaction ${transactionId}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchTransactionById:', error);
    throw error;
  }
};

/**
 * Get all transactions
 */
export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAllTransactions:', error);
    throw error;
  }
};
