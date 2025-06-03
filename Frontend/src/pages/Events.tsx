import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Home, Contact, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import * as eventService from '../services/eventService';

export default function Events() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [registering, setRegistering] = useState(null);
  const [myRegistrations, setMyRegistrations] = useState([]);

  // Debug logging
  useEffect(() => {
    console.log('Auth status in Events:', { isAuthenticated, user });
    
    // Check localStorage directly
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    console.log('Local storage:', { 
      hasToken: !!token, 
      hasUser: !!storedUser,
      tokenPreview: token ? `${token.substring(0, 15)}...` : null
    });
  }, [isAuthenticated, user]);

  // Define the fetchEvents function outside of useEffect for wider scope access
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      // Fetch public events from the API
      const response = await eventService.getPublicEvents();
      
      if (response.success) {
        const currentDate = new Date();
        
        // Separate upcoming and past events
        const upcoming = [];
        const past = [];
        
        response.data.forEach(event => {
          const eventDate = new Date(event.date);
          
          const formattedEvent = {
            id: event._id,
            title: event.title || event.eventType,
            date: new Date(event.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
            time: event.time,
            venue: event.venue,
            description: event.description,
            price: event.price || 'Free',
            category: event.category || 'Recital',
            rawDate: eventDate
          };
          
          if (eventDate >= currentDate) {
            upcoming.push(formattedEvent);
          } else {
            past.push(formattedEvent);
          }
        });
        
        // Sort upcoming events by date (closest first)
        upcoming.sort((a, b) => a.rawDate - b.rawDate);
        
        // Sort past events by date (most recent first)
        past.sort((a, b) => b.rawDate - a.rawDate);
        
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } else {
        console.error('Failed to fetch events:', response.message);
        toast({
          title: 'Error',
          description: 'Failed to load events',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch registrations for authenticated users
  const fetchRegistrations = async () => {
    if (!isAuthenticated) return;
    
    console.log('Fetching registrations for authenticated user');
    
    try {
      const response = await eventService.getMyEventRegistrations();
      
      console.log('Registration response:', response);
      
      if (response.success) {
        // Get IDs of events the user is registered for
        const registeredEventIds = response.data.map(reg => reg.event._id);
        console.log('Registered event IDs:', registeredEventIds);
        
        setMyRegistrations(registeredEventIds);
      }
    } catch (error) {
      console.error('Error fetching user registrations:', error);
    }
  };

  // Use separate useEffects for clarity
  useEffect(() => {
    // Initial data loading
    fetchEvents();
  }, []);
  
  // Fetch registrations when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
    }
  }, [isAuthenticated]);

  const handleRegister = async (eventId) => {
    console.log('Registration attempt for event:', eventId, 'Auth status:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('User is not authenticated, redirecting to login');
      
      toast({
        title: 'Login Required',
        description: 'Please login to register for events',
        variant: 'default'
      });
      
      // Store the current page in sessionStorage to redirect back after login
      sessionStorage.setItem('redirectAfterLogin', 'events');
      navigate('/login?redirect=events');
      return;
    }
    
    setRegistering(eventId);
    
    try {
      console.log('Sending registration request');
      const response = await eventService.registerForEvent(eventId);
      console.log('Registration response:', response);
      
      if (response.success) {
        // Add this event ID to the registrations
        setMyRegistrations(prev => [...prev, eventId]);
        
        toast({
          title: 'Success',
          description: 'You have been registered for this event!'
        });
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to register for event',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to register for event',
        variant: 'destructive'
      });
    } finally {
      setRegistering(null);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Recital':
        return 'bg-purple-100 text-purple-800';
      case 'Workshop':
        return 'bg-blue-100 text-blue-800';
      case 'Competition':
        return 'bg-red-100 text-red-800';
      case 'Special Class':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-16 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Events & Workshops
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join us for exciting dance events, workshops, and performances throughout the year. 
            From recitals to master classes, there's always something happening at Radiance Dance!
          </p>
          <Link to={isAuthenticated ? "/student-dashboard" : "/register"}>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              {isAuthenticated ? 'My Dashboard' : 'Register Now'}
            </Button>
          </Link>
        </div>

        {/* Upcoming Events */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Upcoming Events
          </h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-2 text-lg text-purple-600">Loading events...</span>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No upcoming events scheduled at the moment.</p>
              <p className="mt-2 text-gray-500">Check back soon for new events!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="mr-1" size={16} />
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <Home className="mr-1" size={16} />
                        {event.venue}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{event.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Time:</span>
                        <span>{event.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Price:</span>
                        <span className="font-bold text-purple-600">{event.price}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {myRegistrations.includes(event.id) ? (
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          disabled
                        >
                          Already Registered
                        </Button>
                      ) : (
                        <Button 
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          onClick={() => handleRegister(event.id)}
                          disabled={registering === event.id}
                        >
                          {registering === event.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Register'
                          )}
                        </Button>
                      )}
                      <Link to={`/events/${event.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Event Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Event Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-4">Wedding Choreography</h3>
                <p className="text-gray-600 mb-4">
                  Create magical first dance moments with personalized choreography for your special day.
                </p>
                <Button variant="outline" className="w-full">
                  Book Consultation
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-4">Corporate Events</h3>
                <p className="text-gray-600 mb-4">
                  Team building dance workshops and entertainment for corporate gatherings and parties.
                </p>
                <Button variant="outline" className="w-full">
                  Get Quote
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Contact className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-4">Private Parties</h3>
                <p className="text-gray-600 mb-4">
                  Birthday parties, celebrations, and special occasions with customized dance activities.
                </p>
                <Button variant="outline" className="w-full">
                  Plan Party
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Past Events */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Recent Events</CardTitle>
            <p className="text-center text-gray-600">Take a look at some of our recent successful events</p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              </div>
            ) : pastEvents.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No past events to display</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pastEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">{event.title}</h4>
                    <p className="text-purple-600 font-medium mb-2">{event.date}</p>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Want to Host Your Own Event?</h2>
          <p className="text-xl mb-6 opacity-90">
            Let us help you create an unforgettable dance experience for your special occasion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="secondary" className="text-purple-600">
                Contact Us
              </Button>
            </Link>
            <Link to={isAuthenticated ? "/student-dashboard" : "/register"}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                {isAuthenticated ? 'Go to Dashboard' : 'Sign Up Now'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
