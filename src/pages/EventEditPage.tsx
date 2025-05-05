
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getEventById, updateEvent } from '@/services/eventService';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuth } from '@/context/AuthContext';

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }).max(100),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters."
  }),
  date: z.date({
    required_error: "Event date is required.",
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM)."
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters."
  }),
  category: z.string({
    required_error: "Please select a category."
  }),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Please enter a valid price."
  }).optional(),
  image_url: z.string().url({
    message: "Please enter a valid image URL."
  }).optional(),
});

const EventEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      time: "",
      price: "",
      image_url: "",
    },
  });

  // Fetch event data - Fixed the useQuery hook to use callbacks
  const { data: event, isLoading, isError } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEventById(id!),
    enabled: !!id,
  });
  
  // Handle authorization and form initialization after data is loaded
  React.useEffect(() => {
    if (event) {
      // Check if the user is the owner of the event
      if (user?.id !== event.user_id) {
        toast.error("Unauthorized", {
          description: "You don't have permission to edit this event"
        });
        navigate(`/events/${id}`);
        return;
      }
      
      // Parse the date from string to Date object
      const eventDate = new Date(event.date);
      
      // Set form values
      form.reset({
        title: event.title,
        description: event.description,
        date: eventDate,
        time: event.time,
        location: event.location,
        category: event.category,
        price: event.price?.toString() || "",
        image_url: event.image_url || "",
      });
    }
  }, [event, user, id, navigate, form]);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      toast.error('Authentication required', {
        description: 'You must be logged in to edit an event'
      });
      navigate('/login', { state: { returnUrl: `/events/${id}/edit` } });
    }
  }, [user, navigate, id]);

  const updateEventMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Transform the date object to ISO string for Supabase
      const formattedValues = {
        title: values.title,
        description: values.description,
        date: values.date.toISOString().split('T')[0],
        time: values.time,
        location: values.location,
        category: values.category,
        price: values.price || undefined,
        image_url: values.image_url || undefined,
      };
      
      if (!id) throw new Error("Event ID is required");
      return await updateEvent(id, formattedValues);
    },
    onSuccess: (data) => {
      toast.success("Event updated successfully!", {
        description: "Your changes have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['userEvents'] });
      navigate(`/events/${id}`);
    },
    onError: (error: Error) => {
      console.error("Error updating event:", error);
      toast.error("Failed to update event", {
        description: error.message || "There was a problem updating your event. Please try again.",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateEventMutation.mutate(values);
  }

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  if (isLoading) {
    return (
      <div className="container flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="container text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <p className="mb-6">We couldn't find the event you're looking for.</p>
        <Button asChild>
          <Link to="/events">Back to Events</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-10 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Edit Event</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a clear and catchy title for your event.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Event Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Time</FormLabel>
                      <FormControl>
                        <Input placeholder="19:00" {...field} />
                      </FormControl>
                      <FormDescription>
                        24-hour format (HH:MM)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Event location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="arts">Arts & Culture</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="food">Food & Drink</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="29.99" {...field} />
                    </FormControl>
                    <FormDescription>
                      Leave empty if the event is free
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Add an image to make your event stand out
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell people what your event is about..." 
                        className="min-h-[120px]" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide details about your event, including what attendees can expect.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => navigate(`/events/${id}`)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-event hover:bg-event-dark"
                  disabled={updateEventMutation.isPending}
                >
                  {updateEventMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventEditPage;
