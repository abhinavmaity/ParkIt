
import { supabase } from '@/integrations/supabase/client';

export interface EntryExitLog {
  id?: string;
  bookingId: string;
  spotNumber: string;
  action: 'entry' | 'exit';
  timestamp: string;
}

export interface ViolationReport {
  id?: string;
  vehicleNumber: string;
  violationType: string;
  location: string;
  description?: string;
  timestamp: string;
  imageFile?: File | null;
  imageUrl?: string;
}

// Type assertion for security logs table
type SecurityLogRow = {
  id: string;
  booking_id: string | null;
  spot_number: string;
  action: string;
  timestamp: string;
  created_at: string;
}

// Type assertion for violation reports table
type ViolationReportRow = {
  id: string;
  vehicle_number: string;
  violation_type: string;
  location: string;
  description: string | null;
  timestamp: string;
  image_url: string | null;
  created_at: string;
}

export const logEntryExit = async (log: EntryExitLog): Promise<void> => {
  const { error } = await supabase
    .from('security_logs')
    .insert({
      booking_id: log.bookingId,
      spot_number: log.spotNumber,
      action: log.action,
      timestamp: log.timestamp
    }) as { error: any };
  
  if (error) {
    console.error('Error logging entry/exit:', error);
    throw error;
  }
};

export const reportViolation = async (violation: ViolationReport): Promise<void> => {
  let imageUrl = null;
  
  // Upload image if provided
  if (violation.imageFile) {
    const fileName = `violation_${Date.now()}_${violation.imageFile.name.replace(/\s+/g, '_')}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('violations')
      .upload(fileName, violation.imageFile);
    
    if (uploadError) {
      console.error('Error uploading violation image:', uploadError);
      // Continue without the image if upload fails
    } else if (uploadData) {
      // Get the public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('violations')
        .getPublicUrl(fileName);
      
      imageUrl = publicUrl;
    }
  }
  
  // Insert violation record
  const { error } = await supabase
    .from('violation_reports')
    .insert({
      vehicle_number: violation.vehicleNumber,
      violation_type: violation.violationType,
      location: violation.location,
      description: violation.description || null,
      timestamp: violation.timestamp,
      image_url: imageUrl
    }) as { error: any };
  
  if (error) {
    console.error('Error reporting violation:', error);
    throw error;
  }
};

export const getRecentSecurityLogs = async (limit: number = 50): Promise<EntryExitLog[]> => {
  const { data, error } = await supabase
    .from('security_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit) as { data: SecurityLogRow[] | null, error: any };
  
  if (error) {
    console.error('Error fetching security logs:', error);
    throw error;
  }
  
  return (data || []).map(log => ({
    id: log.id,
    bookingId: log.booking_id || '',
    spotNumber: log.spot_number,
    action: log.action as 'entry' | 'exit',
    timestamp: log.timestamp
  }));
};

export const getViolationReports = async (limit: number = 50): Promise<ViolationReport[]> => {
  const { data, error } = await supabase
    .from('violation_reports')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit) as { data: ViolationReportRow[] | null, error: any };
  
  if (error) {
    console.error('Error fetching violation reports:', error);
    throw error;
  }
  
  return (data || []).map(report => ({
    id: report.id,
    vehicleNumber: report.vehicle_number,
    violationType: report.violation_type,
    location: report.location,
    description: report.description || undefined,
    timestamp: report.timestamp,
    imageUrl: report.image_url || undefined
  }));
};
