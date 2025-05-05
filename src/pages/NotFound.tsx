
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-secondary">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-event to-event-dark bg-clip-text text-transparent">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild className="bg-event hover:bg-event-dark">
            <Link to="/">Go to Homepage</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/events">Browse Events</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
