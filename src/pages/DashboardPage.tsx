
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Plus, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUserEvents } from '@/services/eventService';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnUrl: '/dashboard' } });
    }
  }, [user, navigate]);
  
  const { data: events, isLoading, isError } = useQuery({
    queryKey: ['userEvents'],
    queryFn: getUserEvents,
    enabled: !!user,
  });
  
  if (!user) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-event to-event-dark bg-clip-text text-transparent">
          Dashboard
        </h1>
        <Button asChild>
          <Link to="/create" className="flex items-center gap-2">
            <Plus size={16} />
            Create Event
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Events</CardTitle>
            <CardDescription>Events you've created</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : isError ? (
              <p className="text-destructive">
                Error loading your events. Please try again.
              </p>
            ) : events && events.length > 0 ? (
              <div className="space-y-4">
                {events.slice(0, 5).map((event) => (
                  <div key={event.id} className="border rounded-md p-3 hover:bg-muted transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium line-clamp-1">{event.title}</h4>
                      <Button variant="ghost" size="icon" asChild className="h-6 w-6">
                        <Link to={`/events/${event.id}/edit`}>
                          <Edit className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(event.date), 'MMM d, yyyy')}
                    </div>
                  </div>
                ))}
                
                {events.length > 5 && (
                  <Button variant="link" className="w-full" asChild>
                    <Link to="/dashboard/events">View All Events</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  You haven't created any events yet.
                </p>
                <Button asChild>
                  <Link to="/create">Create Your First Event</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events happening soon</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <p className="text-muted-foreground">
                No upcoming events scheduled.
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-medium">Email:</span> {user.email}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              Edit Profile
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
