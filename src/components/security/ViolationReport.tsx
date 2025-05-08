
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { reportViolation } from '@/services/securityService';
import { AlertTriangle, Camera, FileSymlink, Upload } from 'lucide-react';

const ViolationReport = () => {
  const [loading, setLoading] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [violationType, setViolationType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const { toast } = useToast();
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vehicleNumber || !violationType || !location) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      await reportViolation({
        vehicleNumber,
        violationType,
        location,
        description,
        timestamp: new Date().toISOString(),
        imageFile
      });
      
      toast({
        title: "Violation Reported",
        description: "The violation has been successfully reported"
      });
      
      // Reset form
      setVehicleNumber('');
      setViolationType('');
      setLocation('');
      setDescription('');
      setImagePreview(null);
      setImageFile(null);
      
    } catch (error) {
      console.error('Error reporting violation:', error);
      toast({
        title: "Report Failed",
        description: "Failed to submit violation report",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
          Report Parking Violation
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleNumber">Vehicle Registration Number *</Label>
            <Input
              id="vehicleNumber"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="e.g. KA-01-AB-1234"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="violationType">Violation Type *</Label>
            <Select value={violationType} onValueChange={setViolationType} required>
              <SelectTrigger id="violationType">
                <SelectValue placeholder="Select violation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unauthorized_parking">Unauthorized Parking</SelectItem>
                <SelectItem value="expired_booking">Expired Booking</SelectItem>
                <SelectItem value="wrong_spot">Wrong Spot</SelectItem>
                <SelectItem value="blocking_exit">Blocking Exit</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Block A, Spot 12"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details about the violation"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Evidence Image</Label>
            <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-md border-muted-foreground/25">
              {imagePreview ? (
                <div className="relative w-full">
                  <img 
                    src={imagePreview}
                    alt="Violation evidence" 
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label htmlFor="image" className="flex flex-col items-center cursor-pointer p-4 w-full">
                  <Camera className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground mb-2">Click to upload an image</span>
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ViolationReport;
