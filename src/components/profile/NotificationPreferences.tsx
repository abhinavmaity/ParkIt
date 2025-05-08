
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Bell } from 'lucide-react';

interface NotificationPreferencesProps {
  preferences: {
    bookingConfirmations?: boolean;
    bookingReminders?: boolean;
    parkingUpdates?: boolean;
    promotionalOffers?: boolean;
    bookingConfirmation?: boolean;
    parkingReminders?: boolean;
    securityAlerts?: boolean;
  };
  onPreferenceChange: (key: string) => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ 
  preferences, 
  onPreferenceChange 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Notification Preferences</CardTitle>
        <Bell className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="booking-confirmation" className="text-base">Booking Confirmations</Label>
            <p className="text-sm text-muted-foreground">Receive alerts when your booking is confirmed</p>
          </div>
          <Switch 
            id="booking-confirmation" 
            checked={preferences.bookingConfirmations || preferences.bookingConfirmation || false}
            onCheckedChange={() => onPreferenceChange(preferences.bookingConfirmations !== undefined ? 'bookingConfirmations' : 'bookingConfirmation')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="parking-reminders" className="text-base">Parking Reminders</Label>
            <p className="text-sm text-muted-foreground">Get notified before your parking expires</p>
          </div>
          <Switch 
            id="parking-reminders" 
            checked={preferences.bookingReminders || preferences.parkingReminders || false}
            onCheckedChange={() => onPreferenceChange(preferences.bookingReminders !== undefined ? 'bookingReminders' : 'parkingReminders')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="promo-offers" className="text-base">Promotional Offers</Label>
            <p className="text-sm text-muted-foreground">Receive special offers and discounts</p>
          </div>
          <Switch 
            id="promo-offers" 
            checked={preferences.promotionalOffers || false}
            onCheckedChange={() => onPreferenceChange('promotionalOffers')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="security-alerts" className="text-base">Security Alerts</Label>
            <p className="text-sm text-muted-foreground">Get notified about security events</p>
          </div>
          <Switch 
            id="security-alerts" 
            checked={preferences.securityAlerts || preferences.parkingUpdates || false}
            onCheckedChange={() => onPreferenceChange(preferences.securityAlerts !== undefined ? 'securityAlerts' : 'parkingUpdates')}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
