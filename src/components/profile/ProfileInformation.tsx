
import React, { useState } from 'react';
import { User, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileInformationProps {
  userData: {
    name: string;
    email: string;
    phone: string;
  };
  setUserData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
  }>>;
}

export const ProfileInformation = ({ userData, setUserData }: ProfileInformationProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = async () => {
    if (isEditing && user) {
      // Save changes
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            full_name: formData.name,
            phone: formData.phone
          })
          .eq('id', user.id);
          
        if (error) throw error;
        
        setUserData(formData);
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });
      } catch (error: any) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Profile Information</h3>
        <Button 
          variant={isEditing ? "default" : "outline"} 
          size="sm"
          onClick={handleEditToggle}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              name="name"
              className="pl-10"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              className="pl-10"
              value={formData.email}
              onChange={handleChange}
              disabled={true} // Email is managed by auth, so keep it disabled
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              name="phone"
              className="pl-10"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation;
