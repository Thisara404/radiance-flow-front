
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '../components/Navbar';
import { Calendar, Home, Contact, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const stats = {
    totalStudents: 156,
    totalInstructors: 12,
    activeClasses: 24,
    pendingBookings: 8
  };

  const recentStudents = [
    { id: 1, name: 'Emma Johnson', email: 'emma@email.com', joinDate: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Michael Davis', email: 'michael@email.com', joinDate: '2024-01-20', status: 'Active' },
    { id: 3, name: 'Sarah Wilson', email: 'sarah@email.com', joinDate: '2024-01-25', status: 'Pending' }
  ];

  const instructors = [
    { id: 1, name: 'Ms. Sarah Parker', specialty: 'Ballet & Contemporary', experience: '10 years', classes: 6 },
    { id: 2, name: 'Mr. Alex Rodriguez', specialty: 'Hip-Hop & Jazz', experience: '8 years', classes: 4 },
    { id: 3, name: 'Ms. Maria Gonzalez', specialty: 'Salsa & Latin', experience: '12 years', classes: 3 }
  ];

  const upcomingClasses = [
    { id: 1, name: 'Ballet Basics', instructor: 'Ms. Sarah', time: '6:00 PM', date: 'Today', enrolled: 15, capacity: 20 },
    { id: 2, name: 'Hip-Hop Fundamentals', instructor: 'Mr. Alex', time: '7:00 PM', date: 'Today', enrolled: 12, capacity: 15 },
    { id: 3, name: 'Contemporary Dance', instructor: 'Ms. Sarah', time: '10:00 AM', date: 'Tomorrow', enrolled: 8, capacity: 12 }
  ];

  const eventBookings = [
    { id: 1, eventType: 'Wedding Dance', organizer: 'Sarah Johnson', date: '2024-03-15', status: 'Pending' },
    { id: 2, eventType: 'Corporate Event', organizer: 'Mike Davis', date: '2024-03-22', status: 'Approved' },
    { id: 3, eventType: 'Birthday Party', organizer: 'Emma Wilson', date: '2024-03-28', status: 'Under Review' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{stats.totalStudents}</div>
                  <div className="text-purple-100">Total Students</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{stats.totalInstructors}</div>
                  <div className="text-pink-100">Instructors</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{stats.activeClasses}</div>
                  <div className="text-orange-100">Active Classes</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{stats.pendingBookings}</div>
                  <div className="text-blue-100">Pending Bookings</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20 flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600">
                    <Plus className="mb-2" size={24} />
                    Add New Student
                  </Button>
                  <Button className="h-20 flex flex-col items-center justify-center" variant="outline">
                    <Calendar className="mb-2" size={24} />
                    Schedule Class
                  </Button>
                  <Button className="h-20 flex flex-col items-center justify-center" variant="outline">
                    <Contact className="mb-2" size={24} />
                    Review Bookings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingClasses.filter(cls => cls.date === 'Today').map((cls) => (
                      <div key={cls.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{cls.name}</div>
                          <div className="text-sm text-gray-600">{cls.instructor} • {cls.time}</div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {cls.enrolled}/{cls.capacity}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {eventBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{booking.eventType}</div>
                          <div className="text-sm text-gray-600">{booking.organizer}</div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'students':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentStudents.map((student) => (
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
            </CardContent>
          </Card>
        );

      case 'instructors':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Instructor Management</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        );

      case 'classes':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Class Schedule Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses.map((cls) => (
                  <div key={cls.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{cls.name}</h3>
                      <p className="text-sm text-gray-600">Instructor: {cls.instructor}</p>
                      <p className="text-sm text-gray-600">{cls.date} at {cls.time}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <div className="font-medium">{cls.enrolled}/{cls.capacity}</div>
                        <div className="text-sm text-gray-600">Enrolled</div>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'bookings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Event Booking Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventBookings.map((booking) => (
                  <div key={booking.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{booking.eventType}</h3>
                      <p className="text-sm text-gray-600">Organizer: {booking.organizer}</p>
                      <p className="text-sm text-gray-600">Date: {booking.date}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <Button variant="outline" size="sm">Review</Button>
                    </div>
                  </div>
                ))}
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
            Admin Dashboard
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
                    variant={activeTab === 'overview' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('overview')}
                  >
                    <Home className="mr-2" size={16} />
                    Overview
                  </Button>
                  <Button
                    variant={activeTab === 'students' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('students')}
                  >
                    <Contact className="mr-2" size={16} />
                    Students
                  </Button>
                  <Button
                    variant={activeTab === 'instructors' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('instructors')}
                  >
                    <Contact className="mr-2" size={16} />
                    Instructors
                  </Button>
                  <Button
                    variant={activeTab === 'classes' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('classes')}
                  >
                    <Calendar className="mr-2" size={16} />
                    Classes
                  </Button>
                  <Button
                    variant={activeTab === 'bookings' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('bookings')}
                  >
                    <Plus className="mr-2" size={16} />
                    Event Bookings
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
