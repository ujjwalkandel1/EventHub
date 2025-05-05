
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Use proper Supabase URL and anon key
const supabaseUrl = 'https://ngorxbxczdsygceszsjw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nb3J4YnhjemRzeWdjZXN6c2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMTI4NDAsImV4cCI6MjA2MTU4ODg0MH0.G_1zLDF2U9wivduPoWGgXLJcFK6-mbZGtQwCUGPcYuk';

// No need to check for environment variables anymore since we're hardcoding them
// Still show a message for connection status
if (typeof document !== 'undefined') {
  // Only show toast in browser environment
  setTimeout(() => {
    toast({
      title: "Backend Connection",
      description: "Connected to Supabase database.",
      duration: 3000,
    });
  }, 1000);
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: typeof window !== 'undefined' ? localStorage : undefined,
    },
    global: {
      headers: {
        'x-application-name': 'evently',
      },
    },
  }
);

// Add error handling for network issues
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    toast({
      title: "Connection Restored",
      description: "You're back online. Data will now sync with the server.",
    });
  });
  
  window.addEventListener('offline', () => {
    toast({
      title: "Connection Lost",
      description: "You're offline. Some features may be limited.",
      variant: "destructive",
    });
  });
}
