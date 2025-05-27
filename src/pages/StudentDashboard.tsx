
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import { Calendar, Home, Contact, Plus } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedClass, setSelectedClass] = useState('');

  // Mock data
  const enrolledClasses = [
    { id: 1, name: 'Ballet Basics', instructor: 'Ms. Sarah', schedule: 'Mon/Wed 6:00 PM', level: 'Beginner' },
    { id: 2, name: 'Contemporary Dance', instructor: 'Mr. Alex', schedule: 'Tue/Thu 7:00 PM', level: 'Intermediate' }
  ];

  const availableClasses = [
    { id: 3, name: 'Hip-Hop Fundamentals', instructor: 'Ms. Jazz', schedule: 'Fri 5:00 PM', level: 'Beginner', spots: 5 },
    { id: 4, name: 'Jazz Dance', instructor: 'Mr. Tony', schedule: 'Sat 10:00 AM', level: 'All Levels', spots: 3 },
    { id: 5, name: 'Salsa Dancing', instructor: 'Ms. Maria', schedule: 'Sun 2:00 PM', level: 'Beginner', spots: 8 }
  ];

  const payments = [
    { id: 1, date: '2024-01-15', amount: '$120', description: 'Monthly Tuition - January', status: 'Paid' },
    { id: 2, date: '2024-02-15', amount: '$120', description: 'Monthly Tuition - February', status: 'Pending' }
  ];

  const handleEnrollClass = () => {
    if (selectedClass) {
      toast({
        title: "Enrollment Submitted",
        description: "Your class enrollment request has been submitted!"
      });
      setSelectedClass('');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user?.email} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="(555) 123-4567" />
                </div>
                <div>
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input id="emergency" placeholder="Emergency contact number" />
                </div>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        );

      case 'enroll':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Enroll in New Class</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="class-select">Select a Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a class to enroll" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableClasses.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name} - {cls.schedule} ({cls.spots} spots left)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleEnrollClass}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                  disabled={!selectedClass}
                >
                  <Plus className="mr-2" size={16} />
                  Enroll Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {availableClasses.map((cls) => (
                    <div key={cls.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{cls.name}</h3>
                          <p className="text-gray-600">Instructor: {cls.instructor}</p>
                          <p className="text-gray-600">Schedule: {cls.schedule}</p>
                          <p className="text-gray-600">Level: {cls.level}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">
                            {cls.spots} spots available
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
              <div className="grid gap-4">
                {enrolledClasses.map((cls) => (
                  <div key={cls.id} className="border rounded-lg p-4 bg-purple-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{cls.name}</h3>
                        <p className="text-gray-600">Instructor: {cls.instructor}</p>
                        <p className="text-gray-600">Schedule: {cls.schedule}</p>
                        <p className="text-gray-600">Level: {cls.level}</p>
                      </div>
                      <div className="text-right">
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                {payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <p className="font-medium">{payment.description}</p>
                      <p className="text-sm text-gray-600">{payment.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{payment.amount}</p>
                      <span className={`text-sm px-2 py-1 rounded ${
                        payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  Make Payment
                </Button>
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
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Manage your dance journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button
                    variant={activeTab === 'profile' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('profile')}
                  >
                    <Home className="mr-2" size={16} />
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
