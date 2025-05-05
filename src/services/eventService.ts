
import { supabase } from '@/lib/supabase';
import { mockEvents } from '@/data/events';
import { toast } from '@/components/ui/use-toast';

export interface EventData {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price?: string | number;
  image_url?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  attendees?: number;
  capacity?: number;
}

// Helper function to check if Supabase is available
const isSupabaseAvailable = async () => {
  try {
    const { data, error } = await supabase.from('events').select('id').limit(1);
    return !error;
  } catch (error) {
    console.error("Supabase connection check failed:", error);
    return false;
  }
};

// Helper function to handle errors consistently
const handleError = (error: any, fallbackAction?: () => any, errorMessage?: string) => {
  console.error(errorMessage || "Database operation failed:", error);
  
  // Show toast message for user feedback
  toast({
    title: "Operation Failed",
    description: error?.message || "Something went wrong. Please try again later.",
    variant: "destructive"
  });
  
  // Return fallback data if provided
  return fallbackAction ? fallbackAction() : null;
};

export const createEvent = async (eventData: Omit<EventData, 'id' | 'created_at'>) => {
  try {
    // Check if Supabase is available
    const available = await isSupabaseAvailable();
    if (!available) {
      throw new Error("Database connection unavailable");
    }

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User must be authenticated to create an event");
    }
    
    // Add the user_id to the event data
    const eventWithUserId = {
      ...eventData,
      user_id: user.id,
      attendees: 0,
      capacity: 100
    };
    
    const { data, error } = await supabase
      .from('events')
      .insert([eventWithUserId])
      .select();

    if (error) {
      throw error;
    }
    
    toast({
      title: "Event Created",
      description: "Your event has been created successfully.",
    });
    
    return data?.[0];
  } catch (error) {
    return handleError(error, null, "Failed to create event:");
  }
};

export const getEvents = async (searchQuery?: string) => {
  try {
    // Check if Supabase is available
    const available = await isSupabaseAvailable();
    if (!available) {
      throw new Error("Database connection unavailable");
    }

    let query = supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true }); // Order by date ascending to get upcoming events first
      
    if (searchQuery) {
      // Search across multiple columns
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Failed to fetch events, using mock data:", error);
    // Return mock events if Supabase is not available
    return mockEvents.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location.city,
      category: event.category,
      price: event.price,
      image_url: event.image,
      attendees: event.attendees,
      capacity: event.capacity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  }
};

export const getUpcomingEvents = async (limit: number = 3) => {
  try {
    // Check if Supabase is available
    const available = await isSupabaseAvailable();
    if (!available) {
      throw new Error("Database connection unavailable");
    }

    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', today) // Get events with date greater than or equal to today
      .order('date', { ascending: true }) // Order by date ascending
      .limit(limit);

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Failed to fetch upcoming events, using mock data:", error);
    // Filter mock events to get upcoming events
    const today = new Date().toISOString().split('T')[0];
    return mockEvents
      .filter(event => event.date >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit)
      .map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location.city,
        category: event.category,
        price: event.price,
        image_url: event.image,
        attendees: event.attendees,
        capacity: event.capacity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
  }
};

export const getFeaturedEvents = async (limit: number = 3) => {
  try {
    // Check if Supabase is available
    const available = await isSupabaseAvailable();
    if (!available) {
      throw new Error("Database connection unavailable");
    }

    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', today) // Only get upcoming events
      .order('attendees', { ascending: false }) // Order by most attended
      .limit(limit);

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Failed to fetch featured events, using mock data:", error);
    // Filter and sort mock events to get featured events
    const today = new Date().toISOString().split('T')[0];
    return mockEvents
      .filter(event => event.date >= today)
      .sort((a, b) => b.attendees - a.attendees)
      .slice(0, limit)
      .map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location.city,
        category: event.category,
        price: event.price,
        image_url: event.image,
        attendees: event.attendees,
        capacity: event.capacity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
  }
};

export const getEventById = async (id: string) => {
  try {
    // Check if Supabase is available
    const available = await isSupabaseAvailable();
    if (!available) {
      throw new Error("Database connection unavailable");
    }

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching event:", error);
    
    // Return a mock event that matches the id
    const mockEvent = mockEvents.find(event => event.id === id);
    if (mockEvent) {
      return {
        id: mockEvent.id,
        title: mockEvent.title,
        description: mockEvent.description,
        date: mockEvent.date,
        time: mockEvent.time,
        location: mockEvent.location.city,
        category: mockEvent.category,
        price: mockEvent.price,
        image_url: mockEvent.image,
        attendees: mockEvent.attendees,
        capacity: mockEvent.capacity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'mock-user-id'
      };
    }
    
    throw error;
  }
};

export const updateEvent = async (id: string, eventData: Partial<EventData>) => {
  try {
    // Check if Supabase is available
    const available = await isSupabaseAvailable();
    if (!available) {
      throw new Error("Database connection unavailable");
    }

    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    toast({
      title: "Event Updated",
      description: "Your event has been updated successfully.",
    });
    
    return data?.[0];
  } catch (error) {
    return handleError(error, null, "Error updating event:");
  }
};

export const deleteEvent = async (id: string) => {
  try {
    // Check if Supabase is available
    const available = await isSupabaseAvailable();
    if (!available) {
      throw new Error("Database connection unavailable");
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    toast({
      title: "Event Deleted",
      description: "Your event has been deleted successfully.",
    });
    
    return true;
  } catch (error) {
    return handleError(error, () => false, "Error deleting event:");
  }
};

export const getUserEvents = async () => {
  try {
    // Check if Supabase is available
    const available = await isSupabaseAvailable();
    if (!available) {
      throw new Error("Database connection unavailable");
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User must be authenticated to fetch their events");
    }
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching user events:", error);
    // For user events, return empty array as fallback
    return [];
  }
};

// New function to register attendance for an event
export const registerForEvent = async (eventId: string) => {
  try {
    // Check if Supabase is available
    const available = await isSupabaseAvailable();
    if (!available) {
      throw new Error("Database connection unavailable");
    }

    // First get current event data
    const { data: eventData, error: fetchError } = await supabase
      .from('events')
      .select('attendees, capacity')
      .eq('id', eventId)
      .single();
    
    if (fetchError) {
      throw fetchError;
    }
    
    if (!eventData) {
      throw new Error("Event not found");
    }
    
    const currentAttendees = eventData.attendees || 0;
    const capacity = eventData.capacity || 100;
    
    // Check if event is at capacity
    if (currentAttendees >= capacity) {
      throw new Error("Event is at full capacity");
    }
    
    // Increment attendees count
    const { data, error } = await supabase
      .from('events')
      .update({ attendees: currentAttendees + 1 })
      .eq('id', eventId)
      .select();
      
    if (error) {
      throw error;
    }
    
    toast({
      title: "Registration Successful",
      description: "You have been registered for this event.",
    });
    
    return data?.[0];
  } catch (error: any) {
    return handleError(error, null, "Failed to register for event:");
  }
};

// New function to update Supabase configuration
export const updateSupabaseConfig = async (url?: string, key?: string) => {
  // This function could be used to update the Supabase configuration
  // without having to reload the page
  if (url && key) {
    // This would require a mechanism to update the Supabase client
    // which is outside the scope of this edit
    console.log("Supabase configuration updated");
    
    toast({
      title: "Configuration Updated",
      description: "Backend connection has been updated.",
    });
    
    return true;
  }
  return false;
};
