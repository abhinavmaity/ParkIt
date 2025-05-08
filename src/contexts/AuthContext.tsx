
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import type { AuthContextType, UserProfile } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Use the custom hook to manage profile data
  const { profile, loading: profileLoading, fetchProfile } = useProfile(user?.id);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Fetch profile data when session changes is handled by useProfile hook
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, loginType: string = 'user') => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // After sign-in, fetch the profile to check roles
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData?.user) {
        const userProfile = await fetchProfile(userData.user.id);

        if (!userProfile) {
          throw new Error('Failed to fetch user profile');
        }

        // Redirect based on role and login type
        if (loginType === 'admin' && userProfile.role !== 'admin') {
          await signOut();
          throw new Error('You do not have admin privileges');
        } else if (loginType === 'security' && userProfile.role !== 'security') {
          await signOut();
          throw new Error('You do not have security privileges');
        } else if (loginType === 'user' && userProfile.role === 'admin') {
          navigate('/admin');
          toast({
            title: "Admin Login",
            description: "You've been redirected to the admin panel.",
          });
          return;
        } else if (loginType === 'user' && userProfile.role === 'security') {
          navigate('/security');
          toast({
            title: "Security Login",
            description: "You've been redirected to the security scanner.",
          });
          return;
        }

        // Redirect based on login type
        if (loginType === 'admin') {
          navigate('/admin');
        } else if (loginType === 'security') {
          navigate('/security');
        } else {
          navigate('/parking');
        }
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back to ParkIt.",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signUp = async (email: string, password: string, userData: { full_name: string; phone: string }) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: userData.full_name,
            phone: userData.phone
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: "Please check your email for the confirmation link.",
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isAdmin = () => {
    return profile?.role === 'admin';
  };

  const isSecurity = () => {
    return profile?.role === 'security';
  };

  const value = {
    user,
    session,
    profile,
    loading: loading || profileLoading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isSecurity,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
