
import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Users, ImageOff } from 'lucide-react';
import { formatDistanceToNow, isPast, isFuture } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { EventData } from '@/services/eventService';

interface EventCardProps {
  event: EventData;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const eventDate = new Date(event.date + 'T' + event.time);
  const timeUntilEvent = formatDistanceToNow(eventDate, { addSuffix: true });
  const isPastEvent = isPast(eventDate);
  const isUpcomingSoon = isFuture(eventDate) && ((eventDate.getTime() - new Date().getTime()) < (30 * 24 * 60 * 60 * 1000)); // Within 30 days
  const availableSpots = (event.capacity || 100) - (event.attendees || 0);
  
  // Real image URLs for events based on category
  const categoryImages = {
    'music': 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    'technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    'arts': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'business': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    'sports': 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    'food': 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    'education': 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    'health': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'other': 'https://images.unsplash.com/photo-1648737966661-04c66ab467e5'
  };
  
  // Get image based on category or use the event's image if provided
  const imageUrl = event.image_url 
    ? event.image_url
    : categoryImages[event.category.toLowerCase() as keyof typeof categoryImages] || '/placeholder.svg';
  
  // Parse the price to ensure it's a number for comparison
  const priceValue = typeof event.price === 'string' ? parseFloat(event.price) : (event.price || 0);
  
  return (
    <Link to={`/events/${event.id}`}>
      <Card className="event-card h-full flex flex-col">
        <div className="relative">
          <div className="w-full aspect-video overflow-hidden bg-muted">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={event.title} 
                className="w-full h-full object-cover transition-transform hover:scale-105"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageOff className="h-12 w-12 text-muted-foreground/50" />
              </div>
            )}
          </div>
          <Badge className="absolute top-3 right-3 bg-event text-white">
            {event.category}
          </Badge>
          {isUpcomingSoon && (
            <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
              Coming Soon
            </Badge>
          )}
          {isPastEvent && (
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
              <Badge className="bg-black/80 text-white text-lg px-4 py-2">Past Event</Badge>
            </div>
          )}
          {!isPastEvent && availableSpots < 20 && (
            <div className="absolute bottom-0 left-0 right-0 bg-destructive/80 text-white text-center py-1 text-sm font-medium">
              Only {availableSpots} spots left!
            </div>
          )}
        </div>
        
        <CardContent className="flex-grow p-4">
          <div className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
            <CalendarDays className="h-3.5 w-3.5 mr-1" />
            <span>{timeUntilEvent}</span>
          </div>
          
          <h3 className="font-semibold text-lg line-clamp-2 mb-2">
            {event.title}
          </h3>
          
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            <span className="truncate">{event.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5 mr-1.5" />
            <span>{event.attendees || 0} attending</span>
          </div>
        </CardContent>
        
        <CardFooter className="px-4 py-3 border-t flex justify-between items-center">
          <span className="font-semibold">
            {priceValue === 0 ? 'Free' : `$${priceValue}`}
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-event-light text-event-dark">
            View Details
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCard;
