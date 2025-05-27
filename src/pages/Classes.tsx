
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function Classes() {
  const classes = [
    {
      id: 1,
      name: 'Ballet Fundamentals',
      level: 'Beginner',
      instructor: 'Ms. Sarah Parker',
      schedule: 'Monday & Wednesday, 6:00 PM - 7:00 PM',
      duration: '60 minutes',
      price: '$120/month',
      description: 'Learn the basics of classical ballet including positions, barre work, and center floor combinations.',
      spots: 5
    },
    {
      id: 2,
      name: 'Contemporary Dance',
      level: 'Intermediate',
      instructor: 'Mr. Alex Rodriguez',
      schedule: 'Tuesday & Thursday, 7:00 PM - 8:30 PM',
      duration: '90 minutes',
      price: '$140/month',
      description: 'Explore emotional expression through fluid movement, combining ballet technique with modern dance elements.',
      spots: 3
    },
    {
      id: 3,
      name: 'Hip-Hop Foundations',
      level: 'All Levels',
      instructor: 'Ms. Jazz Williams',
      schedule: 'Friday, 5:00 PM - 6:00 PM',
      duration: '60 minutes',
      price: '$100/month',
      description: 'Get down with the latest hip-hop moves, from old school foundations to current trends.',
      spots: 8
    },
    {
      id: 4,
      name: 'Jazz Dance',
      level: 'Intermediate',
      instructor: 'Mr. Tony Martinez',
      schedule: 'Saturday, 10:00 AM - 11:30 AM',
      duration: '90 minutes',
      price: '$140/month',
      description: 'High-energy jazz combinations focusing on performance quality and style.',
      spots: 2
    },
    {
      id: 5,
      name: 'Latin Salsa',
      level: 'Beginner',
      instructor: 'Ms. Maria Gonzalez',
      schedule: 'Sunday, 2:00 PM - 3:00 PM',
      duration: '60 minutes',
      price: '$110/month',
      description: 'Learn the passionate rhythms of salsa dancing with authentic Latin techniques.',
      spots: 12
    },
    {
      id: 6,
      name: 'Lyrical Dance',
      level: 'Advanced',
      instructor: 'Ms. Emma Thompson',
      schedule: 'Wednesday, 8:00 PM - 9:30 PM',
      duration: '90 minutes',
      price: '$150/month',
      description: 'Combine ballet technique with contemporary movement to tell stories through dance.',
      spots: 1
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      case 'All Levels':
        return 'bg-blue-100 text-blue-800';
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
              Our Classes
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover your passion for dance with our diverse range of classes. From classical ballet 
            to contemporary hip-hop, we have something for every dancer.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Join Our Classes
            </Button>
          </Link>
        </div>

        {/* Class Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {classes.map((classItem) => (
            <Card key={classItem.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{classItem.name}</CardTitle>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(classItem.level)}`}>
                    {classItem.level}
                  </span>
                </div>
                <p className="text-purple-600 font-medium">{classItem.instructor}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{classItem.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Schedule:</span>
                    <span>{classItem.schedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Duration:</span>
                    <span>{classItem.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Price:</span>
                    <span className="font-bold text-purple-600">{classItem.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Available Spots:</span>
                    <span className={`font-medium ${classItem.spots <= 3 ? 'text-red-600' : 'text-green-600'}`}>
                      {classItem.spots} left
                    </span>
                  </div>
                </div>

                <Link to="/register">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={classItem.spots === 0}
                  >
                    {classItem.spots === 0 ? 'Class Full' : 'Enroll Now'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

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
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-purple-50">
                    <td className="py-3 px-4">Monday</td>
                    <td className="py-3 px-4">6:00 PM - 7:00 PM</td>
                    <td className="py-3 px-4">Ballet Fundamentals</td>
                    <td className="py-3 px-4">Ms. Sarah Parker</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-sm">Beginner</span>
                    </td>
                  </tr>
                  <tr className="border-b border-purple-50">
                    <td className="py-3 px-4">Tuesday</td>
                    <td className="py-3 px-4">7:00 PM - 8:30 PM</td>
                    <td className="py-3 px-4">Contemporary Dance</td>
                    <td className="py-3 px-4">Mr. Alex Rodriguez</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-sm">Intermediate</span>
                    </td>
                  </tr>
                  <tr className="border-b border-purple-50">
                    <td className="py-3 px-4">Wednesday</td>
                    <td className="py-3 px-4">6:00 PM - 7:00 PM</td>
                    <td className="py-3 px-4">Ballet Fundamentals</td>
                    <td className="py-3 px-4">Ms. Sarah Parker</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-sm">Beginner</span>
                    </td>
                  </tr>
                  <tr className="border-b border-purple-50">
                    <td className="py-3 px-4">Wednesday</td>
                    <td className="py-3 px-4">8:00 PM - 9:30 PM</td>
                    <td className="py-3 px-4">Lyrical Dance</td>
                    <td className="py-3 px-4">Ms. Emma Thompson</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-sm">Advanced</span>
                    </td>
                  </tr>
                  <tr className="border-b border-purple-50">
                    <td className="py-3 px-4">Thursday</td>
                    <td className="py-3 px-4">7:00 PM - 8:30 PM</td>
                    <td className="py-3 px-4">Contemporary Dance</td>
                    <td className="py-3 px-4">Mr. Alex Rodriguez</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-sm">Intermediate</span>
                    </td>
                  </tr>
                  <tr className="border-b border-purple-50">
                    <td className="py-3 px-4">Friday</td>
                    <td className="py-3 px-4">5:00 PM - 6:00 PM</td>
                    <td className="py-3 px-4">Hip-Hop Foundations</td>
                    <td className="py-3 px-4">Ms. Jazz Williams</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-sm">All Levels</span>
                    </td>
                  </tr>
                  <tr className="border-b border-purple-50">
                    <td className="py-3 px-4">Saturday</td>
                    <td className="py-3 px-4">10:00 AM - 11:30 AM</td>
                    <td className="py-3 px-4">Jazz Dance</td>
                    <td className="py-3 px-4">Mr. Tony Martinez</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-sm">Intermediate</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Sunday</td>
                    <td className="py-3 px-4">2:00 PM - 3:00 PM</td>
                    <td className="py-3 px-4">Latin Salsa</td>
                    <td className="py-3 px-4">Ms. Maria Gonzalez</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-sm">Beginner</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Dancing?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join our community of passionate dancers and discover your potential
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-purple-600">
                Register Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
