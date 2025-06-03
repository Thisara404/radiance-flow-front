import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '../components/Navbar';
import { Calendar, Home, Contact } from 'lucide-react';
import ImageHoverPopup from '../components/ImageHoverPopup';
import PackageGallery from '../components/PackageGallery';

const Index = () => {
  // For image gallery carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const galleryImages = [
    '/images/1.jpeg',
    '/images/2.jpeg', 
    '/images/3.jpeg',
    '/images/5.jpeg',
    '/images/6.jpeg',
    '/images/7.jpeg',
  ];

  // Auto-rotate gallery images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  // Animation for sections when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate__animated', 'animate__fadeIn');
        }
      });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('.animate-section');
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  // Animation for hero image
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navbar />
      
      {/* Hero Section with Animation */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-300 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300 rounded-full opacity-30 animate-pulse"></div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-16 px-4 bg-white/30 backdrop-blur-sm animate-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Our Dance Studio Gallery
          </h2>
          
          {/* Main carousel */}
          <div className="relative w-full h-96 mb-8 overflow-hidden rounded-2xl shadow-xl">
            {galleryImages.map((img, index) => (
              <div 
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentImageIndex === index ? 'opacity-100' : 'opacity-0'}`}
              >
                <img 
                  src={img} 
                  alt={`Dance studio image ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-2xl font-bold">Radiance in Motion</h3>
                  <p className="text-lg">Where passion meets performance</p>
                </div>
              </div>
            ))}
            
            {/* Gallery navigation dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Thumbnail row with hover effect */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {galleryImages.map((img, index) => (
              <div key={index} className={`aspect-square overflow-hidden rounded-lg ${currentImageIndex === index ? 'ring-2 ring-purple-600' : ''}`}>
                <ImageHoverPopup 
                  src={img}
                  alt={`Gallery thumbnail ${index + 1}`}
                  thumbnailClassName="w-full h-full object-cover transition hover:scale-105 duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Package Gallery - using our new component */}
      <PackageGallery />

      {/* Features Section with Animation */}
      <section className="py-16 px-4 animate-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose Radiance Dance?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1">
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

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1">
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

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1">
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

      {/* Animated Dance Styles Section */}
      <section className="py-16 px-4 bg-white/20 backdrop-blur-sm animate-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Dance Styles We Offer
          </h2>
          
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { name: 'Ballet', color: 'from-pink-400 to-pink-600' },
              { name: 'Contemporary', color: 'from-purple-400 to-purple-600' },
              { name: 'Hip-Hop', color: 'from-blue-400 to-blue-600' },
              { name: 'Jazz', color: 'from-orange-400 to-orange-600' },
              { name: 'Tap', color: 'from-green-400 to-green-600' },
              { name: 'Ballroom', color: 'from-red-400 to-red-600' },
              { name: 'Salsa', color: 'from-yellow-400 to-yellow-600' },
              { name: 'Aerial', color: 'from-indigo-400 to-indigo-600' }
            ].map((style, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-r ${style.color} rounded-lg p-6 text-white text-center transform transition hover:scale-105 cursor-pointer`}
              >
                <h3 className="text-xl font-bold">{style.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600 animate-section">
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
          <div className="flex items-center justify-center mb-6">
            <img src="/images/logo.jpeg" alt="Radiance Dance Logo" className="w-16 h-16 rounded-full object-cover" />
          </div>
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
