
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { categories } from '@/data/events';
import { Calendar, Filter, MapPin, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';

interface EventFiltersProps {
  onApplyFilters: (filters: any) => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({ onApplyFilters }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleApplyFilters = () => {
    onApplyFilters({
      category: selectedCategory,
      priceRange,
      location,
      date
    });
    setIsFiltersOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setPriceRange([0, 500]);
    setLocation('');
    setDate(undefined);
    onApplyFilters({
      category: 'All',
      priceRange: [0, 500],
      location: '',
      date: undefined
    });
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            className={selectedCategory === category ? 'bg-event hover:bg-event-dark' : ''}
            onClick={() => {
              setSelectedCategory(category);
              onApplyFilters({
                category,
                priceRange,
                location,
                date
              });
            }}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Price Range</h4>
                <div className="px-2">
                  <Slider
                    defaultValue={priceRange}
                    max={500}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Location</h4>
                <div className="flex gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="City or venue"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Date</h4>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? date.toLocaleDateString() : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleResetFilters}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-event hover:bg-event-dark"
                  onClick={handleApplyFilters}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {(selectedCategory !== 'All' || location || date || priceRange[0] > 0 || priceRange[1] < 500) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-muted-foreground"
          >
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventFilters;
