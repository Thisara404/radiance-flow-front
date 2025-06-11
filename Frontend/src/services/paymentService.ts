import api from './api';

export interface CreatePaymentOrderData {
  itemType: 'class' | 'event' | 'monthly_tuition' | 'registration' | 'workshop' | 'costume';
  itemId?: string;
  amount: number;
  description?: string;
  metadata?: any;
}

export interface PaymentSlip {
  paymentId: string;
  transactionId: string;
  user: {
    name: string;
    email: string;
  };
  item: {
    type: string;
    name: string;
    description: string;
  };
  amount: {
    lkr: number;
    usd: number;
    exchangeRate: number;
  };
  status: string;
  paymentDate: string;
  canRefund: boolean;
  refundInfo?: {
    amount: number;
    date: string;
    reason: string;
  };
}

// PayPal Payment Operations
export const createPaymentOrder = async (data: CreatePaymentOrderData) => {
  try {
    const response = await api.post('/payments/create-order', data);
    return response.data;
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw error;
  }
};

export const capturePayment = async (orderId: string) => {
  try {
    const response = await api.post(`/payments/capture/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error capturing payment:', error);
    throw error;
  }
};

export const getPaymentSlip = async (paymentId: string) => {
  try {
    const response = await api.get(`/payments/${paymentId}/slip`);
    return response.data;
  } catch (error) {
    console.error('Error getting payment slip:', error);
    throw error;
  }
};

export const refundPayment = async (paymentId: string, reason?: string) => {
  try {
    const response = await api.post(`/payments/${paymentId}/refund`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
};

// Payment History
export const getMyPaymentHistory = async (params = {}) => {
  try {
    const response = await api.get('/payments/my-history', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};

export const getAllPayments = async (params = {}) => {
  try {
    const response = await api.get('/payments/admin/all', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching all payments:', error);
    throw error;
  }
};

export const getPaymentStats = async (period = '30') => {
  try {
    const response = await api.get(`/payments/admin/stats?period=${period}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    throw error;
  }
};

// Class and Event Payment
export const payForClass = async (classId: string, amount: number) => {
  return createPaymentOrder({
    itemType: 'class',
    itemId: classId,
    amount,
    description: 'Class enrollment payment'
  });
};

export const payForEvent = async (eventId: string, amount: number) => {
  return createPaymentOrder({
    itemType: 'event',
    itemId: eventId,
    amount,
    description: 'Event registration payment'
  });
};

// Legacy methods for backward compatibility
export const getStudentPayments = async () => {
  const response = await api.get('/payments');
  return response.data;
};

export const createPayment = async (paymentData: any) => {
  const response = await api.post('/payments/admin/create', paymentData);
  return response.data;
};

export const updatePaymentStatus = async (id: string, status: string) => {
  const response = await api.put(`/payments/${id}/status`, { status });
  return response.data;
};

// New method to cancel payment
export const cancelMyPayment = async (paymentId: string) => {
  try {
    const response = await api.post(`/payments/${paymentId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling payment:', error);
    throw error;
  }
};