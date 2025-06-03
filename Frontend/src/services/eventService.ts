import { api } from '../contexts/AuthContext';

export const getAllEvents = async (params = {}) => {
  try {
    const response = await api.get('/events', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return { 
      success: false, 
      data: [], 
      message: error.response?.data?.message || 'Failed to fetch events' 
    };
  }
};

export const getEventById = async (id: string) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    return { 
      success: false, 
      data: null, 
      message: error.response?.data?.message || 'Failed to fetch event' 
    };
  }
};

export const createEvent = async (eventData: any) => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    return { 
      success: false, 
      data: null, 
      message: error.response?.data?.message || 'Failed to create event' 
    };
  }
};

export const updateEvent = async (id: string, eventData: any) => {
  try {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    return { 
      success: false, 
      data: null, 
      message: error.response?.data?.message || 'Failed to update event' 
    };
  }
};

export const deleteEvent = async (id: string) => {
  try {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    return { 
      success: false, 
      data: null, 
      message: error.response?.data?.message || 'Failed to delete event' 
    };
  }
};

export const updateEventStatus = async (id: string, status: string) => {
  try {
    const response = await api.put(`/events/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating event status:', error);
    return { 
      success: false, 
      data: null, 
      message: error.response?.data?.message || 'Failed to update event status' 
    };
  }
};

export const getUserEvents = async () => {
  try {
    const response = await api.get('/events/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user events:', error);
    return { 
      success: false, 
      data: [], 
      message: error.response?.data?.message || 'Failed to fetch user events' 
    };
  }
};

export const registerForEvent = async (eventId: string) => {
  try {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  } catch (error) {
    console.error('Error registering for event:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to register for event' 
    };
  }
};

export const getPublicEvents = async () => {
  try {
    const response = await api.get('/events/public');
    return response.data;
  } catch (error) {
    console.error('Error fetching public events:', error);
    return { 
      success: false, 
      data: [], 
      message: error.response?.data?.message || 'Failed to fetch public events' 
    };
  }
};

export const getMyEventRegistrations = async () => {
  try {
    const response = await api.get('/events/registrations/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching my event registrations:', error);
    return { 
      success: false, 
      data: [], 
      message: error.response?.data?.message || 'Failed to fetch registrations' 
    };
  }
};

export const getEventRegistrations = async (eventId: string) => {
  try {
    const response = await api.get(`/events/${eventId}/registrations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    return { 
      success: false, 
      data: [], 
      message: error.response?.data?.message || 'Failed to fetch event registrations' 
    };
  }
};