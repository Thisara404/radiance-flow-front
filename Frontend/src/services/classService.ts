import { api } from '../contexts/AuthContext';

export const getAllClasses = async () => {
  try {
    console.log('Fetching all classes from API...');
    const response = await api.get('/classes');
    console.log('Classes API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching classes:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch classes'
    };
  }
};

export const createClass = async (classData) => {
  try {
    // Format description - trim if too long
    if (classData.description && classData.description.length > 500) {
      classData.description = classData.description.substring(0, 500);
    }
    
    // Ensure all required fields are present and properly formatted
    const formattedData = {
      name: classData.name,
      instructor: classData.instructor,
      level: classData.level,
      schedule: classData.schedule,
      price: Number(classData.price), // Ensure price is a number
      duration: classData.duration || '60 min',
      capacity: classData.capacity ? Number(classData.capacity) : 20,
      description: classData.description || ''
    };
    
    console.log('Sending class data:', formattedData);
    
    const response = await api.post('/classes', formattedData);
    return response.data;
  } catch (error) {
    console.error('Error in createClass service:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create class'
    };
  }
};

export const getClasses = async () => {
  try {
    const response = await api.get('/classes');
    return response.data;
  } catch (error) {
    console.error('Error fetching classes:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch classes'
    };
  }
};

export const getClassById = async (classId: string) => {
  try {
    const response = await api.get(`/classes/${classId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching class with ID ${classId}:`, error);
    throw error;
  }
};

export const enrollInClass = async (classId: string) => {
  try {
    const response = await api.post(`/classes/${classId}/enroll`);
    return response.data;
  } catch (error) {
    console.error(`Error enrolling in class with ID ${classId}:`, error);
    throw error;
  }
};

// Make sure this uses /classes/enrolled without any parameters
export const getEnrolledClasses = async () => {
  try {
    const response = await api.get('/classes/enrolled');
    return response.data;
  } catch (error) {
    console.error('Error fetching enrolled classes:', error);
    throw error;
  }
};

export const getEnrolledStudents = async (classId: string) => {
  try {
    const response = await api.get(`/classes/${classId}/students`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching enrolled students for class with ID ${classId}:`, error);
    throw error;
  }
};