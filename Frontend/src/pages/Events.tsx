import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Add Link import
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { CalendarDays, Clock, MapPin, Users, DollarSign, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import * as eventService from '../services/eventService';
import * as paymentService from '../services/paymentService';

export default function Events() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [registering, setRegistering] = useState(null);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [processingPayment, setProcessingPayment] = useState(null);
  const [paidEvents, setPaidEvents] = useState([]);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
    if (isAuthenticated) {
      fetchRegistrations();
      fetchPaidEvents();
    }
  }, [isAuthenticated]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await eventService.getPublicEvents();
      
      if (response.success) {
        const events = response.data.map(event => ({
          id: event._id,
          title: event.title || event.eventType,
          date: event.date,
          time: event.time,
          venue: event.venue,
          description: event.description || '',
          category: event.category || 'Other',
          price: event.price || 0,
          priceDisplay: event.price ? `Rs. ${parseFloat(event.price).toLocaleString()}` : 'Free',
          isPaid: event.price && parseFloat(event.price) > 0,
          expectedGuests: event.expectedGuests || 0,
          status: event.status
        }));

        const now = new Date();
        const upcoming = events.filter(event => new Date(event.date) >= now);
        const past = events.filter(event => new Date(event.date) < now);

        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } else {
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
  
  const fetchRegistrations = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await eventService.getMyEventRegistrations();
      
      if (response.success) {
        const registeredEventIds = response.data.map(reg => reg.event._id);
        setMyRegistrations(registeredEventIds);
      }
    } catch (error) {
      console.error('Error fetching user registrations:', error);
    }
  };

  const fetchPaidEvents = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await paymentService.getMyPaymentHistory();
      
      if (response.success) {
        const paidEventIds = response.data
          .filter(payment => 
            payment.itemType === 'event' && 
            payment.status === 'completed'
          )
          .map(payment => payment.itemId?._id);
        
        setPaidEvents(paidEventIds);
      }
    } catch (error) {
      console.error('Error fetching paid events:', error);
    }
  };

  const handleRegisterFree = async (eventId) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to register for events',
        variant: 'default'
      });
      navigate('/login?redirect=events');
      return;
    }
    
    setRegistering(eventId);
    
    try {
      const response = await eventService.registerForEvent(eventId);
      
      if (response.success) {
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

  const handlePayForEvent = async (eventInfo) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to register for events',
        variant: 'default'
      });
      navigate('/login?redirect=events');
      return;
    }
    
    try {
      setProcessingPayment(eventInfo.id);
      
      // Create payment order through payment service
      const paymentResponse = await paymentService.payForEvent(
        eventInfo.id, 
        eventInfo.price
      );

      if (paymentResponse.success) {
        // Redirect to PayPal
        window.location.href = paymentResponse.data.approvalUrl;
      } else {
        throw new Error(paymentResponse.error || 'Failed to create payment');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to process payment',
        variant: 'destructive'
      });
    } finally {
      setProcessingPayment(null);
    }
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'recital':
        return 'bg-purple-100 text-purple-800';
      case 'workshop':
        return 'bg-blue-100 text-blue-800';
      case 'competition':
        return 'bg-red-100 text-red-800';
      case 'special class':
        return 'bg-green-100 text-green-800';
      case 'masterclass':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isEventPaid = (eventId) => {
    return paidEvents.includes(eventId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dance Events & Workshops
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center py-12">
              <CardContent>
                <p className="text-gray-500 text-lg">No upcoming events at the moment.</p>
                <p className="text-gray-400 mt-2">Check back soon for new exciting events!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => {
                const isPaid = isEventPaid(event.id);
                return (
                  <Card key={event.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={getCategoryColor(event.category)}>
                          {event.category}
                        </Badge>
                        {isPaid && (
                          <Badge className="bg-green-100 text-green-800">
                            Paid ✓
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <CalendarDays className="mr-2" size={16} />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="mr-2" size={16} />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="mr-2" size={16} />
                          <span>{event.venue}</span>
                        </div>
                        {event.expectedGuests > 0 && (
                          <div className="flex items-center text-gray-600">
                            <Users className="mr-2" size={16} />
                            <span>Expected: {event.expectedGuests} participants</span>
                          </div>
                        )}
                      </div>

                      {event.description && (
                        <p className="text-gray-700 text-sm line-clamp-3">{event.description}</p>
                      )}

                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center">
                          <DollarSign className="mr-2 text-purple-600" size={18} />
                          <span className="font-bold text-purple-600 text-lg">
                            {event.priceDisplay}
                          </span>
                        </div>
                        {event.isPaid && (
                          <Badge variant="outline" className="text-purple-600 border-purple-600">
                            Paid Event
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {myRegistrations.includes(event.id) ? (
                          <Button 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            disabled
                          >
                            {isPaid ? 'Registered & Paid' : 'Already Registered'}
                          </Button>
                        ) : event.isPaid ? (
                          <Button 
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            onClick={() => handlePayForEvent(event)}
                            disabled={processingPayment === event.id}
                          >
                            {processingPayment === event.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              `Pay & Register - ${event.priceDisplay}`
                            )}
                          </Button>
                        ) : (
                          <Button 
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            onClick={() => handleRegisterFree(event.id)}
                            disabled={registering === event.id}
                          >
                            {registering === event.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Registering...
                              </>
                            ) : (
                              'Register Free'
                            )}
                          </Button>
                        )}
                        
                        <Button variant="outline" className="px-6">
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
              <CardHeader>
                <CardTitle className="text-center">Wedding Choreography</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Create magical moments with custom wedding dance choreography for your special day.
                </p>
                <Button variant="outline" className="w-full">Learn More</Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-center">Corporate Events</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Professional dance performances and team building activities for corporate events.
                </p>
                <Button variant="outline" className="w-full">Learn More</Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-center">Private Parties</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Make your celebrations memorable with customized dance entertainment.
                </p>
                <Button variant="outline" className="w-full">Learn More</Button>
              </CardContent>
            </Card>
          </div>
        </div>

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
