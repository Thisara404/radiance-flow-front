
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import { Calendar, Home, Contact, Plus } from 'lucide-react';

export default function EventOrganizerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Form state for new booking
  const [eventForm, setEventForm] = useState({
    eventType: '',
    date: '',
    time: '',
    duration: '',
    venue: '',
    expectedGuests: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    description: ''
  });

  // Mock data for existing bookings
  const bookings = [
    {
      id: 1,
      eventType: 'Wedding Dance',
      date: '2024-03-15',
      time: '7:00 PM',
      venue: 'Grand Ballroom',
      status: 'Approved',
      contactPerson: 'Sarah Johnson'
    },
    {
      id: 2,
      eventType: 'Corporate Event',
      date: '2024-03-22',
      time: '6:00 PM',
      venue: 'Conference Center',
      status: 'Pending',
      contactPerson: 'Mike Davis'
    },
    {
      id: 3,
      eventType: 'Birthday Party',
      date: '2024-03-10',
      time: '3:00 PM',
      venue: 'Private Studio',
      status: 'Rejected',
      contactPerson: 'Emma Wilson'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setEventForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = ['eventType', 'date', 'time', 'venue', 'contactPerson', 'contactEmail'];
    const missingFields = requiredFields.filter(field => !eventForm[field as keyof typeof eventForm]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Booking Submitted",
      description: "Your event booking request has been submitted for review!"
    });

    // Reset form
    setEventForm({
      eventType: '',
      date: '',
      time: '',
      duration: '',
      venue: '',
      expectedGuests: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      description: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'bookings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>My Event Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{booking.eventType}</h3>
                        <p className="text-gray-600">Contact: {booking.contactPerson}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Date:</strong> {booking.date}
                      </div>
                      <div>
                        <strong>Time:</strong> {booking.time}
                      </div>
                      <div>
                        <strong>Venue:</strong> {booking.venue}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'new-booking':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Book New Event</CardTitle>
              <p className="text-gray-600">Fill out the form below to request a new event booking</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitBooking} className="space-y-6">
                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventType">Event Type *</Label>
                    <Select value={eventForm.eventType} onValueChange={(value) => handleInputChange('eventType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wedding">Wedding Dance</SelectItem>
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                        <SelectItem value="birthday">Birthday Party</SelectItem>
                        <SelectItem value="anniversary">Anniversary</SelectItem>
                        <SelectItem value="recital">Dance Recital</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="venue">Preferred Venue *</Label>
                    <Select value={eventForm.venue} onValueChange={(value) => handleInputChange('venue', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select venue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main-studio">Main Studio</SelectItem>
                        <SelectItem value="private-studio">Private Studio</SelectItem>
                        <SelectItem value="grand-ballroom">Grand Ballroom</SelectItem>
                        <SelectItem value="outdoor-space">Outdoor Space</SelectItem>
                        <SelectItem value="client-venue">Client's Venue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date">Event Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="time">Event Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={eventForm.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="e.g., 2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="expectedGuests">Expected Guests</Label>
                    <Input
                      id="expectedGuests"
                      type="number"
                      value={eventForm.expectedGuests}
                      onChange={(e) => handleInputChange('expectedGuests', e.target.value)}
                      placeholder="Number of attendees"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPerson">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        value={eventForm.contactPerson}
                        onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                        placeholder="Full name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactEmail">Email Address *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={eventForm.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        placeholder="email@example.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactPhone">Phone Number</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        value={eventForm.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div>
                  <Label htmlFor="description">Event Description</Label>
                  <Textarea
                    id="description"
                    value={eventForm.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Please provide additional details about your event..."
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Submit Booking Request
                </Button>
              </form>
            </CardContent>
          </Card>
        );

      case 'notifications':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Notifications & Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                  <h4 className="font-semibold text-green-800">Booking Approved</h4>
                  <p className="text-green-700">Your Wedding Dance event for March 15th has been approved!</p>
                  <p className="text-sm text-green-600 mt-1">2 hours ago</p>
                </div>
                
                <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
                  <h4 className="font-semibold text-yellow-800">Booking Under Review</h4>
                  <p className="text-yellow-700">Your Corporate Event booking is currently under review. We'll get back to you within 24 hours.</p>
                  <p className="text-sm text-yellow-600 mt-1">1 day ago</p>
                </div>
                
                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                  <h4 className="font-semibold text-red-800">Booking Update Required</h4>
                  <p className="text-red-700">Please update your Birthday Party booking with additional details.</p>
                  <p className="text-sm text-red-600 mt-1">3 days ago</p>
                </div>
              </div>
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
            Event Organizer Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button
                    variant={activeTab === 'bookings' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('bookings')}
                  >
                    <Calendar className="mr-2" size={16} />
                    My Bookings
                  </Button>
                  <Button
                    variant={activeTab === 'new-booking' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('new-booking')}
                  >
                    <Plus className="mr-2" size={16} />
                    New Booking
                  </Button>
                  <Button
                    variant={activeTab === 'notifications' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('notifications')}
                  >
                    <Contact className="mr-2" size={16} />
                    Notifications
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
