import api from './api';

export const enrollInClass = async (classId: string) => {
  try {
    const response = await api.post('/enrollments', { classId });
    return response.data;
  } catch (error) {
    console.error('Error enrolling in class:', error);
    throw error;
  }
};

export const getMyEnrollments = async () => {
  try {
    const response = await api.get('/enrollments/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching my enrollments:', error);
    throw error;
  }
};

export const getClassEnrollments = async (classId: string) => {
  try {
    const response = await api.get(`/classes/${classId}/enrollments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching class enrollments:', error);
    throw error;
  }
};

export const updateEnrollmentStatus = async (enrollmentId: string, status: string) => {
  try {
    const response = await api.put(`/enrollments/${enrollmentId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating enrollment status:', error);
    throw error;
  }
};

export const getAllEnrollments = async () => {
  try {
    const response = await api.get('/enrollments');
    return response.data;
  } catch (error) {
    console.error('Error fetching all enrollments:', error);
    throw error;
  }
};