import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src="/images/logo.jpeg" 
                alt="Radiance Dance Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Radiance Dance
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-purple-600 transition-colors">
              About
            </Link>
            <Link to="/classes" className="text-gray-700 hover:text-purple-600 transition-colors">
              Classes
            </Link>
            <Link to="/events" className="text-gray-700 hover:text-purple-600 transition-colors">
              Events
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-purple-600 transition-colors">
              Contact
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={`/${user.role}-dashboard`} className="text-white bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 rounded-full hover:from-purple-700 hover:to-pink-700 transition">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-purple-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-white bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 rounded-full hover:from-purple-700 hover:to-pink-700 transition">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-gray-700 hover:border-gray-700"
          >
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-purple-100 py-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-purple-600 transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-purple-600 transition-colors">
                About
              </Link>
              <Link to="/classes" className="text-gray-700 hover:text-purple-600 transition-colors">
                Classes
              </Link>
              <Link to="/events" className="text-gray-700 hover:text-purple-600 transition-colors">
                Events
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-purple-600 transition-colors">
                Contact
              </Link>
              {user ? (
                <>
                  <Link to={`/${user.role}-dashboard`} className="text-white bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 rounded-full hover:from-purple-700 hover:to-pink-700 transition">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-purple-600 transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="text-white bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 rounded-full hover:from-purple-700 hover:to-pink-700 transition">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
