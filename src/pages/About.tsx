
import Navbar from '../components/Navbar';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-16 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              About Radiance Dance
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Founded in 2015, Radiance Dance Creation & Academy has been nurturing dancers and 
            creating magical moments for nearly a decade. We believe in the transformative power 
            of dance to inspire, heal, and connect communities.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-600">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To provide exceptional dance education that inspires creativity, builds confidence, 
                and fosters personal growth. We are committed to creating an inclusive environment 
                where dancers of all ages and backgrounds can discover their passion for movement 
                and artistic expression.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-pink-600">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To be the premier dance academy that shapes the next generation of dancers, 
                choreographers, and dance enthusiasts. We envision a world where dance is 
                accessible to all, serving as a bridge between cultures and a catalyst for 
                positive change in our community.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Our Story
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-4">
                  What started as a small studio with just two instructors has grown into a thriving 
                  community of over 150 active students. Our founder, Maria Rodriguez, began teaching 
                  dance in her garage after moving to the city with a dream to share her passion for 
                  movement with others.
                </p>
                <p className="mb-4">
                  Today, Radiance Dance Academy occupies a beautiful 5,000 square foot facility with 
                  three fully equipped studios, complete with professional sound systems, mirrors, 
                  and sprung floors designed to protect our dancers. We offer classes ranging from 
                  classical ballet to contemporary hip-hop, serving students from age 3 to 93.
                </p>
                <p>
                  Our academy has produced scholarship recipients to prestigious dance programs, 
                  professional performers, and most importantly, confident individuals who carry 
                  the joy of dance throughout their lives.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">E</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in every aspect of our instruction, from technique to artistry, 
                  ensuring our students reach their full potential.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">I</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Inclusivity</h3>
                <p className="text-gray-600">
                  Our doors are open to everyone, regardless of experience level, background, or physical ability. 
                  Dance is for all.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">C</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Community</h3>
                <p className="text-gray-600">
                  We foster a supportive community where students, families, and instructors 
                  connect and grow together through shared passion.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-8">Radiance by the Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">9</div>
              <div className="text-purple-100">Years of Excellence</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-purple-100">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">12</div>
              <div className="text-purple-100">Expert Instructors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24</div>
              <div className="text-purple-100">Weekly Classes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
