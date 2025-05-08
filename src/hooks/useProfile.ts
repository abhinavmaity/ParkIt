
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { UserProfile } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

export const useProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data including role
  const fetchProfile = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      if (data) {
        // Cast the data to UserProfile type with default role if not present
        const userProfile: UserProfile = {
          id: data.id,
          full_name: data.full_name || '',
          phone: data.phone || undefined,
          role: (data.role as UserProfile['role']) || 'user',
          updated_at: data.updated_at,
          created_at: data.created_at
        };
        setProfile(userProfile);
        return userProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [userId]);

  return { profile, loading, fetchProfile };
};
