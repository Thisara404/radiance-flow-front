import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { CalendarDays, Clock, Users, DollarSign } from 'lucide-react';
import Navbar from '../components/Navbar';
import * as classService from '../services/classService';
import * as paymentService from '../services/paymentService';

export default function Classes() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(null);
  const [paidClasses, setPaidClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        const response = await classService.getAllClasses();
        
        if (response.success) {
          // Format the classes data
          const formattedClasses = response.data.map(cls => ({
            id: cls._id,
            name: cls.name,
            instructor: cls.instructor?.name || cls.instructor || 'Unassigned',
            instructorId: cls.instructor?._id,
            level: cls.level,
            schedule: cls.schedule,
            duration: cls.duration || '60 minutes',
            price: cls.price,
            description: cls.description || 'Join this exciting dance class!',
            capacity: cls.capacity || 20,
            enrollments: cls.enrollments || 0,
            availableSpots: (cls.capacity || 20) - (cls.enrollments || 0)
          }));
          
          setClasses(formattedClasses);
        }
        
        // Fetch paid classes if authenticated
        if (isAuthenticated) {
          await fetchPaidClasses();
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast({
          title: 'Error',
          description: 'Failed to load classes',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, [isAuthenticated]);

  const fetchPaidClasses = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await paymentService.getMyPaymentHistory();
      
      if (response.success) {
        const paidClassIds = response.data
          .filter(payment => 
            payment.itemType === 'class' && 
            payment.status === 'completed'
          )
          .map(payment => payment.itemId?._id);
        
        setPaidClasses(paidClassIds);
        console.log('Paid classes:', paidClassIds); // Debug log
      }
    } catch (error) {
      console.error('Error fetching paid classes:', error);
    }
  };

  // Helper function to extract day from schedule
  const getDayFromSchedule = (schedule) => {
    if (!schedule) return '';
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (const day of days) {
      if (schedule.toLowerCase().includes(day.toLowerCase())) {
        return day;
      }
    }
    
    // Try shorter versions
    const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 0; i < shortDays.length; i++) {
      if (schedule.toLowerCase().includes(shortDays[i].toLowerCase())) {
        return days[i];
      }
    }
    
    return '';
  };

  // Group classes by level
  const classesByLevel = classes.reduce((acc, cls) => {
    acc[cls.level] = acc[cls.level] || [];
    acc[cls.level].push(cls);
    return acc;
  }, {});

  // Handle payment for class enrollment
  const handlePayForClass = async (classInfo) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please log in to enroll in classes',
        variant: 'default'
      });
      navigate('/login?redirect=classes');
      return;
    }
    
    try {
      setProcessingPayment(classInfo.id);
      
      // Create payment order through payment service
      const paymentResponse = await paymentService.payForClass(
        classInfo.id, 
        classInfo.price
      );

      if (paymentResponse.success) {
        console.log('Redirecting to PayPal:', paymentResponse.data.approvalUrl);
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

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (spots) => {
    if (spots === 0) return 'bg-red-100 text-red-800';
    if (spots < 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const isClassPaid = (classId) => {
    const isPaid = paidClasses.includes(classId);
    console.log(`Class ${classId} is paid:`, isPaid); // Debug log
    return isPaid;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dance Classes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover your passion for dance with our expert instructors. From beginner-friendly sessions to advanced masterclasses, we have something for every dancer.
          </p>
        </div>

        {/* Classes by Level */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading classes...</p>
          </div>
        ) : (
          Object.entries(classesByLevel).map(([level, levelClasses]) => (
            <div key={level} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-800">{level} Classes</h2>
                  <Badge className={getLevelColor(level)}>{level}</Badge>
                </div>
                <p className="text-gray-600">{levelClasses.length} classes available</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {levelClasses.map((classItem) => {
                  const isPaid = isClassPaid(classItem.id);
                  return (
                    <Card key={classItem.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge className={getLevelColor(classItem.level)}>
                            {classItem.level}
                          </Badge>
                          {isPaid && (
                            <Badge className="bg-green-100 text-green-800">
                              Paid ✓
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{classItem.name}</CardTitle>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <strong>Instructor:</strong>
                            <span>{classItem.instructor}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <strong>Schedule:</strong>
                            <span>{classItem.schedule}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <strong>Duration:</strong>
                            <span>{classItem.duration}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <strong>Price:</strong>
                            <span className="font-bold text-purple-600">Rs. {classItem.price?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <strong>Availability:</strong>
                            <Badge className={getAvailabilityColor(classItem.availableSpots)}>
                              {classItem.availableSpots === 0 ? 'Full' : 
                              `${classItem.availableSpots} spots left`}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4 text-sm line-clamp-3">{classItem.description}</p>

                        {isPaid ? (
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled
                          >
                            Already Enrolled ✓
                          </Button>
                        ) : (
                          <Button 
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            disabled={classItem.availableSpots === 0 || processingPayment === classItem.id}
                            onClick={() => handlePayForClass(classItem)}
                          >
                            {processingPayment === classItem.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing...
                              </>
                            ) : classItem.availableSpots === 0 ? (
                              'Class Full'
                            ) : (
                              `Pay Rs. ${classItem.price?.toLocaleString()}`
                            )}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* Class Schedule */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-purple-100">
                    <th className="pb-3 font-semibold text-purple-800">Time</th>
                    <th className="pb-3 font-semibold text-purple-800">Monday</th>
                    <th className="pb-3 font-semibold text-purple-800">Tuesday</th>
                    <th className="pb-3 font-semibold text-purple-800">Wednesday</th>
                    <th className="pb-3 font-semibold text-purple-800">Thursday</th>
                    <th className="pb-3 font-semibold text-purple-800">Friday</th>
                    <th className="pb-3 font-semibold text-purple-800">Saturday</th>
                    <th className="pb-3 font-semibold text-purple-800">Sunday</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Schedule rows */}
                  <tr className="border-b border-purple-50">
                    <td className="py-3 font-medium">9:00 AM</td>
                    <td className="py-3">Ballet Basics</td>
                    <td className="py-3">-</td>
                    <td className="py-3">Contemporary</td>
                    <td className="py-3">-</td>
                    <td className="py-3">Jazz Funk</td>
                    <td className="py-3">Hip Hop</td>
                    <td className="py-3">-</td>
                  </tr>
                  <tr className="border-b border-purple-50">
                    <td className="py-3 font-medium">6:00 PM</td>
                    <td className="py-3">Hip Hop</td>
                    <td className="py-3">Bollywood</td>
                    <td className="py-3">Ballet</td>
                    <td className="py-3">Contemporary</td>
                    <td className="py-3">Jazz</td>
                    <td className="py-3">Latin Dance</td>
                    <td className="py-3">Open Practice</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to start your dance journey?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={isAuthenticated ? "/student-dashboard" : "/register"}>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                {isAuthenticated ? "Go to Dashboard" : "Register Now"}
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
