import api from './api';

export const getStudentPayments = async () => {
  const response = await api.get('/payments');
  return response.data;
};

export const getAllPayments = async () => {
  const response = await api.get('/payments/all');
  return response.data;
};

export const createPayment = async (paymentData: any) => {
  const response = await api.post('/payments', paymentData);
  return response.data;
};

export const updatePaymentStatus = async (id: string, status: string) => {
  const response = await api.put(`/payments/${id}`, { status });
  return response.data;
};