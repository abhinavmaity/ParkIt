
import React from 'react';
import { format } from 'date-fns';
import { Search, CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface BookingFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterDate: Date | undefined;
  setFilterDate: (date: Date | undefined) => void;
}

const BookingFilters: React.FC<BookingFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  filterDate,
  setFilterDate,
}) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search bookings"
          className="pl-9 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full sm:w-auto justify-start text-left font-normal",
              filterDate && "text-primary"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filterDate ? format(filterDate, "PPP") : <span>Filter by date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={filterDate}
            onSelect={(date) => setFilterDate(date)}
            initialFocus
            className="pointer-events-auto"
          />
          {filterDate && (
            <div className="p-3 border-t border-border">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full"
                onClick={() => setFilterDate(undefined)}
              >
                Clear Filter
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default BookingFilters;
