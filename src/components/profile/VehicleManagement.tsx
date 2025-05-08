import React, { useState, useEffect } from 'react';
import { Car, Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getUserVehicles, addVehicle, deleteVehicle } from '@/services/vehicleService';
import { Skeleton } from '@/components/ui/skeleton';
import { Vehicle } from '@/types/parking';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  model: z.string().min(1, { message: 'Vehicle model is required' }),
  registration_number: z.string().min(1, { message: 'Registration number is required' }),
  vehicle_type: z.string().min(1, { message: 'Vehicle type is required' }),
  document_url: z.string().optional(),
});

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: '',
      registration_number: '',
      vehicle_type: 'Car',
      document_url: '',
    },
  });

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setIsLoading(true);
        const userVehicles = await getUserVehicles();
        setVehicles(userVehicles);
      } catch (error) {
        console.error('Failed to load vehicles:', error);
        toast({
          title: 'Error loading vehicles',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      loadVehicles();
    }
  }, [user, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!user) return;
      
      const newVehicle: Omit<Vehicle, 'id'> = {
        user_id: user.id,
        model: values.model,
        registration_number: values.registration_number,
        vehicle_type: values.vehicle_type,
        document_url: values.document_url,
      };
      
      await addVehicle(newVehicle);
      
      setIsAddDialogOpen(false);
      form.reset();
      
      // Refresh the list
      const userVehicles = await getUserVehicles();
      setVehicles(userVehicles);
      
      toast({
        title: 'Vehicle added',
        description: 'Your vehicle has been successfully added',
      });
    } catch (error) {
      console.error('Failed to add vehicle:', error);
      toast({
        title: 'Error adding vehicle',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVehicle(id);
      
      // Refresh the list
      const userVehicles = await getUserVehicles();
      setVehicles(userVehicles);
      
      toast({
        title: 'Vehicle removed',
        description: 'Your vehicle has been successfully removed',
      });
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
      toast({
        title: 'Error removing vehicle',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Car className="h-5 w-5" />
          Your Vehicles
        </CardTitle>
        <CardDescription>
          Manage your vehicles for easy access during booking
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">You don't have any vehicles added yet</p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Vehicle</DialogTitle>
                  <DialogDescription>
                    Add a new vehicle to your profile
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="vehicle_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select vehicle type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Car">Car</SelectItem>
                              <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                              <SelectItem value="SUV">SUV</SelectItem>
                              <SelectItem value="Van">Van</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Model</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Honda Civic" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="registration_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. KA01AB1234" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="document_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload RC Document (Optional)</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input 
                                {...field}
                                type="text"
                                placeholder="Document URL"
                                className="flex-1"
                              />
                              <Button type="button" variant="outline" size="icon">
                                <Upload className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Upload your vehicle registration document
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save Vehicle</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div>
                    <h4 className="font-medium">{vehicle.model}</h4>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.registration_number} • {vehicle.vehicle_type}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {vehicle.id && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(vehicle.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Vehicle</DialogTitle>
                  <DialogDescription>
                    Add a new vehicle to your profile
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="vehicle_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select vehicle type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Car">Car</SelectItem>
                              <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                              <SelectItem value="SUV">SUV</SelectItem>
                              <SelectItem value="Van">Van</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Model</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Honda Civic" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="registration_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. KA01AB1234" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="document_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload RC Document (Optional)</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input 
                                {...field}
                                type="text"
                                placeholder="Document URL"
                                className="flex-1"
                              />
                              <Button type="button" variant="outline" size="icon">
                                <Upload className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Upload your vehicle registration document
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save Vehicle</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Your vehicle information is used during parking bookings
        </p>
      </CardFooter>
    </Card>
  );
};

export default VehicleManagement;
