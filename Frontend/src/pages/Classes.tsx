import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import * as classService from '../services/classService';
import * as enrollmentService from '../services/enrollmentService';

export default function Classes() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        const response = await classService.getAllClasses();
        
        // Format the classes data
        const formattedClasses = response.data.map(cls => ({
          id: cls._id,
          name: cls.name,
          instructor: cls.instructor?.name || 'Unassigned',
          instructorId: cls.instructor?._id,
          level: cls.level,
          schedule: cls.schedule,
          duration: cls.duration || '60 minutes',
          price: cls.price,
          description: cls.description || 'Join this exciting dance class!',
          capacity: cls.capacity,
          enrolled: cls.enrolledCount || 0,
          availableSpots: cls.availableSpots || cls.capacity,
          dayOfWeek: getDayFromSchedule(cls.schedule) // Helper function below
        }));
        
        setClasses(formattedClasses);
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
  }, []);

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

// Update the handleEnroll function in Classes.tsx:

// Handle enrollment
const handleEnroll = async (classId) => {
  if (!isAuthenticated) {
    toast({
      title: 'Login Required',
      description: 'Please log in or register to enroll in classes',
      variant: 'default'
    });
    navigate('/login?redirect=classes');
    return;
  }
  
  try {
    setIsLoading(true);
    const response = await enrollmentService.enrollInClass(classId);
    
    if (response.success) {
      toast({
        title: 'Success',
        description: 'You have been enrolled in the class!'
      });
      
      // Update the classes list to reflect enrollment
      setClasses(classes.map(cls => {
        if (cls.id === classId) {
          return {
            ...cls,
            enrolled: cls.enrolled + 1,
            availableSpots: cls.availableSpots - 1
          };
        }
        return cls;
      }));
      
      // Redirect to student dashboard after enrollment
      navigate('/student-dashboard');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Our Dance Classes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our variety of dance styles and levels. 
            From beginners to advanced dancers, we have something for everyone!
          </p>
        </div>

        {/* Classes by Level */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
          </div>
        ) : (
          Object.keys(classesByLevel).map(level => (
            <div key={level} className="mb-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                {level} Level Classes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classesByLevel[level].map(classItem => (
                  <Card key={classItem.id} className="overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <div className="h-40 bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                      <h3 className="text-2xl font-bold text-white">{classItem.name}</h3>
                    </div>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-purple-600">{classItem.level}</span>
                          <span className="text-sm font-medium">{classItem.price}</span>
                        </div>
                        <h4 className="text-lg font-semibold mb-1">{classItem.name}</h4>
                        <p className="text-gray-600 text-sm mb-2">Instructor: {classItem.instructor}</p>
                      </div>
                      
                      <div className="text-gray-600 text-sm mb-4">
                        <p><strong>Schedule:</strong> {classItem.schedule}</p>
                        <p><strong>Duration:</strong> {classItem.duration}</p>
                        <p><strong>Availability:</strong> {classItem.availableSpots}/{classItem.capacity} spots</p>
                      </div>
                      
                      <p className="text-gray-700 mb-4 text-sm line-clamp-3">{classItem.description}</p>

                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        disabled={classItem.availableSpots === 0}
                        onClick={() => handleEnroll(classItem.id)}
                      >
                        {classItem.availableSpots === 0 ? 'Class Full' : 'Enroll Now'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
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
                    <th className="py-3 px-4 font-semibold">Day</th>
                    <th className="py-3 px-4 font-semibold">Time</th>
                    <th className="py-3 px-4 font-semibold">Class</th>
                    <th className="py-3 px-4 font-semibold">Instructor</th>
                    <th className="py-3 px-4 font-semibold">Level</th>
                    <th className="py-3 px-4 font-semibold">Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((classItem) => (
                    <tr key={classItem.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">{classItem.dayOfWeek}</td>
                      <td className="py-3 px-4">{classItem.schedule.split(' ').slice(-3).join(' ')}</td>
                      <td className="py-3 px-4">{classItem.name}</td>
                      <td className="py-3 px-4">{classItem.instructor}</td>
                      <td className="py-3 px-4">{classItem.level}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          classItem.availableSpots === 0 ? 'bg-red-100 text-red-800' : 
                          classItem.availableSpots < 5 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {classItem.availableSpots === 0 ? 'Full' : 
                          `${classItem.availableSpots} spots left`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to start your dance journey?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Register Now
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
