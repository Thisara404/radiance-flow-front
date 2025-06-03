import api from './api';

export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting user with ID ${userId}:`, error);
    throw error;
  }
};

export const getMyProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error getting my profile:', error);
    throw error;
  }
};

export const updateMyProfile = async (profileData: any) => {
  try {
    const response = await api.put('/auth/me', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating my profile:', error);
    throw error;
  }
};