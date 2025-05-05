
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Menu, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { Form } from '@/components/ui/form';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-lg font-semibold hover:text-primary transition-colors">Home</Link>
                <Link to="/events" className="text-lg font-semibold hover:text-primary transition-colors">Events</Link>
                {user && (
                  <>
                    <Link to="/create" className="text-lg font-semibold hover:text-primary transition-colors">Create Event</Link>
                    <Link to="/dashboard" className="text-lg font-semibold hover:text-primary transition-colors">Dashboard</Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-event to-event-dark bg-clip-text text-transparent">
              EventHub
            </span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-6 ml-10">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
            <Link to="/events" className="text-sm font-medium hover:text-primary transition-colors">Events</Link>
            {user && (
              <>
                <Link to="/create" className="text-sm font-medium hover:text-primary transition-colors">Create Event</Link>
                <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
              </>
            )}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <form className="hidden md:flex items-center relative" onSubmit={handleSearch}>
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="search" 
              placeholder="Search events..." 
              className="pl-8 h-9 w-[200px] lg:w-[300px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
                <Button size="sm" className="flex items-center gap-1" asChild>
                  <Link to="/dashboard">
                    <User size={14} />
                    Dashboard
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
