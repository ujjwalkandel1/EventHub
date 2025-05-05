
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: {
    address: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  organizer: {
    id: string;
    name: string;
    image: string;
  };
  price: number;
  category: string;
  image: string;
  attendees: number;
  capacity: number;
}

export const categories = [
  'All',
  'Music',
  'Technology',
  'Arts',
  'Business',
  'Sports',
  'Food',
  'Education',
  'Health',
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2025',
    description: 'Join us for the biggest tech conference of the year featuring keynotes from industry leaders, workshops on cutting-edge technologies, and networking opportunities with professionals from around the world.',
    date: '2025-06-15',
    time: '09:00',
    location: {
      address: '123 Innovation Blvd',
      city: 'San Francisco, CA',
      coordinates: {
        lat: 37.7749,
        lng: -122.4194,
      },
    },
    organizer: {
      id: 'org1',
      name: 'Tech Events Inc',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?fit=crop&w=100&h=100',
    },
    price: 299,
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    attendees: 850,
    capacity: 1000,
  },
  {
    id: '2',
    title: 'Summer Music Festival',
    description: 'A three-day outdoor music festival featuring top artists across multiple genres, food vendors, art installations, and camping options for a full weekend experience.',
    date: '2025-07-20',
    time: '12:00',
    location: {
      address: '456 Festival Grounds',
      city: 'Austin, TX',
      coordinates: {
        lat: 30.2672,
        lng: -97.7431,
      },
    },
    organizer: {
      id: 'org2',
      name: 'Rhythm Productions',
      image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?fit=crop&w=100&h=100',
    },
    price: 150,
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    attendees: 5000,
    capacity: 7500,
  },
  {
    id: '3',
    title: 'Business Leadership Summit',
    description: 'An exclusive gathering of C-suite executives and business leaders to discuss emerging trends, share insights, and form strategic partnerships.',
    date: '2025-05-10',
    time: '10:00',
    location: {
      address: '789 Corporate Tower',
      city: 'New York, NY',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060,
      },
    },
    organizer: {
      id: 'org3',
      name: 'Business Leaders Association',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?fit=crop&w=100&h=100',
    },
    price: 499,
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    attendees: 200,
    capacity: 250,
  },
  {
    id: '4',
    title: 'Art Exhibition: Future Perspectives',
    description: 'A curated exhibition featuring works from emerging artists exploring themes of technology, nature, and human connection in the digital age.',
    date: '2025-08-05',
    time: '11:00',
    location: {
      address: '101 Gallery Lane',
      city: 'Chicago, IL',
      coordinates: {
        lat: 41.8781,
        lng: -87.6298,
      },
    },
    organizer: {
      id: 'org4',
      name: 'Modern Art Foundation',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=100&h=100',
    },
    price: 25,
    category: 'Arts',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    attendees: 300,
    capacity: 500,
  },
  {
    id: '5',
    title: 'Marathon for Charity',
    description: 'Annual charity marathon to raise funds for children\'s education. Participants can choose between 5K, 10K, and full marathon distances.',
    date: '2025-04-12',
    time: '07:00',
    location: {
      address: '555 Riverside Park',
      city: 'Boston, MA',
      coordinates: {
        lat: 42.3601,
        lng: -71.0589,
      },
    },
    organizer: {
      id: 'org5',
      name: 'RunForCause Foundation',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?fit=crop&w=100&h=100',
    },
    price: 50,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    attendees: 2000,
    capacity: 3000,
  },
  {
    id: '6',
    title: 'Culinary Workshop: International Cuisine',
    description: 'A hands-on cooking workshop where participants learn to prepare authentic dishes from around the world under the guidance of professional chefs.',
    date: '2025-09-18',
    time: '18:00',
    location: {
      address: '222 Gourmet Avenue',
      city: 'Seattle, WA',
      coordinates: {
        lat: 47.6062,
        lng: -122.3321,
      },
    },
    organizer: {
      id: 'org6',
      name: 'Global Flavors Institute',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?fit=crop&w=100&h=100',
    },
    price: 85,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    attendees: 75,
    capacity: 100,
  }
];
