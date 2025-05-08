
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DateTimeSelector from './DateTimeSelector';
import ParkingLayout from './ParkingLayout';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface ParkingSpot {
  id: string;
  number: string;
  isAvailable: boolean;
  type?: string;
  hourlyRate?: number;
  location?: string;
}

interface SelectSpotSectionProps {
  date: Date;
  onDateSelect: (date: Date | undefined) => void;
  parkingSpots: ParkingSpot[];
  selectedSpotId: string | undefined;
  onSelectSpot: (id: string) => void;
  loading?: boolean;
  startTime: string;
  endTime: string;
  onTimeChange: (startTime: string, endTime: string) => void;
}

const SelectSpotSection: React.FC<SelectSpotSectionProps> = ({
  date,
  onDateSelect,
  parkingSpots,
  selectedSpotId,
  onSelectSpot,
  loading = false,
  startTime,
  endTime,
  onTimeChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);
  
  // Get unique spot types for filtering
  const spotTypes = [...new Set(parkingSpots.map(spot => spot.type))].filter(Boolean) as string[];
  
  // Filter the parking spots based on search query and filters
  const filteredSpots = parkingSpots.filter(spot => {
    const matchesSearch = spot.number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAvailability = filterAvailableOnly ? spot.isAvailable : true;
    const matchesType = filterType ? spot.type === filterType : true;
    
    return matchesSearch && matchesAvailability && matchesType;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-6">
        <div className="space-y-1">
          <h3 className="text-lg md:text-xl font-medium">Select Date & Time</h3>
          <p className="text-sm text-muted-foreground">Choose when you'll need parking</p>
        </div>
        <div className="w-full md:w-auto">
          <DateTimeSelector 
            date={date} 
            onDateSelect={onDateSelect}
            startTime={startTime}
            endTime={endTime}
            onTimeChange={onTimeChange}
          />
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-medium mb-1">Select Parking Spot</h3>
            <p className="text-sm text-muted-foreground">Click on an available spot to select it</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:max-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search spot number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Filter Options</h4>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="available-only" className="text-sm">Show available spots only</Label>
                    <Switch 
                      id="available-only" 
                      checked={filterAvailableOnly}
                      onCheckedChange={setFilterAvailableOnly}
                    />
                  </div>
                  
                  {spotTypes.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm">Spot Type</Label>
                      <div className="flex flex-wrap gap-2">
                        <Badge 
                          onClick={() => setFilterType(null)} 
                          className={`cursor-pointer ${!filterType ? 'bg-primary' : 'bg-secondary'}`}
                        >
                          All
                        </Badge>
                        {spotTypes.map(type => (
                          <Badge 
                            key={type} 
                            onClick={() => setFilterType(type === filterType ? null : type)} 
                            className={`cursor-pointer ${filterType === type ? 'bg-primary' : 'bg-secondary'}`}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="w-full overflow-x-auto pb-4">
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 md:gap-6">
              {[...Array(10)].map((_, index) => (
                <Skeleton key={index} className="h-24 w-24 rounded-lg" />
              ))}
            </div>
          ) : (
            <ParkingLayout
              spots={filteredSpots}
              onSelectSpot={onSelectSpot}
              selectedSpotId={selectedSpotId}
            />
          )}
        </div>
        
        {!loading && filteredSpots.length === 0 && (
          <div className="text-center py-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground">No parking spots match your criteria</p>
            {searchQuery && (
              <Button 
                variant="link" 
                onClick={() => setSearchQuery('')}
                className="mt-2"
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SelectSpotSection;
