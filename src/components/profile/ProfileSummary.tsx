
import React from 'react';
import { User } from 'lucide-react';

interface ProfileSummaryProps {
  userData: {
    name: string;
    email: string;
  };
}

export const ProfileSummary = ({ userData }: ProfileSummaryProps) => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
      <div className="flex items-center justify-center mb-6">
        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="h-12 w-12 text-primary" />
        </div>
      </div>
      
      <div className="text-center mb-6">
        <h3 className="font-semibold text-xl">{userData.name || 'User'}</h3>
        <p className="text-muted-foreground">{userData.email}</p>
      </div>
      
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <span>Member since </span>
          <span className="text-foreground font-medium">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          <span>Bookings completed: </span>
          <span className="text-foreground font-medium">0</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary;
