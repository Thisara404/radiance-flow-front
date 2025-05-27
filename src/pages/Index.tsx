
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '../components/Navbar';
import { Calendar, Home, Contact } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Radiance Dance
            </span>
            <br />
            <span className="text-gray-800">Creation & Academy</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover the art of movement at our premier dance academy. From ballet to contemporary, 
            hip-hop to jazz, we nurture dancers of all ages and skill levels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-3">
                Start Your Journey
              </Button>
            </Link>
            <Link to="/classes">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Explore Classes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose Radiance Dance?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-4">Expert Instructors</h3>
                <p className="text-gray-600">
                  Learn from professional dancers and choreographers with years of experience
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-4">Flexible Scheduling</h3>
                <p className="text-gray-600">
                  Choose from morning, afternoon, and evening classes that fit your lifestyle
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Contact className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-4">Community</h3>
                <p className="text-gray-600">
                  Join a supportive community of dancers who share your passion for movement
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Dance?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of dancers who have transformed their lives through movement
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Register Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Radiance Dance Creation & Academy</h3>
          <p className="text-gray-400 mb-4">Where passion meets performance</p>
          <div className="flex justify-center space-x-6">
            <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
              About
            </Link>
            <Link to="/classes" className="text-gray-400 hover:text-white transition-colors">
              Classes
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-8">
            © 2024 Radiance Dance Creation & Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
