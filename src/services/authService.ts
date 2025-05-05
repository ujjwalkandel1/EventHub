
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserSignupData extends UserCredentials {
  name?: string;
  userType?: 'attendee' | 'organizer';
}

export const signIn = async ({ email, password }: UserCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    toast({
      title: "Login failed",
      description: error.message || "An error occurred during login",
      variant: "destructive",
    });
    throw error;
  }
};

export const signUp = async ({ email, password, name, userType }: UserSignupData) => {
  try {
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          user_type: userType || 'attendee',
        },
      },
    });

    if (authError) {
      throw authError;
    }

    return authData;
  } catch (error: any) {
    toast({
      title: "Signup failed",
      description: error.message || "An error occurred during signup",
      variant: "destructive",
    });
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  } catch (error: any) {
    toast({
      title: "Sign out failed",
      description: error.message || "An error occurred during sign out",
      variant: "destructive",
    });
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return data?.session?.user || null;
  } catch (error: any) {
    toast({
      title: "Error fetching user",
      description: error.message || "An error occurred while fetching user data",
      variant: "destructive",
    });
    return null;
  }
};
