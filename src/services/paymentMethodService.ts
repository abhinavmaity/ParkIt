
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod } from '@/types/parking';

/**
 * Get all payment methods for the current user
 */
export const getUserPaymentMethods = async (): Promise<PaymentMethod[]> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to fetch payment methods');
  }
  
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }

  return data || [];
};

/**
 * Add a new payment method for the current user
 */
export const addPaymentMethod = async (paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to add a payment method');
  }
  
  // Add user_id if not provided
  const paymentMethodWithUserId = {
    ...paymentMethod,
    user_id: user.id
  };
  
  // If this payment method is set as default, unset any existing default
  if (paymentMethod.is_default) {
    await unsetDefaultPaymentMethods();
  }
  
  const { data, error } = await supabase
    .from('payment_methods')
    .insert(paymentMethodWithUserId)
    .select()
    .single();

  if (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }

  return data;
};

/**
 * Update an existing payment method
 */
export const updatePaymentMethod = async (id: string, paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod> => {
  // If this payment method is set as default, unset any existing default
  if (paymentMethod.is_default) {
    await unsetDefaultPaymentMethods();
  }
  
  const { data, error } = await supabase
    .from('payment_methods')
    .update(paymentMethod)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }

  return data;
};

/**
 * Delete a payment method
 */
export const deletePaymentMethod = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};

/**
 * Unset all default payment methods for the current user
 */
export const unsetDefaultPaymentMethods = async (): Promise<void> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to update payment methods');
  }
  
  const { error } = await supabase
    .from('payment_methods')
    .update({ is_default: false })
    .eq('user_id', user.id)
    .eq('is_default', true);

  if (error) {
    console.error('Error unsetting default payment methods:', error);
    throw error;
  }
};

/**
 * Set a payment method as default
 */
export const setDefaultPaymentMethod = async (id: string): Promise<void> => {
  // First, unset all defaults
  await unsetDefaultPaymentMethods();
  
  // Then, set the new default
  const { error } = await supabase
    .from('payment_methods')
    .update({ is_default: true })
    .eq('id', id);

  if (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};
