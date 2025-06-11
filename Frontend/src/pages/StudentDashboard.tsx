import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { User, Plus, CreditCard, Calendar, Receipt, Eye, X, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import PaymentSlip from '../components/PaymentSlip';
import * as enrollmentService from '../services/enrollmentService';
import * as classService from '../services/classService';
import * as userService from '../services/userService';
import * as eventService from '../services/eventService';
import * as paymentService from '../services/paymentService';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    emergencyContact: ''
  });
  
  // Classes and events state
  const [availableClasses, setAvailableClasses] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  
  // Payment state
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentSlip, setShowPaymentSlip] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [cancellingPayment, setCancellingPayment] = useState(null);
  const [requestingRefund, setRequestingRefund] = useState(null);
  const [refundReason, setRefundReason] = useState('');
  const [showRefundModal, setShowRefundModal] = useState(false);

  // Check for payment success/failure on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const paymentStatus = urlParams.get('payment');
    const paymentId = urlParams.get('paymentId');
    const token = urlParams.get('token');
    
    if (paymentStatus === 'success') {
      console.log('Payment success detected:', { paymentId, token });
      
      toast({
        title: 'Payment Successful!',
        description: 'Your payment has been processed successfully and you have been enrolled!',
        duration: 5000
      });
      
      // Clear URL parameters
      window.history.replaceState({}, '', '/student-dashboard');
      
      // Refresh all data to show updated status
      setTimeout(() => {
        fetchEnrolledClasses();
        fetchPaymentHistory();
        fetchAvailableClasses();
        fetchRegisteredEvents();
      }, 1000);
    } else if (paymentStatus === 'cancelled') {
      toast({
        title: 'Payment Cancelled',
        description: 'Your payment was cancelled.',
        variant: 'destructive'
      });
      window.history.replaceState({}, '', '/student-dashboard');
    }
  }, [location]);

  // Fetch data on component mount
  useEffect(() => {
    if (user) {
      fetchEnrolledClasses();
      fetchUserProfile();
      fetchRegisteredEvents();
      fetchPaymentHistory();
      fetchAvailableClasses();
    }
  }, [user]);

  const fetchAvailableClasses = async () => {
    try {
      const classesResponse = await classService.getAllClasses();
      if (classesResponse.success) {
        // Get enrolled class IDs to filter them out
        const enrolledClassIds = enrolledClasses.map(cls => cls._id || cls.id);
        
        const available = classesResponse.data.filter(cls => 
          !enrolledClassIds.includes(cls._id)
        );
        
        setAvailableClasses(available.map(cls => ({
          id: cls._id,
          name: cls.name,
          instructor: cls.instructor,
          level: cls.level,
          schedule: cls.schedule,
          price: cls.price,
          description: cls.description,
          capacity: cls.capacity,
          spots: cls.capacity - (cls.enrollments || 0)
        })));
      }
    } catch (error) {
      console.error('Error fetching available classes:', error);
    }
  };

  const fetchEnrolledClasses = async () => {
    try {
      setIsLoading(true);
      const enrollmentsResponse = await enrollmentService.getMyEnrollments();
      
      if (enrollmentsResponse.success) {
        console.log('Enrolled classes response:', enrollmentsResponse.data);
        
        setEnrolledClasses(enrollmentsResponse.data.map(enrollment => ({
          ...enrollment.class,
          enrollmentStatus: enrollment.status,
          paymentStatus: enrollment.paymentStatus,
          enrollmentDate: enrollment.enrollmentDate,
          enrollmentId: enrollment._id
        })));
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

  const fetchUserProfile = async () => {
    try {
      const response = await userService.getMyProfile();
      if (response.success && response.data) {
        setUserProfile(prev => ({
          ...prev,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone || '',
          emergencyContact: response.data.emergencyContact || ''
        }));
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
        setRegisteredEvents(response.data);
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

  const fetchPaymentHistory = async () => {
    try {
      setPaymentLoading(true);
      const response = await paymentService.getMyPaymentHistory();
      if (response.success) {
        console.log('Payment history response:', response.data);
        setPaymentHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment history',
        variant: 'destructive'
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePayForClass = async (classInfo) => {
    try {
      setIsLoading(true);
      
      // Create payment order
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
      setIsLoading(false);
    }
  };

  const handlePayForEvent = async (eventInfo) => {
    try {
      setEventsLoading(true);
      
      // Create payment order
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
      setEventsLoading(false);
    }
  };

  const handleCancelPayment = async (paymentId) => {
    if (!window.confirm('Are you sure you want to cancel this pending payment?')) {
      return;
    }

    try {
      setCancellingPayment(paymentId);
      
      // Use the new cancel endpoint instead of updatePaymentStatus
      const response = await paymentService.cancelMyPayment(paymentId);
      
      if (response.success) {
        toast({
          title: 'Payment Cancelled',
          description: 'The payment has been cancelled successfully.'
        });
        
        // Refresh payment history
        fetchPaymentHistory();
      }
    } catch (error) {
      console.error('Error cancelling payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel payment',
        variant: 'destructive'
      });
    } finally {
      setCancellingPayment(null);
    }
  };

  const handleRequestRefund = (payment) => {
    setRequestingRefund(payment);
    setShowRefundModal(true);
  };

  const handleSubmitRefund = async () => {
    if (!refundReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for the refund',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await paymentService.refundPayment(requestingRefund._id, refundReason);
      
      if (response.success) {
        toast({
          title: 'Refund Requested',
          description: 'Your refund request has been submitted and will be processed by our team.'
        });
        
        setShowRefundModal(false);
        setRefundReason('');
        setRequestingRefund(null);
        
        // Refresh payment history
        fetchPaymentHistory();
      }
    } catch (error) {
      console.error('Error requesting refund:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit refund request',
        variant: 'destructive'
      });
    }
  };

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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await userService.updateMyProfile(userProfile);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully'
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'dropped':
        return 'bg-red-100 text-red-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isClassPaid = (classId) => {
    const payment = paymentHistory.find(p => 
      p.itemType === 'class' && 
      p.itemId?._id === classId && 
      p.status === 'completed'
    );
    return !!payment;
  };

  const isEventPaid = (eventId) => {
    const payment = paymentHistory.find(p => 
      p.itemType === 'event' && 
      p.itemId?._id === eventId && 
      p.status === 'completed'
    );
    return !!payment;
  };

  // Tab content rendering
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    <Input
                      id="emergency"
                      value={userProfile.emergencyContact}
                      onChange={(e) => setUserProfile({...userProfile, emergencyContact: e.target.value})}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        );

      case 'classes':
        return (
          <div className="space-y-6">
            {/* Enrolled Classes */}
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
                    <p className="text-gray-500">You haven't enrolled in any classes yet</p>
                    <Button 
                      onClick={() => navigate('/classes')}
                      className="bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      Browse Classes
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrolledClasses.map((cls) => (
                      <div key={cls._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{cls.name}</h3>
                            <p className="text-gray-600">Instructor: {cls.instructor}</p>
                            <p className="text-gray-600">Schedule: {cls.schedule}</p>
                            <p className="text-gray-600">Level: {cls.level}</p>
                            <p className="text-gray-600">
                              Enrolled: {new Date(cls.enrollmentDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right space-y-2">
                            <Badge className={getStatusColor(cls.enrollmentStatus)}>
                              {cls.enrollmentStatus}
                            </Badge>
                            <Badge variant="outline" className={cls.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                              Payment: {cls.paymentStatus || 'pending'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Available Classes */}
            <Card>
              <CardHeader>
                <CardTitle>Available Classes</CardTitle>
              </CardHeader>
              <CardContent>
                {availableClasses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No available classes to enroll</p>
                ) : (
                  <div className="space-y-4">
                    {availableClasses.map((cls) => {
                      const isPaid = isClassPaid(cls.id);
                      return (
                        <div key={cls.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{cls.name}</h3>
                              <p className="text-gray-600">Instructor: {cls.instructor}</p>
                              <p className="text-gray-600">Schedule: {cls.schedule}</p>
                              <p className="text-gray-600">Level: {cls.level}</p>
                              <p className="text-gray-600">Price: Rs. {cls.price?.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-green-600 mb-2">
                                {cls.spots} spots available
                              </p>
                              {isPaid ? (
                                <Badge className="bg-green-100 text-green-800">
                                  Paid ✓
                                </Badge>
                              ) : (
                                <Button 
                                  onClick={() => handlePayForClass(cls)}
                                  disabled={isLoading || cls.spots === 0}
                                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                                  size="sm"
                                >
                                  {isLoading ? 'Processing...' : cls.spots === 0 ? 'Class Full' : `Pay Rs. ${cls.price?.toLocaleString()}`}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'payments':
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payment History</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchPaymentHistory}
                disabled={paymentLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${paymentLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {paymentLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                  <p className="mt-2">Loading payment history...</p>
                </div>
              ) : paymentHistory.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                  <p className="text-gray-500">No payment history found</p>
                  <Button 
                    onClick={() => navigate('/classes')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    Enroll in Classes
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div key={payment._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{payment.description}</h3>
                          <p className="text-gray-600">
                            {payment.itemType && payment.itemId ? 
                              `${payment.itemType}: ${payment.itemId.name}` : 
                              payment.itemType
                            }
                          </p>
                          <p className="text-gray-600">
                            Date: {new Date(payment.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-lg font-bold">
                            Rs. {payment.amountLKR?.toLocaleString() || 0}
                          </p>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status.toUpperCase()}
                          </Badge>
                          <div className="flex flex-col space-y-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewPaymentSlip(payment._id)}
                            >
                              <Eye className="mr-2" size={14} />
                              View Receipt
                            </Button>
                            
                            {/* Cancel button for pending payments */}
                            {payment.status === 'pending' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 border-red-300 hover:bg-red-50"
                                onClick={() => handleCancelPayment(payment._id)}
                                disabled={cancellingPayment === payment._id}
                              >
                                {cancellingPayment === payment._id ? (
                                  <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-2"></div>
                                    Cancelling...
                                  </>
                                ) : (
                                  <>
                                    <X className="mr-2" size={14} />
                                    Cancel
                                  </>
                                )}
                              </Button>
                            )}
                            
                            {/* Refund button for completed payments within refund window */}
                            {payment.status === 'completed' && payment.canRefund && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-orange-600 border-orange-300 hover:bg-orange-50"
                                onClick={() => handleRequestRefund(payment)}
                              >
                                Request Refund
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                  <p className="text-gray-500">You haven't registered for any events yet</p>
                  <Button 
                    onClick={() => navigate('/events')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    Browse Events
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {registeredEvents.map((registration) => {
                    const isPaid = isEventPaid(registration.event._id);
                    return (
                      <div key={registration._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{registration.event.title}</h3>
                            <p className="text-gray-600">Date: {new Date(registration.event.date).toLocaleDateString()}</p>
                            <p className="text-gray-600">Time: {registration.event.time}</p>
                            <p className="text-gray-600">Venue: {registration.event.venue}</p>
                          </div>
                          <div className="text-right space-y-2">
                            <Badge className={getStatusColor(registration.status)}>
                              {registration.status}
                            </Badge>
                            {isPaid && (
                              <Badge className="bg-green-100 text-green-800">
                                Paid ✓
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return <div>Select a tab</div>;
    }
  };

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User
    },
    {
      id: 'classes',
      label: 'Classes',
      icon: Calendar
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard
    },
    {
      id: 'events',
      label: 'Events',
      icon: Calendar
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-purple-600'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Payment Slip Modal */}
        {showPaymentSlip && selectedPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Payment Receipt</h2>
                <Button variant="ghost" onClick={() => setShowPaymentSlip(false)}>
                  ×
                </Button>
              </div>
              <PaymentSlip payment={selectedPayment} />
            </div>
          </div>
        )}

        {/* Refund Request Modal */}
        {showRefundModal && requestingRefund && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Request Refund</h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-gray-600">Payment: {requestingRefund.description}</p>
                  <p className="text-gray-600">Amount: Rs. {requestingRefund.amountLKR?.toLocaleString()}</p>
                </div>
                <div>
                  <Label htmlFor="refundReason">Reason for refund</Label>
                  <textarea
                    id="refundReason"
                    className="w-full mt-1 p-2 border rounded-md"
                    rows={3}
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="Please provide a reason for the refund request..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowRefundModal(false);
                      setRefundReason('');
                      setRequestingRefund(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitRefund}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Submit Refund Request
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
