
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Share, Users, ChevronLeft, Loader2, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEventById, deleteEvent } from '@/services/eventService';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [ticketCount, setTicketCount] = useState(1);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEventById(id!),
    enabled: !!id
  });
  
  const deleteMutation = useMutation({
    mutationFn: () => deleteEvent(id!),
    onSuccess: () => {
      toast.success('Event deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate('/events');
    },
    onError: (error) => {
      toast.error('Failed to delete event', {
        description: error.message
      });
    }
  });
  
  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !event) {
    return (
      <div className="container py-12 text-center animate-fade-in">
        <h2 className="text-3xl font-bold mb-4">Event Not Found</h2>
        <p className="mb-8">The event you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/events">Browse Events</Link>
        </Button>
      </div>
    );
  }
  
  const eventDate = new Date(event.date + 'T' + event.time);
  const formattedDate = format(eventDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(eventDate, 'h:mm a');
  
  const increaseTicketCount = () => {
    if (ticketCount < 10) {
      setTicketCount(ticketCount + 1);
    }
  };
  
  const decreaseTicketCount = () => {
    if (ticketCount > 1) {
      setTicketCount(ticketCount - 1);
    }
  };
  
  const handleRegisterClick = () => {
    if (!user) {
      toast('Login Required', {
        description: "Please login to register for this event"
      });
      navigate("/login", { state: { returnUrl: `/events/${id}` } });
      return;
    }
    
    setIsRegisterDialogOpen(true);
  };
  
  const handleConfirmRegistration = () => {
    toast.success('Registration Successful!', {
      description: `You've registered for ${ticketCount} ticket${ticketCount > 1 ? 's' : ''} to ${event.title}`
    });
    setIsRegisterDialogOpen(false);
  };
  
  const handleShareEvent = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: `Check out this event: ${event.title}`,
          url: window.location.href
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link Copied!', {
          description: "Event link copied to clipboard"
        });
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };
  
  const handleDeleteEvent = () => {
    deleteMutation.mutate();
  };
  
  const isOwner = user && event.user_id === user.id;
  
  return (
    <main className="pb-16">
      <div className="bg-gradient-to-r from-event/20 to-secondary p-6 sm:p-8 md:p-12 animate-fade-in">
        <div className="container">
          <Link 
            to="/events" 
            className="inline-flex items-center text-sm font-medium mb-6 hover:text-primary transition-all duration-300 hover:-translate-x-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Events
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 animate-slide-in-left">
              <Badge className="mb-4 bg-event text-white">
                {event.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 transform transition-transform hover:scale-[1.02]">
                {event.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 mb-6">
                {[
                  { Icon: Calendar, text: formattedDate },
                  { Icon: Clock, text: formattedTime },
                  { Icon: MapPin, text: event.location },
                  { Icon: Users, text: `${event.attendees} attending` }
                ].map(({ Icon, text }, index) => (
                  <div 
                    key={text} 
                    className={`flex items-center text-sm animate-fade-in-delayed`} 
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <Icon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
              
              {isOwner && (
                <div className="flex gap-2 mb-6">
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/events/${id}/edit`} className="flex items-center">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Event
                    </Link>
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setIsDeleteAlertOpen(true)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Event
                  </Button>
                </div>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md animate-scale-in">
              <div className="mb-4">
                <span className="text-2xl font-bold">{event.price === 0 ? 'Free' : `$${event.price}`}</span>
                {event.capacity - event.attendees < 20 && (
                  <div className="text-sm text-destructive mt-1">
                    Only {event.capacity - event.attendees} spots left!
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mb-6 border rounded-md">
                <button
                  onClick={decreaseTicketCount}
                  className="px-4 py-2 text-lg font-bold"
                  disabled={ticketCount <= 1}
                >
                  -
                </button>
                <span className="text-lg font-medium">{ticketCount} Ticket{ticketCount > 1 ? 's' : ''}</span>
                <button
                  onClick={increaseTicketCount}
                  className="px-4 py-2 text-lg font-bold"
                  disabled={ticketCount >= 10}
                >
                  +
                </button>
              </div>
              
              <div className="flex justify-between mb-4 text-sm">
                <span>Price ({ticketCount} x ${event.price || 0})</span>
                <span>${(event.price || 0) * ticketCount}</span>
              </div>
              <div className="flex justify-between mb-4 text-sm">
                <span>Service fee</span>
                <span>${((event.price || 0) * ticketCount * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>${((event.price || 0) * ticketCount * 1.1).toFixed(2)}</span>
              </div>
              
              <div className="mt-6">
                <Button className="w-full bg-event hover:bg-event-dark mb-3" onClick={handleRegisterClick}>
                  Register Now
                </Button>
                <Button variant="outline" className="w-full" onClick={handleShareEvent}>
                  <Share className="h-4 w-4 mr-2" />
                  Share Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Registration</DialogTitle>
            <DialogDescription>
              You're about to register for {ticketCount} ticket{ticketCount > 1 ? 's' : ''} to {event.title}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-between mb-2 text-sm">
              <span>Event:</span>
              <span className="font-medium">{event.title}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Date & Time:</span>
              <span>{formattedDate} at {formattedTime}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Tickets:</span>
              <span>{ticketCount}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm font-bold">
              <span>Total Amount:</span>
              <span>${((event.price || 0) * ticketCount * 1.1).toFixed(2)}</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRegisterDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmRegistration}>Confirm Registration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="container py-8">
        <Tabs defaultValue="details">
          <TabsList className="mb-8 animate-fade-in">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            {event.image_url && (
              <img 
                src={event.image_url} 
                alt={event.title} 
                className="w-full max-h-96 object-cover rounded-lg mb-6"
              />
            )}
            
            <div>
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="location">
            <div className="bg-secondary p-6 rounded-lg mb-6">
              <h3 className="font-bold mb-2">Location</h3>
              <p className="text-muted-foreground">{event.location}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default EventDetailPage;
