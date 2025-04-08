import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}) ;

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API endpoints
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login/', credentials),
  register: (userData) => apiClient.post('/auth/register/', userData),
  getProfile: () => apiClient.get('/auth/profile/'),
};

export const accountsAPI = {
  getAccounts: () => apiClient.get('/accounts/'),
  getAccount: (id) => apiClient.get(`/accounts/${id}/`),
  createAccount: (data) => apiClient.post('/accounts/', data),
  updateAccount: (id, data) => apiClient.put(`/accounts/${id}/`, data),
  deleteAccount: (id) => apiClient.delete(`/accounts/${id}/`),
};

export const contactsAPI = {
  getContacts: () => apiClient.get('/contacts/'),
  getContact: (id) => apiClient.get(`/contacts/${id}/`),
  createContact: (data) => apiClient.post('/contacts/', data),
  updateContact: (id, data) => apiClient.put(`/contacts/${id}/`, data),
  deleteContact: (id) => apiClient.delete(`/contacts/${id}/`),
};

// Add similar API functions for other entities

export default apiClient;
