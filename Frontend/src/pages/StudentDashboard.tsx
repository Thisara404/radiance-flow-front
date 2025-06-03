import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import { Calendar, Home, Contact, Plus, User } from 'lucide-react';

// Import services
import * as classService from '../services/classService';
import * as enrollmentService from '../services/enrollmentService';
import * as userService from '../services/userService';
import * as eventService from '../services/eventService';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    emergencyContact: ''
  });
  
  // State for classes
  const [availableClasses, setAvailableClasses] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [payments, setPayments] = useState([]);
  
  // State for events
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Fetch enrolled classes and registered events on load
  useEffect(() => {
    const fetchEnrolledClasses = async () => {
      try {
        setIsLoading(true);
        
        // Fetch my enrollments
        const enrollmentsResponse = await enrollmentService.getMyEnrollments();
        
        if (enrollmentsResponse.success) {
          // Format the enrolled classes
          const formattedClasses = enrollmentsResponse.data.map(enrollment => ({
            id: enrollment.class._id,
            name: enrollment.class.name,
            instructor: enrollment.class.instructor?.name || 'Unassigned',
            level: enrollment.class.level,
            schedule: enrollment.class.schedule,
            status: enrollment.status,
            enrollmentId: enrollment._id,
            enrollmentDate: new Date(enrollment.enrollmentDate).toLocaleDateString()
          }));
          
          setEnrolledClasses(formattedClasses);
        }
        
        // Fetch available classes (not enrolled yet)
        const classesResponse = await classService.getAllClasses();
        
        if (classesResponse.success) {
          const alreadyEnrolledClassIds = enrollmentsResponse.data.map(e => e.class._id);
          
          // Filter out classes the student is already enrolled in
          const availableClasses = classesResponse.data
            .filter(cls => !alreadyEnrolledClassIds.includes(cls._id))
            .map(cls => ({
              id: cls._id,
              name: cls.name,
              instructor: cls.instructor?.name || 'Unassigned',
              level: cls.level,
              schedule: cls.schedule,
              spots: cls.availableSpots,
              capacity: cls.capacity,
              price: cls.price
            }));
          
          setAvailableClasses(availableClasses);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your class data',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };
    
    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const response = await userService.getMyProfile();
        
        if (response.success && response.data) {
          setUserProfile({
            name: response.data.name || user?.name || '',
            email: response.data.email || user?.email || '',
            phone: response.data.phone || '',
            emergencyContact: response.data.emergencyContact || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    const fetchRegisteredEvents = async () => {
      setEventsLoading(true);
      try {
        const response = await eventService.getMyEventRegistrations();
        
        if (response.success) {
          // Format the events
          const formattedEvents = response.data.map(registration => ({
            id: registration.event._id,
            title: registration.event.title || registration.event.eventType,
            date: new Date(registration.event.date).toLocaleDateString(),
            time: registration.event.time,
            venue: registration.event.venue,
            category: registration.event.category,
            status: registration.status,
            registrationDate: new Date(registration.registrationDate).toLocaleDateString()
          }));
          
          setRegisteredEvents(formattedEvents);
        } else {
          toast({
            title: 'Error',
            description: 'Failed to load your registered events',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Error fetching registered events:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your registered events',
          variant: 'destructive'
        });
      } finally {
        setEventsLoading(false);
      }
    };
    
    fetchEnrolledClasses();
    fetchUserProfile();
    fetchRegisteredEvents();
  }, [user]);

  // Handler for enrolling in a class
  const handleEnroll = async (classId) => {
    try {
      setIsLoading(true);
      const response = await enrollmentService.enrollInClass(classId);
      
      if (response.success) {
        // Update available classes list
        const enrolledClass = availableClasses.find(c => c.id === classId);
        
        if (enrolledClass) {
          // Add to enrolled classes
          setEnrolledClasses([...enrolledClasses, {
            id: classId,
            name: enrolledClass.name,
            instructor: enrolledClass.instructor,
            level: enrolledClass.level,
            schedule: enrolledClass.schedule,
            status: 'active',
            enrollmentId: response.data._id,
            enrollmentDate: new Date().toLocaleDateString()
          }]);
          
          // Remove from available classes
          setAvailableClasses(availableClasses.filter(c => c.id !== classId));
          
          toast({
            title: 'Success',
            description: `You've been enrolled in ${enrolledClass.name}!`
          });
          
          // Switch to my classes tab
          setActiveTab('classes');
        }
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to enroll in class',
          variant: 'destructive'
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error enrolling in class:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to enroll in class',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };
  
  // Handle updating user profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.updateMyProfile(userProfile);
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully'
        });
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to update profile',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    }
  };

  // Content for each tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleUpdateProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={userProfile.name} 
                      onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={userProfile.email} 
                      onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                      disabled 
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      placeholder="(555) 123-4567" 
                      value={userProfile.phone} 
                      onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    <Input 
                      id="emergency" 
                      placeholder="Emergency contact number" 
                      value={userProfile.emergencyContact} 
                      onChange={(e) => setUserProfile({...userProfile, emergencyContact: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        );

      case 'enroll':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Classes</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                    <p className="mt-2">Loading available classes...</p>
                  </div>
                ) : availableClasses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No available classes found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableClasses.map((cls) => (
                      <div key={cls.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{cls.name}</h3>
                            <p className="text-gray-600">Instructor: {cls.instructor}</p>
                            <p className="text-gray-600">Schedule: {cls.schedule}</p>
                            <p className="text-gray-600">Level: {cls.level}</p>
                            <p className="text-gray-600">Price: {cls.price}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600 mb-2">
                              {cls.spots} spots available
                            </p>
                            <Button 
                              onClick={() => handleEnroll(cls.id)}
                              disabled={isLoading || cls.spots === 0}
                              className="bg-gradient-to-r from-purple-600 to-pink-600"
                              size="sm"
                            >
                              {isLoading ? 'Processing...' : cls.spots === 0 ? 'Class Full' : 'Enroll Now'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-800">Need Help Choosing?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-900">
                  Not sure which class is right for you? Contact our staff for guidance on which classes best match your skill level and interests.
                </p>
                <Button 
                  className="mt-4 bg-purple-700 hover:bg-purple-800"
                  onClick={() => navigate('/contact')}
                >
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'classes':
        return (
          <Card>
            <CardHeader>
              <CardTitle>My Enrolled Classes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                  <p className="mt-2">Loading your classes...</p>
                </div>
              ) : enrolledClasses.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                  <p className="text-gray-500">You are not enrolled in any classes yet</p>
                  <Button 
                    onClick={() => setActiveTab('enroll')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    Explore Classes
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledClasses.map((cls) => (
                    <div key={cls.id} className="border rounded-lg p-4 bg-purple-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{cls.name}</h3>
                          <p className="text-gray-600">Instructor: {cls.instructor}</p>
                          <p className="text-gray-600">Schedule: {cls.schedule}</p>
                          <p className="text-gray-600">Level: {cls.level}</p>
                          <p className="text-gray-600">Enrolled on: {cls.enrollmentDate}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            cls.status === 'active' ? 'bg-green-100 text-green-800' :
                            cls.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            cls.status === 'dropped' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'payments':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-gray-500 py-4">Payment history coming soon</p>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  onClick={() => navigate('/payment')}
                >
                  Make Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'events':
        return (
          <Card>
            <CardHeader>
              <CardTitle>My Registered Events</CardTitle>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                  <p className="mt-2">Loading your events...</p>
                </div>
              ) : registeredEvents.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                  <p className="text-gray-500">You are not registered for any events yet</p>
                  <Button 
                    onClick={() => navigate('/events')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    Browse Events
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {registeredEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 bg-purple-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <p className="text-gray-600">{event.date} at {event.time}</p>
                          <p className="text-gray-600">Venue: {event.venue}</p>
                          <p className="text-gray-600">Category: {event.category}</p>
                          <p className="text-gray-600">Registered on: {event.registrationDate}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-gray-600">Manage your dance journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button
                    variant={activeTab === 'profile' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="mr-2" size={16} />
                    Profile
                  </Button>
                  <Button
                    variant={activeTab === 'enroll' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('enroll')}
                  >
                    <Plus className="mr-2" size={16} />
                    Enroll in Classes
                  </Button>
                  <Button
                    variant={activeTab === 'classes' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('classes')}
                  >
                    <Calendar className="mr-2" size={16} />
                    My Classes
                  </Button>
                  <Button
                    variant={activeTab === 'payments' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('payments')}
                  >
                    <Contact className="mr-2" size={16} />
                    Payments
                  </Button>
                  <Button
                    variant={activeTab === 'events' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('events')}
                  >
                    <Calendar className="mr-2" size={16} />
                    My Events
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
