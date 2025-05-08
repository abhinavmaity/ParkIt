
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name: string;
  phone?: string;
  role: 'admin' | 'security' | 'user';
  updated_at?: string;
  created_at?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string, loginType?: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { full_name: string; phone: string }) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  isSecurity: () => boolean;
}
