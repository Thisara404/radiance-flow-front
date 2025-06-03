import api from './api';

interface LoginData {
  email: string;
  password: string;
  role: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const login = async (data: LoginData) => {
  const response = await api.post('/auth/login', data);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await api.post('/auth/register', data);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};