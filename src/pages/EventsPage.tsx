
import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import EventCard from '@/components/events/EventCard';
import EventFilters from '@/components/events/EventFilters';
import { Grid3X3, List, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getEvents, EventData } from '@/services/eventService';
import { useQuery } from '@tanstack/react-query';
import { categories } from '@/data/events';

const EventsPage = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [events, setEvents] = useState<EventData[]>([]);
  const [activeFilters, setActiveFilters] = useState<{
    category: string;
    location: string;
    date?: Date;
    priceRange: number[];
    searchQuery?: string;
  }>({
    category: categoryParam || 'All',
    location: '',
    priceRange: [0, 500],
    searchQuery: searchQuery || ''
  });
  
  // Fetch events with React Query
  const { data: fetchedEvents, isLoading } = useQuery({
    queryKey: ['events', searchQuery],
    queryFn: () => getEvents(searchQuery || ''),
  });
  
  useEffect(() => {
    if (fetchedEvents) {
      let filteredEvents = [...fetchedEvents];
      
      // Apply category filter
      if (activeFilters.category !== 'All') {
        filteredEvents = filteredEvents.filter(
          (event) => event.category.toLowerCase() === activeFilters.category.toLowerCase()
        );
      }
      
      // Apply location filter
      if (activeFilters.location) {
        filteredEvents = filteredEvents.filter(
          (event) => event.location.toLowerCase().includes(activeFilters.location.toLowerCase())
        );
      }
      
      // Apply date filter
      if (activeFilters.date) {
        const filterDate = new Date(activeFilters.date);
        filteredEvents = filteredEvents.filter((event) => {
          const eventDate = new Date(event.date);
          return (
            eventDate.getFullYear() === filterDate.getFullYear() &&
            eventDate.getMonth() === filterDate.getMonth() &&
            eventDate.getDate() === filterDate.getDate()
          );
        });
      }
      
      // Apply price filter
      filteredEvents = filteredEvents.filter((event) => {
        // Convert price to number for comparison if it's a string
        const eventPrice = typeof event.price === 'string' ? parseFloat(event.price) : (event.price || 0);
        return eventPrice >= activeFilters.priceRange[0] && eventPrice <= activeFilters.priceRange[1];
      });
      
      setEvents(filteredEvents);
    }
  }, [fetchedEvents, activeFilters]);
  
  // Update search params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (activeFilters.category !== 'All') {
      params.set('category', activeFilters.category);
    }
    
    if (activeFilters.searchQuery) {
      params.set('search', activeFilters.searchQuery);
    }
    
    setSearchParams(params);
  }, [activeFilters.category, activeFilters.searchQuery, setSearchParams]);
  
  const handleApplyFilters = (filters: any) => {
    setActiveFilters({
      ...filters,
      searchQuery: activeFilters.searchQuery
    });
  };
  
  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Discover Events</h1>
        <p className="text-muted-foreground">
          Find events that match your interests and connect with like-minded people.
        </p>
      </div>
      
      <EventFilters onApplyFilters={handleApplyFilters} />
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          {isLoading ? (
            <span className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading events...
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              {events.length} {events.length === 1 ? 'event' : 'events'} found
            </span>
          )}
          
          {activeFilters.category !== 'All' && (
            <Badge variant="outline" className="gap-1 flex items-center">
              Category: {activeFilters.category}
            </Badge>
          )}
          
          {activeFilters.location && (
            <Badge variant="outline" className="gap-1 flex items-center">
              Location: {activeFilters.location}
            </Badge>
          )}
          
          {activeFilters.date && (
            <Badge variant="outline" className="gap-1 flex items-center">
              Date: {activeFilters.date.toLocaleDateString()}
            </Badge>
          )}
          
          {activeFilters.searchQuery && (
            <Badge variant="outline" className="gap-1 flex items-center">
              Search: {activeFilters.searchQuery}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-event hover:bg-event-dark' : ''}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-event hover:bg-event-dark' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-event" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters to find events that match your criteria.
          </p>
          <Button 
            onClick={() => setActiveFilters({
              category: 'All',
              location: '',
              priceRange: [0, 500],
              searchQuery: ''
            })}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className={`grid ${viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'} gap-6`}
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </main>
  );
};

export default EventsPage;
