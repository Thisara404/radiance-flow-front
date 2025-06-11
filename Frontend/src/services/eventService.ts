import api from './api';

export const getAllEvents = async (params = {}) => {
  try {
    const response = await api.get('/events', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting all events:', error);
    throw error;
  }
};

export const getPublicEvents = async () => {
  try {
    const response = await api.get('/events/public');
    return response.data;
  } catch (error) {
    console.error('Error getting public events:', error);
    throw error;
  }
};

export const getEventById = async (id: string) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting event by ID:', error);
    throw error;
  }
};

export const createEvent = async (eventData: any) => {
  try {
    console.log('Creating event with data:', eventData);
    const response = await api.post('/events', eventData);
    console.log('Event creation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    console.error('Error response:', error.response?.data);
    
    // Return a more detailed error response
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create event',
      details: error.response?.data
    };
  }
};

export const updateEvent = async (id: string, eventData: any) => {
  try {
    console.log('Updating event with ID:', id, 'Data:', eventData);
    const response = await api.put(`/events/${id}`, eventData);
    console.log('Event update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    console.error('Error response:', error.response?.data);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update event',
      details: error.response?.data
    };
  }
};

export const deleteEvent = async (id: string) => {
  try {
    console.log('Deleting event with ID:', id);
    const response = await api.delete(`/events/${id}`);
    console.log('Event deletion response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    console.error('Error response:', error.response?.data);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete event',
      details: error.response?.data
    };
  }
};

export const updateEventStatus = async (id: string, status: string) => {
  try {
    const response = await api.put(`/events/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating event status:', error);
    throw error;
  }
};

export const getUserEvents = async () => {
  try {
    const response = await api.get('/events/user');
    return response.data;
  } catch (error) {
    console.error('Error getting user events:', error);
    throw error;
  }
};

export const registerForEvent = async (eventId: string) => {
  try {
    // Fix: Use the correct URL format with eventId in the path
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
};

export const getEventRegistrations = async (eventId: string) => {
  try {
    const response = await api.get(`/events/${eventId}/registrations`);
    return response.data;
  } catch (error) {
    console.error('Error getting event registrations:', error);
    throw error;
  }
};

export const getMyEventRegistrations = async () => {
  try {
    const response = await api.get('/events/registrations/me');
    return response.data;
  } catch (error) {
    console.error('Error getting my event registrations:', error);
    throw error;
  }
};