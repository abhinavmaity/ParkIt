
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateTimeSelectorProps {
  date: Date;
  onDateSelect: (date: Date | undefined) => void;
  startTime: string;
  endTime: string;
  onTimeChange: (startTime: string, endTime: string) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  date,
  onDateSelect,
  startTime,
  endTime,
  onTimeChange,
}) => {
  const availableStartTimes = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];
  const availableEndTimes = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  
  const handleStartTimeSelect = (time: string) => {
    // Make sure end time is after start time
    const startHour = parseInt(time.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    
    let newEndTime = endTime;
    if (startHour >= endHour) {
      // If start time is later than or equal to end time, set end time to start time + 1 hour
      newEndTime = `${startHour + 1}:00`;
    }
    
    onTimeChange(time, newEndTime);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-auto justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">{date ? format(date, "PPP") : "Pick a date"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateSelect}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-auto justify-start text-left font-normal"
          >
            <Clock className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">Start: {startTime}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3" align="start">
          <div className="space-y-1">
            {availableStartTimes.map((time) => (
              <div 
                key={time}
                className={`cursor-pointer py-1.5 px-3 rounded-md text-sm ${
                  startTime === time ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
                onClick={() => handleStartTimeSelect(time)}
              >
                {time}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-auto justify-start text-left font-normal"
          >
            <Clock className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">End: {endTime}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3" align="start">
          <div className="space-y-1">
            {availableEndTimes
              .filter(time => {
                // Only show end times that are after the selected start time
                const startHour = parseInt(startTime.split(':')[0]);
                const endHour = parseInt(time.split(':')[0]);
                return endHour > startHour;
              })
              .map((time) => (
                <div 
                  key={time}
                  className={`cursor-pointer py-1.5 px-3 rounded-md text-sm ${
                    endTime === time ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                  }`}
                  onClick={() => onTimeChange(startTime, time)}
                >
                  {time}
                </div>
              ))
            }
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateTimeSelector;
