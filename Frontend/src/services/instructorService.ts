import api from './api';

export const getAllInstructors = async () => {
  const response = await api.get('/instructors');
  return response.data;
};

export const getInstructorById = async (id: string) => {
  const response = await api.get(`/instructors/${id}`);
  return response.data;
};

export const createInstructor = async (instructorData: any) => {
  const response = await api.post('/instructors', instructorData);
  return response.data;
};

export const updateInstructor = async (id: string, instructorData: any) => {
  const response = await api.put(`/instructors/${id}`, instructorData);
  return response.data;
};

export const deleteInstructor = async (id: string) => {
  const response = await api.delete(`/instructors/${id}`);
  return response.data;
};