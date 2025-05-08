
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '@/types/parking';

/**
 * Get all vehicles for the current user
 */
export const getUserVehicles = async (): Promise<Vehicle[]> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to fetch vehicles');
  }
  
  const { data, error } = await supabase
    .from('user_vehicles')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user vehicles:', error);
    throw error;
  }

  return data || [];
};

/**
 * Add a new vehicle for the current user
 */
export const addVehicle = async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to add a vehicle');
  }
  
  // Add user_id if not provided
  const vehicleWithUserId = {
    ...vehicle,
    user_id: user.id
  };
  
  const { data, error } = await supabase
    .from('user_vehicles')
    .insert(vehicleWithUserId)
    .select()
    .single();

  if (error) {
    console.error('Error adding vehicle:', error);
    throw error;
  }

  return data;
};

/**
 * Update an existing vehicle
 */
export const updateVehicle = async (id: string, vehicle: Partial<Vehicle>): Promise<Vehicle> => {
  const { data, error } = await supabase
    .from('user_vehicles')
    .update(vehicle)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }

  return data;
};

/**
 * Delete a vehicle
 */
export const deleteVehicle = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('user_vehicles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting vehicle:', error);
    throw error;
  }
};

/**
 * Upload vehicle document
 */
export const uploadVehicleDocument = async (file: File, vehicleId: string): Promise<string> => {
  const fileName = `${vehicleId}_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  
  const { data, error } = await supabase.storage
    .from('vehicles')
    .upload(fileName, file);
  
  if (error) {
    console.error('Error uploading vehicle document:', error);
    throw error;
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('vehicles')
    .getPublicUrl(fileName);
  
  return publicUrl;
};
