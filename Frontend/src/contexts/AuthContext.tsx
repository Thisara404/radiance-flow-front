import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Set up API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'organizer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Setup axios interceptor for auth
  useEffect(() => {
    // Request interceptor
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 errors (unauthorized)
        if (error.response && error.response.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Clean up interceptors when component unmounts
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get token and user data from localStorage
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          try {
            // Parse user data
            const parsedUser = JSON.parse(userData);
            
            // Set user in state
            setUser(parsedUser);
            
            // Verify token by making a request to /auth/me
            try {
              const response = await api.get('/auth/me');
              if (response.data && response.data.success) {
                // Update user data with latest from server
                setUser(response.data.data);
                localStorage.setItem('user', JSON.stringify(response.data.data));
              }
            } catch (verifyError) {
              console.log('Token verification failed, using stored data');
              // We still allow the app to continue with stored user data
            }
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
            // Clear invalid data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password, role });
      
      const { success, token, data } = response.data;
      
      if (success && token && data) {
        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data));
        
        // Update state
        setUser(data);
        
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { 
        name, 
        email, 
        password,
        role
      });
      
      const { success, token, data } = response.data;
      
      if (success && token && data) {
        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data));
        
        // Update state
        setUser(data);
        
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    // Clear auth data from storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reset state
    setUser(null);
  };

  // Calculate authenticated state
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated,
      isLoading,
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export the axios instance for use in other services
export { api };
