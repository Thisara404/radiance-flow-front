import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import * as classService from '../services/classService';
import * as instructorService from '../services/instructorService';
import * as enrollmentService from '../services/enrollmentService';
import * as eventService from '../services/eventService';
import * as userService from '../services/userService';
import * as paymentService from '../services/paymentService';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Navbar from '../components/Navbar';
import PaymentSlip from '../components/PaymentSlip';
import { Calendar, Home, Contact, Users, BookOpen, ChevronRight, Plus, X, CreditCard, Receipt, RefreshCw, Eye, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  // State for holding data
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    activeClasses: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    completedPayments: 0
  });
  
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentStats, setPaymentStats] = useState(null);
  
  // Payment state
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentSlip, setShowPaymentSlip] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [refundingPayment, setRefundingPayment] = useState(null);
  
  // State for new instructor form
  const [newInstructor, setNewInstructor] = useState({
    name: '',
    specialty: '',
    experience: '',
    bio: ''
  });

  // State for new class form
  const [newClass, setNewClass] = useState({
    name: '',
    level: 'Beginner',
    instructor: '',
    schedule: '',
    duration: '60 min',
    price: '',
    description: '',
    capacity: 20
  });

  // State for new event form
  const [newEvent, setNewEvent] = useState({
    eventType: '',
    title: '',
    date: '',
    time: '',
    duration: '',
    venue: '',
    description: '',
    price: '',
    category: 'Dance choreography',
    expectedGuests: 0
  });

  // State for class enrollments
  const [classEnrollments, setClassEnrollments] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  // Add a state for event registrations
  const [eventRegistrations, setEventRegistrations] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);

  // Add state for editing events
  const [editingEvent, setEditingEvent] = useState(null);
  
  // Load data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setLoadingError(null);
        
        // Fetch all data
        await Promise.all([
          fetchInstructors(),
          fetchClassesWithEnrollments(),
          fetchEvents(),
          fetchStudents(),
          fetchPayments(),
          fetchPaymentStats()
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setLoadingError('Failed to load dashboard data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchInstructors = async () => {
    try {
      const instructorsResponse = await instructorService.getAllInstructors();
      if (instructorsResponse.success) {
        const instructorsData = instructorsResponse.data || [];
        
        setInstructors(instructorsData.map(instructor => ({
          id: instructor._id,
          name: instructor.name,
          specialty: instructor.specialty,
          experience: instructor.experience,
          bio: instructor.bio || '',
          classes: instructor.classes?.length || 0
        })));
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const fetchClassesWithEnrollments = async () => {
    try {
      const classesResponse = await classService.getAllClasses();
      const classesData = classesResponse.data || [];
      
      setClasses(classesData.map(cls => ({
        id: cls._id,
        name: cls.name,
        instructor: cls.instructor?.name || 'Unassigned',
        instructorId: cls.instructor?._id,
        level: cls.level,
        schedule: cls.schedule,
        duration: cls.duration,
        price: cls.price,
        description: cls.description || '',
        capacity: cls.capacity,
        enrolled: cls.enrolledStudents?.length || 0,
        spots: (cls.capacity - (cls.enrolledStudents?.length || 0)) || cls.capacity
      })));
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const eventsResponse = await eventService.getAllEvents();
      const eventsData = eventsResponse.data || [];
      
      setEvents(eventsData.map(event => ({
        id: event._id,
        eventType: event.eventType,
        title: event.title || event.eventType,
        date: new Date(event.date).toLocaleDateString(),
        time: event.time,
        venue: event.venue,
        organizer: event.contactPerson,
        contactEmail: event.contactEmail,
        description: event.description || '',
        status: event.status,
        category: event.category || 'Dance choreography',
        price: event.price || 'Free'
      })));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const studentsResponse = await userService.getAllUsers();
      if (studentsResponse.success) {
        const usersData = studentsResponse.data || [];
        
        setStudents(usersData
          .filter(user => user.role === 'student')
          .map(student => ({
            id: student._id,
            name: student.name,
            email: student.email,
            joinDate: new Date(student.createdAt).toLocaleDateString(),
            status: 'Active'
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: 'Error',
        description: 'Failed to load students data',
        variant: 'destructive'
      });
    }
  };

  const fetchPayments = async () => {
    try {
      const paymentsResponse = await paymentService.getAllPayments();
      if (paymentsResponse.success) {
        setPayments(paymentsResponse.data || []);
        
        // Update stats with payment data
        if (paymentsResponse.stats) {
          const paymentStats = paymentsResponse.stats;
          setStats(prev => ({
            ...prev,
            totalRevenue: paymentStats.completedAmount || 0,
            monthlyRevenue: paymentStats.totalAmount || 0,
            completedPayments: paymentsResponse.data?.filter(p => p.status === 'completed').length || 0,
            pendingPayments: paymentsResponse.data?.filter(p => p.status === 'pending').length || 0
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payments data',
        variant: 'destructive'
      });
    }
  };

  const fetchPaymentStats = async () => {
    try {
      const statsResponse = await paymentService.getPaymentStats();
      if (statsResponse.success) {
        setPaymentStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching payment stats:', error);
    }
  };

  // Update stats when data changes
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const monthlyPayments = payments.filter(p => {
      const paymentDate = new Date(p.createdAt);
      return paymentDate.getMonth() === currentMonth 
        && paymentDate.getFullYear() === currentYear 
        && p.status === 'completed';
    });

    setStats(prev => ({
      ...prev,
      totalStudents: students.length,
      totalInstructors: instructors.length,
      activeClasses: classes.length,
      pendingBookings: events.filter(e => e.status === 'Pending').length,
      monthlyRevenue: monthlyPayments.reduce((sum, p) => sum + (p.amountLKR || 0), 0)
    }));
  }, [students, instructors, classes, events, payments]);

  // Payment handlers
  const handleViewPaymentSlip = async (paymentId) => {
    try {
      const response = await paymentService.getPaymentSlip(paymentId);
      if (response.success) {
        setSelectedPayment(response.data);
        setShowPaymentSlip(true);
      }
    } catch (error) {
      console.error('Error fetching payment slip:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment slip',
        variant: 'destructive'
      });
    }
  };

  const handleRefundPayment = async () => {
    if (!refundingPayment || !refundReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a refund reason',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await paymentService.refundPayment(refundingPayment._id, refundReason);
      if (response.success) {
        // Update payments list
        setPayments(payments.map(p => 
          p._id === refundingPayment._id 
            ? { ...p, status: 'refunded', refundAmount: p.amountLKR, refundDate: new Date(), refundReason }
            : p
        ));
        
        setRefundModalOpen(false);
        setRefundingPayment(null);
        setRefundReason('');
        
        toast({
          title: 'Success',
          description: 'Payment refunded successfully'
        });
      } else {
        throw new Error(response.message || 'Refund failed');
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to process refund',
        variant: 'destructive'
      });
    }
  };

  // Handler for adding new instructor
  const handleAddInstructor = async (e) => {
    e.preventDefault();
    
    if (!newInstructor.name || !newInstructor.specialty || !newInstructor.experience) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const response = await instructorService.createInstructor(newInstructor);
      
      if (response.success === false) {
        throw new Error(response.message || 'Failed to add instructor');
      }
      
      // Add to instructors list
      setInstructors([
        ...instructors,
        {
          id: response.data._id,
          name: response.data.name,
          specialty: response.data.specialty,
          experience: response.data.experience,
          bio: response.data.bio || '',
          classes: 0
        }
      ]);
      
      // Clear form
      setNewInstructor({
        name: '',
        specialty: '',
        experience: '',
        bio: ''
      });
      
      // Show success message
      toast({
        title: 'Success',
        description: 'Instructor added successfully',
      });
    } catch (error) {
      console.error('Error adding instructor:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add instructor',
        variant: 'destructive'
      });
    }
  };

  // Handler for adding new class
  const handleAddClass = async (e) => {
    e.preventDefault();
    
    if (!newClass.name || !newClass.instructor || !newClass.schedule || !newClass.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Validate description length
    if (newClass.description && newClass.description.length > 500) {
      newClass.description = newClass.description.substring(0, 500);
      toast({
        title: "Warning",
        description: "Description has been trimmed to 500 characters",
      });
    }
    
    try {
      setIsLoading(true);
      const response = await classService.createClass({
        name: newClass.name,
        instructor: newClass.instructor,
        level: newClass.level,
        schedule: newClass.schedule,
        duration: newClass.duration || '60 min',
        price: Number(newClass.price),
        description: newClass.description,
        capacity: Number(newClass.capacity) || 20
      });
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Class created successfully"
        });
        
        // Reset form
        setNewClass({
          name: '',
          level: 'Beginner',
          instructor: '',
          schedule: '',
          duration: '60 min',
          price: '',
          description: '',
          capacity: 20
        });
        
        // Refresh classes list
        fetchClassesWithEnrollments();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create class",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error creating class:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // Handler for creating new event
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newEvent.eventType || !newEvent.title || !newEvent.date || !newEvent.time || !newEvent.venue) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields (Event Type, Title, Date, Time, Venue)',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Format the event data properly
      const formattedEvent = {
        eventType: newEvent.eventType,
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        venue: newEvent.venue,
        duration: newEvent.duration || '',
        description: newEvent.description || '',
        price: newEvent.price || '0',
        category: newEvent.category || 'Dance choreography',
        expectedGuests: parseInt(newEvent.expectedGuests) || 0,
        contactPerson: user?.name || 'Admin',
        contactEmail: user?.email || 'admin@radiancedance.com',
        status: 'Approved' // Auto-approve admin-created events
      };

      console.log('Sending event data:', formattedEvent);
      
      let response;
      
      // Check if we're editing or creating
      if (editingEvent) {
        response = await eventService.updateEvent(editingEvent.id, formattedEvent);
      } else {
        response = await eventService.createEvent(formattedEvent);
      }
      
      if (response.success) {
        if (editingEvent) {
          // Update existing event in the list
          setEvents(events.map(event => 
            event.id === editingEvent.id 
              ? {
                  ...event,
                  eventType: response.data.eventType,
                  title: response.data.title,
                  date: new Date(response.data.date).toLocaleDateString(),
                  time: response.data.time,
                  venue: response.data.venue,
                  organizer: response.data.contactPerson,
                  contactEmail: response.data.contactEmail,
                  description: response.data.description || '',
                  status: response.data.status,
                  category: response.data.category || 'Dance choreography',
                  price: response.data.price || 'Free'
                }
              : event
          ));
          
          toast({
            title: 'Success',
            description: 'Event updated successfully',
          });
        } else {
          // Add new event to the list
          setEvents([
            ...events,
            {
              id: response.data._id,
              eventType: response.data.eventType,
              title: response.data.title,
              date: new Date(response.data.date).toLocaleDateString(),
              time: response.data.time,
              venue: response.data.venue,
              organizer: response.data.contactPerson,
              contactEmail: response.data.contactEmail,
              description: response.data.description || '',
              status: response.data.status,
              category: response.data.category || 'Dance choreography',
              price: response.data.price || 'Free'
            }
          ]);
          
          toast({
            title: 'Success',
            description: 'Event created successfully',
          });
        }
        
        // Clear form and reset editing state
        setNewEvent({
          eventType: '',
          title: '',
          date: '',
          time: '',
          duration: '',
          venue: '',
          description: '',
          price: '',
          category: 'Dance choreography',
          expectedGuests: 0
        });
        
        setEditingEvent(null);
        setEventModalOpen(false);
      } else {
        throw new Error(response.message || 'Failed to save event');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to save event',
        variant: 'destructive'
      });
    }
  };

  // Add function to handle editing
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    
    // Populate form with event data
    setNewEvent({
      eventType: event.eventType,
      title: event.title,
      date: new Date(event.date).toISOString().split('T')[0], // Format for date input
      time: event.time,
      duration: event.duration || '',
      venue: event.venue,
      description: event.description || '',
      price: event.price === 'Free' ? '' : event.price,
      category: event.category || 'Dance choreography',
      expectedGuests: event.expectedGuests || 0
    });
    
    setEventModalOpen(true);
  };

  // Handler to view class enrollments
  const handleViewEnrollments = async (classId) => {
    try {
      const response = await enrollmentService.getClassEnrollments(classId);
      
      if (response.success) {
        const classData = classes.find(c => c.id === classId);
        
        if (classData) {
          const updatedClass = {
            ...classData,
            enrollments: response.data
          };
          
          setSelectedClass(updatedClass);
          setEnrollmentModalOpen(true);
          
          // Also update in the classes array for future reference
          setClasses(classes.map(c => c.id === classId ? updatedClass : c));
        }
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load enrolled students',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error fetching class enrollments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load enrolled students',
        variant: 'destructive'
      });
    }
  };

  // Add function to fetch registrations for an event
  const handleViewRegistrations = async (eventId) => {
    try {
      const response = await eventService.getEventRegistrations(eventId);
      
      if (response.success) {
        const eventData = events.find(e => e.id === eventId);
        
        if (eventData) {
          const updatedEvent = {
            ...eventData,
            registrations: response.data
          };
          
          setSelectedEvent(updatedEvent);
          setRegistrationModalOpen(true);
          
          // Also update in the events array for future reference
          setEvents(events.map(e => e.id === eventId ? updatedEvent : e));
        }
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load event registrations',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error fetching event registrations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load event registrations',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
      case 'Approved':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
      case 'Under Review':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
      case 'Rejected':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper for input change handlers
  const handleInputChange = (setter, prev, field, value) => {
    setter({ ...prev, [field]: value });
  };

  // Content for each tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{stats.totalStudents}</div>
                      <div className="text-purple-100">Total Students</div>
                    </div>
                    <Users className="text-purple-200" size={32} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{stats.totalInstructors}</div>
                      <div className="text-pink-100">Instructors</div>
                    </div>
                    <Contact className="text-pink-200" size={32} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{stats.activeClasses}</div>
                      <div className="text-orange-100">Active Classes</div>
                    </div>
                    <BookOpen className="text-orange-200" size={32} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">Rs. {stats.totalRevenue.toLocaleString()}</div>
                      <div className="text-green-100">Total Revenue</div>
                    </div>
                    <DollarSign className="text-green-200" size={32} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">Rs. {stats.monthlyRevenue.toLocaleString()}</div>
                      <div className="text-blue-100">Monthly Revenue</div>
                    </div>
                    <Calendar className="text-blue-200" size={32} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{stats.completedPayments}</div>
                      <div className="text-indigo-100">Completed Payments</div>
                    </div>
                    <Receipt className="text-indigo-200" size={32} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{stats.pendingPayments}</div>
                      <div className="text-yellow-100">Pending Payments</div>
                    </div>
                    <CreditCard className="text-yellow-200" size={32} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button 
                    onClick={() => setActiveTab('instructors')} 
                    className="h-20 flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    <Users className="mb-2" size={24} />
                    Add New Instructor
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('classes')}
                    className="h-20 flex flex-col items-center justify-center" 
                    variant="outline"
                  >
                    <Calendar className="mb-2" size={24} />
                    Add New Class
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('events')}
                    className="h-20 flex flex-col items-center justify-center" 
                    variant="outline"
                  >
                    <BookOpen className="mb-2" size={24} />
                    Manage Events
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('payments')}
                    className="h-20 flex flex-col items-center justify-center" 
                    variant="outline"
                  >
                    <CreditCard className="mb-2" size={24} />
                    View Payments
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Classes */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Active Classes</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('classes')} className="flex items-center">
                    View all <ChevronRight size={16} className="ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {classes.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">No classes created yet</div>
                  ) : (
                    <div className="space-y-3">
                      {classes.slice(0, 3).map((cls) => (
                        <div key={cls.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{cls.name}</div>
                            <div className="text-sm text-gray-600">{cls.instructor} • {cls.schedule}</div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {cls.enrolled}/{cls.capacity}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Payments */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Recent Payments</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('payments')} className="flex items-center">
                    View all <ChevronRight size={16} className="ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">No payments yet</div>
                  ) : (
                    <div className="space-y-3">
                      {payments.slice(0, 3).map((payment) => (
                        <div key={payment._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">Rs. {payment.amountLKR?.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">
                              {payment.user?.name} • {payment.itemType}
                            </div>
                          </div>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            {/* Payment Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-green-600">
                    Rs. {payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amountLKR || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-gray-600">Completed Payments</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-yellow-600">
                    Rs. {payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amountLKR || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-gray-600">Pending Payments</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-red-600">
                    Rs. {payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + (p.refundAmount || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-gray-600">Refunded Amount</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600">{payments.length}</div>
                  <div className="text-gray-600">Total Transactions</div>
                </CardContent>
              </Card>
            </div>

            {/* Payments List */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Payments</CardTitle>
                <Button onClick={() => fetchPayments()} variant="outline" size="sm">
                  <RefreshCw size={16} className="mr-2" />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No payments found</div>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-lg">Rs. {payment.amountLKR?.toLocaleString()}</h3>
                              <Badge className={getStatusColor(payment.status)}>
                                {payment.status.toUpperCase()}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <p><strong>Customer:</strong> {payment.user?.name || 'N/A'}</p>
                                <p><strong>Email:</strong> {payment.user?.email || 'N/A'}</p>
                                <p><strong>Transaction ID:</strong> {payment.paypalCaptureId || payment.paypalOrderId || 'N/A'}</p>
                              </div>
                              <div>
                                <p><strong>Type:</strong> {payment.itemType}</p>
                                <p><strong>Item:</strong> {payment.itemId?.name || payment.description || 'N/A'}</p>
                                <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleDateString()}</p>
                                <p><strong>USD Amount:</strong> ${payment.amount}</p>
                              </div>
                            </div>

                            {payment.status === 'refunded' && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                                <p className="text-red-800 text-sm">
                                  <strong>Refunded:</strong> Rs. {payment.refundAmount?.toLocaleString()} on {new Date(payment.refundDate).toLocaleDateString()}
                                </p>
                                {payment.refundReason && (
                                  <p className="text-red-700 text-sm mt-1">
                                    <strong>Reason:</strong> {payment.refundReason}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col space-y-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewPaymentSlip(payment._id)}
                            >
                              <Eye size={14} className="mr-1" />
                              View Receipt
                            </Button>
                            
                            {payment.status === 'completed' && payment.canRefund && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-300 hover:bg-red-50"
                                onClick={() => {
                                  setRefundingPayment(payment);
                                  setRefundModalOpen(true);
                                }}
                              >
                                Process Refund
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'students':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading students...</div>
              ) : students.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No students registered yet</div>
              ) : (
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <p className="text-sm text-gray-600">Joined: {student.joinDate}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(student.status)}`}>
                          {student.status}
                        </span>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'instructors':
        return (
          <div className="space-y-6">
            {/* Add Instructor Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddInstructor} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input 
                        id="name" 
                        value={newInstructor.name} 
                        onChange={(e) => handleInputChange(setNewInstructor, newInstructor, 'name', e.target.value)}
                        placeholder="Enter instructor's full name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty *</Label>
                      <Input 
                        id="specialty" 
                        value={newInstructor.specialty} 
                        onChange={(e) => handleInputChange(setNewInstructor, newInstructor, 'specialty', e.target.value)}
                        placeholder="E.g., Ballet, Contemporary, Hip-Hop"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience *</Label>
                      <Input 
                        id="experience" 
                        value={newInstructor.experience} 
                        onChange={(e) => handleInputChange(setNewInstructor, newInstructor, 'experience', e.target.value)}
                        placeholder="E.g., 5 years"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea 
                      id="bio"
                      value={newInstructor.bio}
                      onChange={(e) => handleInputChange(setNewInstructor, newInstructor, 'bio', e.target.value)}
                      placeholder="Professional background, achievements, teaching philosophy..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Add Instructor
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* Instructors List */}
            <Card>
              <CardHeader>
                <CardTitle>Current Instructors</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Loading instructors...</div>
                ) : instructors.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">No instructors added yet</div>
                ) : (
                  <div className="space-y-4">
                    {instructors.map((instructor) => (
                      <div key={instructor.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{instructor.name}</h3>
                          <p className="text-sm text-gray-600">Specialty: {instructor.specialty}</p>
                          <p className="text-sm text-gray-600">Experience: {instructor.experience}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-center">
                            <div className="font-medium">{instructor.classes}</div>
                            <div className="text-sm text-gray-600">Classes</div>
                          </div>
                          <Button variant="outline" size="sm">View Profile</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'classes':
        return (
          <div className="space-y-6">
            {/* Add Class Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Class</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddClass} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Class Name *</Label>
                      <Input 
                        id="name" 
                        value={newClass.name} 
                        onChange={(e) => handleInputChange(setNewClass, newClass, 'name', e.target.value)} 
                        placeholder="Enter class name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="level">Level *</Label>
                      <Select 
                        value={newClass.level} 
                        onValueChange={(value) => handleInputChange(setNewClass, newClass, 'level', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="All Levels">All Levels</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instructor">Instructor *</Label>
                      <Select 
                        value={newClass.instructor} 
                        onValueChange={(value) => handleInputChange(setNewClass, newClass, 'instructor', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select instructor" />
                        </SelectTrigger>
                        <SelectContent>
                          {instructors.map(instructor => (
                            <SelectItem key={instructor.id} value={instructor.id}>
                              {instructor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="schedule">Schedule *</Label>
                      <Input 
                        id="schedule" 
                        value={newClass.schedule} 
                        onChange={(e) => handleInputChange(setNewClass, newClass, 'schedule', e.target.value)}
                        placeholder="E.g., Mon/Wed 6:00 PM - 7:00 PM"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input 
                        id="duration" 
                        value={newClass.duration} 
                        onChange={(e) => handleInputChange(setNewClass, newClass, 'duration', e.target.value)}
                        placeholder="E.g., 60 minutes"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <Input 
                        id="price" 
                        value={newClass.price} 
                        onChange={(e) => handleInputChange(setNewClass, newClass, 'price', e.target.value)}
                        placeholder="E.g., 12000"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input 
                        id="capacity" 
                        type="number"
                        value={newClass.capacity} 
                        onChange={(e) => handleInputChange(setNewClass, newClass, 'capacity', e.target.value)}
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id="description"
                      value={newClass.description}
                      onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                      className="mt-1 p-2 w-full border rounded-md"
                      placeholder="Class description"
                      rows={4}
                      maxLength={500}
                    ></textarea>
                    <div className="mt-1 text-xs text-gray-500 flex justify-end">
                      {newClass.description?.length || 0}/500 characters
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Add Class
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* Classes List */}
            <Card>
              <CardHeader>
                <CardTitle>Current Classes</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Loading classes...</div>
                ) : classes.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">No classes added yet</div>
                ) : (
                  <div className="space-y-4">
                    {classes.map((cls) => (
                      <div key={cls.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{cls.name}</h3>
                          <p className="text-sm text-gray-600">Instructor: {cls.instructor}</p>
                          <p className="text-sm text-gray-600">Schedule: {cls.schedule}</p>
                          <p className="text-sm text-gray-600">Level: {cls.level}</p>
                          <p className="text-sm text-gray-600">Price: Rs. {cls.price?.toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="text-center mb-2">
                            <div className="font-medium">{cls.enrolled}/{cls.capacity}</div>
                            <div className="text-sm text-gray-600">Students</div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewEnrollments(cls.id)}
                            >
                              View Students
                            </Button>
                            <Button variant="outline" size="sm">Edit Class</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enrollment Modal */}
            {enrollmentModalOpen && selectedClass && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="absolute inset-0 bg-black/50" onClick={() => setEnrollmentModalOpen(false)}></div>
                <div className="relative bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-auto">
                  <div className="sticky top-0 bg-white p-6 border-b">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">{selectedClass.name} - Enrolled Students</h2>
                      <button 
                        onClick={() => setEnrollmentModalOpen(false)}
                        className="text-gray-500 hover:text-gray-800"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <p className="text-gray-600">
                      {selectedClass.enrolled}/{selectedClass.capacity} enrolled | Instructor: {selectedClass.instructor}
                    </p>
                  </div>
                  <div className="p-6">
                    {selectedClass.enrollments?.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No students enrolled in this class yet</p>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 font-medium border-b pb-2">
                          <div>Student Name</div>
                          <div>Email</div>
                          <div>Enrollment Date</div>
                          <div>Status</div>
                        </div>
                        {selectedClass.enrollments?.map((enrollment) => (
                          <div key={enrollment._id} className="grid grid-cols-4 py-2 border-b">
                            <div>{enrollment.student.name}</div>
                            <div className="text-gray-600">{enrollment.student.email}</div>
                            <div>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</div>
                            <div>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                enrollment.status === 'active' ? 'bg-green-100 text-green-800' :
                                enrollment.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'events':
        return (
          <div className="space-y-6">
            {/* Add Event Button */}
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold">Event Management</h2>
              <Button 
                onClick={() => {
                  setEditingEvent(null);
                  setNewEvent({
                    eventType: '',
                    title: '',
                    date: '',
                    time: '',
                    duration: '',
                    venue: '',
                    description: '',
                    price: '',
                    category: 'Dance choreography',
                    expectedGuests: 0
                  });
                  setEventModalOpen(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <Plus className="mr-2" size={16} />
                Create New Event
              </Button>
            </div>
            
            {/* Event listing */}
            <Card>
              <CardHeader>
                <CardTitle>All Events</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Loading events...</div>
                ) : events.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">No events created yet</div>
                ) : (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium text-lg">{event.title || event.eventType}</h3>
                            <p className="text-gray-600">Type: {event.eventType}</p>
                            <div className="flex items-center mt-1 text-sm text-gray-600 space-x-3">
                              <span className="flex items-center">
                                <Calendar className="mr-1" size={14} />
                                {event.date}
                              </span>
                              <span>{event.time}</span>
                              <span>Venue: {event.venue}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`mb-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                              {event.status}
                            </span>
                            <div className="text-sm text-gray-600">
                              Category: {event.category || 'Uncategorized'}
                            </div>
                          </div>
                        </div>
                        
                        {event.description && (
                          <p className="text-sm text-gray-700 my-2">{event.description}</p>
                        )}
                        
                        <div className="flex justify-between items-center mt-3 pt-3 border-t">
                          <div className="text-sm text-gray-600">
                            {event.price && <span className="font-semibold">Price: {event.price}</span>}
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditEvent(event)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this event?')) {
                                  try {
                                    await eventService.deleteEvent(event.id);
                                    setEvents(events.filter(e => e.id !== event.id));
                                    toast({
                                      title: 'Success',
                                      description: 'Event deleted successfully'
                                    });
                                  } catch (error) {
                                    toast({
                                      title: 'Error',
                                      description: 'Failed to delete event',
                                      variant: 'destructive'
                                    });
                                  }
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>

                        {/* Button to view registrations */}
                        <div className="mt-4">
                          <Button 
                            variant="outline"
                            size="sm" 
                            onClick={() => handleViewRegistrations(event.id)}
                          >
                            View Registrations
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Create Event Modal */}
            <Dialog open={eventModalOpen} onOpenChange={setEventModalOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                  <DialogDescription>
                    {editingEvent ? 'Update the event details below.' : 'Fill in the details below to create a new event for the academy.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateEvent} className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type *</Label>
                      <Select 
                        value={newEvent.eventType} 
                        onValueChange={(value) => handleInputChange(setNewEvent, newEvent, 'eventType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Recital">Recital</SelectItem>
                          <SelectItem value="Workshop">Workshop</SelectItem>
                          <SelectItem value="Competition">Competition</SelectItem>
                          <SelectItem value="Special Class">Special Class</SelectItem>
                          <SelectItem value="Performance">Performance</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select 
                        value={newEvent.category} 
                        onValueChange={(value) => handleInputChange(setNewEvent, newEvent, 'category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Recital">Recital</SelectItem>
                          <SelectItem value="Workshop">Workshop</SelectItem>
                          <SelectItem value="Competition">Competition</SelectItem>
                          <SelectItem value="Special Class">Special Class</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="title">Event Title *</Label>
                      <Input 
                        id="title" 
                        value={newEvent.title} 
                        onChange={(e) => handleInputChange(setNewEvent, newEvent, 'title', e.target.value)} 
                        placeholder="Enter event title"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date">Event Date *</Label>
                      <Input 
                        id="date" 
                        type="date" 
                        value={newEvent.date} 
                        onChange={(e) => handleInputChange(setNewEvent, newEvent, 'date', e.target.value)} 
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time">Event Time *</Label>
                      <Input 
                        id="time" 
                        value={newEvent.time} 
                        onChange={(e) => handleInputChange(setNewEvent, newEvent, 'time', e.target.value)} 
                        placeholder="e.g., 7:00 PM - 9:00 PM"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="venue">Venue *</Label>
                      <Input 
                        id="venue" 
                        value={newEvent.venue} 
                        onChange={(e) => handleInputChange(setNewEvent, newEvent, 'venue', e.target.value)} 
                        placeholder="Event location"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input 
                        id="duration" 
                        value={newEvent.duration} 
                        onChange={(e) => handleInputChange(setNewEvent, newEvent, 'duration', e.target.value)} 
                        placeholder="e.g., 2 hours"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Price/Fee</Label>
                      <Input 
                        id="price" 
                        value={newEvent.price} 
                        onChange={(e) => handleInputChange(setNewEvent, newEvent, 'price', e.target.value)} 
                        placeholder="e.g., $25 per person, Free"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="expectedGuests">Expected Capacity</Label>
                      <Input 
                        id="expectedGuests"
                        type="number"
                        value={newEvent.expectedGuests} 
                        onChange={(e) => handleInputChange(setNewEvent, newEvent, 'expectedGuests', e.target.value)} 
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Create Event
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Registration Modal */}
            {registrationModalOpen && selectedEvent && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="absolute inset-0 bg-black/50" onClick={() => setRegistrationModalOpen(false)}></div>
                <div className="relative bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-auto">
                  <div className="sticky top-0 bg-white p-6 border-b">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold">{selectedEvent.title} - Registrations</h2>
                      <Button variant="ghost" size="sm" onClick={() => setRegistrationModalOpen(false)}>
                        <X size={18} />
                      </Button>
                    </div>
                    <p className="text-gray-600">
                      Date: {selectedEvent.date} | Venue: {selectedEvent.venue}
                    </p>
                  </div>
                  <div className="p-6">
                    {!selectedEvent.registrations || selectedEvent.registrations.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No registrations for this event yet</p>
                    ) : (
                      <div className="space-y-4">
                        {selectedEvent.registrations.map((registration) => (
                          <div key={registration._id} className="p-4 border rounded-lg">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium">{registration.user.name}</h4>
                                <p className="text-gray-600">{registration.user.email}</p>
                                <p className="text-gray-600">Registered: {new Date(registration.registrationDate).toLocaleDateString()}</p>
                              </div>
                              <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                                registration.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Navbar />
      
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        {/* Tab navigation */}
        <div className="mb-4">
          <div className="flex space-x-2">
            <Button 
              onClick={() => setActiveTab('overview')} 
              className={`flex-1 ${activeTab === 'overview' ? 'bg-purple-600 text-white' : 'bg-white text-gray-800'}`}
            >
              Overview
            </Button>
            <Button 
              onClick={() => setActiveTab('students')} 
              className={`flex-1 ${activeTab === 'students' ? 'bg-purple-600 text-white' : 'bg-white text-gray-800'}`}
            >
              Students
            </Button>
            <Button 
              onClick={() => setActiveTab('instructors')} 
              className={`flex-1 ${activeTab === 'instructors' ? 'bg-purple-600 text-white' : 'bg-white text-gray-800'}`}
            >
              Instructors
            </Button>
            <Button 
              onClick={() => setActiveTab('classes')} 
              className={`flex-1 ${activeTab === 'classes' ? 'bg-purple-600 text-white' : 'bg-white text-gray-800'}`}
            >
              Classes
            </Button>
            <Button 
              onClick={() => setActiveTab('events')} 
              className={`flex-1 ${activeTab === 'events' ? 'bg-purple-600 text-white' : 'bg-white text-gray-800'}`}
            >
              Events
            </Button>
            <Button 
              onClick={() => setActiveTab('payments')} 
              className={`flex-1 ${activeTab === 'payments' ? 'bg-purple-600 text-white' : 'bg-white text-gray-800'}`}
            >
              Payments
            </Button>
          </div>
        </div>
        
        {/* Tab content */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 lg:p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
