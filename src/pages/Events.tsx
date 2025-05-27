
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Calendar, Home, Contact } from 'lucide-react';

export default function Events() {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Spring Recital 2024',
      date: 'April 15, 2024',
      time: '7:00 PM',
      venue: 'Grand Theater Downtown',
      description: 'Our annual spring showcase featuring performances from all class levels. A celebration of our students\' hard work and artistic growth.',
      price: 'Free for families',
      image: 'spring-recital',
      category: 'Recital'
    },
    {
      id: 2,
      title: 'Master Class: Contemporary Techniques',
      date: 'March 20, 2024',
      time: '2:00 PM - 4:00 PM',
      venue: 'Main Studio',
      description: 'Join renowned choreographer Emma Thompson for an intensive contemporary dance workshop focusing on floor work and emotional expression.',
      price: '$75 per person',
      image: 'contemporary-workshop',
      category: 'Workshop'
    },
    {
      id: 3,
      title: 'Hip-Hop Battle Competition',
      date: 'March 30, 2024',
      time: '6:00 PM - 9:00 PM',
      venue: 'Community Center',
      description: 'Competitive hip-hop battle featuring dancers from across the city. Open to all skill levels with beginner and advanced categories.',
      price: '$20 entry fee',
      image: 'hiphop-battle',
      category: 'Competition'
    },
    {
      id: 4,
      title: 'Parents & Me Dance Class',
      date: 'Every Saturday',
      time: '11:00 AM - 12:00 PM',
      venue: 'Studio 2',
      description: 'A special bonding experience for parents and children ages 2-5. Learn simple movements and songs together in a fun, nurturing environment.',
      price: '$25 per class',
      image: 'parent-child',
      category: 'Special Class'
    }
  ];

  const pastEvents = [
    {
      title: 'Winter Wonderland Performance',
      date: 'December 2023',
      description: 'A magical holiday performance featuring classical and contemporary pieces.',
    },
    {
      title: 'Ballroom Dancing Social',
      date: 'November 2023',
      description: 'Community social dance event with live music and refreshments.',
    },
    {
      title: 'Halloween Costume Dance Party',
      date: 'October 2023',
      description: 'Fun-filled costume party with dance games and spooky performances.',
    }
  ];

  const getCategoryColor = (category: string) => {
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
          <Link to="/register">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Book an Event
            </Button>
          </Link>
        </div>

        {/* Upcoming Events */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Upcoming Events
          </h2>
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
                    <Button 
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Register
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pastEvents.map((event, index) => (
                <div key={index} className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-lg mb-2">{event.title}</h4>
                  <p className="text-purple-600 font-medium mb-2">{event.date}</p>
                  <p className="text-gray-600 text-sm">{event.description}</p>
                </div>
              ))}
            </div>
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
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                Book an Event
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
