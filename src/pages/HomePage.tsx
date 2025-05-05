
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getFeaturedEvents, getUpcomingEvents } from '@/services/eventService';
import EventCard from '@/components/events/EventCard';

const HomePage = () => {
  // Fetch events from Supabase
  const { data: featuredEvents, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['featuredEvents'],
    queryFn: () => getFeaturedEvents(3)
  });
  
  const { data: upcomingEvents, isLoading: isUpcomingLoading } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: () => getUpcomingEvents(3)
  });

  // Category images mapping
  const categoryImages = {
    'Music': 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80',
    'Business': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80',
    'Technology': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80',
    'Arts': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80',
    'Sports': 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80',
    'Food': 'https://images.unsplash.com/photo-1530554764233-e79e16c91d08?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80',
    'Education': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80',
    'Health': 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80',
  };
  
  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-event/10 to-event-light/30">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-10 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Find and Create <span className="bg-gradient-to-r from-event to-event-dark bg-clip-text text-transparent">Amazing Events</span> Anywhere
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Discover, attend, and organize events that matter to you. 
                Connect with people who share your passions and create 
                unforgettable experiences.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-event hover:bg-event-dark" asChild>
                  <Link to="/events">Browse Events</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/create">Create Event</Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="rounded-lg overflow-hidden shadow-xl animate-fade-in">
                <img
                  src="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80"
                  alt="People at an event"
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg p-4 shadow-lg animate-fade-in flex items-center" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 rounded-full overflow-hidden mr-3 flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Crowd at event" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-event" />
                  <span className="font-medium">30k+ People Attending</span>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-lg p-4 shadow-lg animate-fade-in flex items-center" style={{ animationDelay: '0.4s' }}>
                <div className="w-16 h-16 rounded-full overflow-hidden mr-3 flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Calendar with events" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-5 w-5 text-event" />
                  <span className="font-medium">500+ Events Monthly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Events */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Events</h2>
            <Button variant="ghost" className="text-event" asChild>
              <Link to="/events">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isFeaturedLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-secondary animate-pulse rounded-lg"></div>
              ))
            ) : featuredEvents && featuredEvents.length > 0 ? (
              featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <p className="col-span-3 text-center text-muted-foreground py-12">
                No featured events found. Why not create one?
              </p>
            )}
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-secondary">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Explore by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {['Music', 'Business', 'Technology', 'Arts', 'Sports', 'Food', 'Education', 'Health'].map((category) => (
              <Link 
                key={category} 
                to={`/events?category=${category.toLowerCase()}`}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="h-32 relative overflow-hidden">
                  <img 
                    src={categoryImages[category]} 
                    alt={`${category} category`} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <h3 className="font-medium text-white text-xl">{category}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Upcoming Events */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Upcoming Events</h2>
            <Button variant="ghost" className="text-event" asChild>
              <Link to="/events">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isUpcomingLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-secondary animate-pulse rounded-lg"></div>
              ))
            ) : upcomingEvents && upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <p className="col-span-3 text-center text-muted-foreground py-12">
                No upcoming events found. Stay tuned!
              </p>
            )}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-event-dark text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Your Own Event?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Share your passion with the world. Create an event and connect with people who share your interests.
          </p>
          <Button size="lg" className="bg-white text-event-dark hover:bg-gray-100" asChild>
            <Link to="/create">Get Started</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
