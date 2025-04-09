import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}) ;

// Authentication token management
const TOKEN_KEY = 'custorix_auth_token';
const REFRESH_TOKEN_KEY = 'custorix_refresh_token';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setAuthTokens = (token: string, refreshToken: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearAuthTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// TEMPORARILY DISABLED: Add token to requests if available
// This is disabled to allow testing without authentication
/*
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
*/

// TEMPORARILY DISABLED: Handle token refresh on 401 errors
// This is disabled to prevent redirects during testing
/*
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          // No refresh token available, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken
        });
        
        // Save the new tokens
        const { access } = response.data;
        setAuthTokens(access, refreshToken);
        
        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        clearAuthTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
*/

// Add error logging interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status);
    if (error.response?.data) {
      console.error('Error details:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials: { username: string; password: string }) => 
    apiClient.post('/token/', credentials)
      .then(response => {
        const { access, refresh } = response.data;
        setAuthTokens(access, refresh);
        return response;
      }),
  register: (userData: any) => apiClient.post('/auth/register/', userData),
  getProfile: () => apiClient.get('/auth/profile/'),
  logout: () => {
    clearAuthTokens();
    return Promise.resolve();
  },
  refreshToken: () => {
    const refreshToken = getRefreshToken();
    return apiClient.post('/token/refresh/', { refresh: refreshToken });
  },
  isAuthenticated: () => !!getAuthToken()
};

export const accountsAPI = {
  getAccounts: async () => {
    try {
      console.log('Fetching accounts...');
      const response = await apiClient.get('/accounts/');
      console.log('Accounts fetched successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  },
  getAccount: async (id: string) => {
    try {
      console.log(`Fetching account ${id}...`);
      const response = await apiClient.get(`/accounts/${id}/`);
      console.log('Account fetched successfully:', response.data);
      return response;
    } catch (error) {
      console.error(`Error fetching account ${id}:`, error);
      throw error;
    }
  },
  createAccount: async (data: any) => {
    try {
      // Ensure industry is sent as ID if it's not null
      const accountData = { ...data };
      if (accountData.industry && typeof accountData.industry === 'object' && accountData.industry.id) {
        accountData.industry = accountData.industry.id;
      }
      
      console.log('Creating account with data:', accountData);
      const response = await apiClient.post('/accounts/', accountData);
      console.log('Account created successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Error creating account:', error);
      if (error.response?.data) {
        console.error('Validation errors:', error.response.data);
      }
      throw error;
    }
  },
  updateAccount: async (id: string, data: any) => {
    try {
      // Ensure industry is sent as ID if it's not null
      const accountData = { ...data };
      if (accountData.industry && typeof accountData.industry === 'object' && accountData.industry.id) {
        accountData.industry = accountData.industry.id;
      }
      
      console.log(`Updating account ${id} with data:`, accountData);
      const response = await apiClient.put(`/accounts/${id}/`, accountData);
      console.log('Account updated successfully:', response.data);
      return response;
    } catch (error) {
      console.error(`Error updating account ${id}:`, error);
      if (error.response?.data) {
        console.error('Validation errors:', error.response.data);
      }
      throw error;
    }
  },
  deleteAccount: async (id: string) => {
    try {
      console.log(`Deleting account ${id}...`);
      const response = await apiClient.delete(`/accounts/${id}/`);
      console.log('Account deleted successfully');
      return response;
    } catch (error) {
      console.error(`Error deleting account ${id}:`, error);
      throw error;
    }
  },
};

export const contactsAPI = {
  getContacts: async () => {
    try {
      console.log('Fetching contacts...');
      const response = await apiClient.get('/contacts/');
      console.log('Contacts fetched successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },
  getContact: async (id: string) => {
    try {
      console.log(`Fetching contact ${id}...`);
      const response = await apiClient.get(`/contacts/${id}/`);
      console.log('Contact fetched successfully:', response.data);
      return response;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error);
      throw error;
    }
  },
  createContact: async (data: any) => {
    try {
      // Ensure account is sent as ID if it's not null
      const contactData = { ...data };
      if (contactData.account && typeof contactData.account === 'object' && contactData.account.id) {
        contactData.account = contactData.account.id;
      }
      
      console.log('Creating contact with data:', contactData);
      const response = await apiClient.post('/contacts/', contactData);
      console.log('Contact created successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Error creating contact:', error);
      if (error.response?.data) {
        console.error('Validation errors:', error.response.data);
      }
      throw error;
    }
  },
  updateContact: async (id: string, data: any) => {
    try {
      // Ensure account is sent as ID if it's not null
      const contactData = { ...data };
      if (contactData.account && typeof contactData.account === 'object' && contactData.account.id) {
        contactData.account = contactData.account.id;
      }
      
      console.log(`Updating contact ${id} with data:`, contactData);
      const response = await apiClient.put(`/contacts/${id}/`, contactData);
      console.log('Contact updated successfully:', response.data);
      return response;
    } catch (error) {
      console.error(`Error updating contact ${id}:`, error);
      if (error.response?.data) {
        console.error('Validation errors:', error.response.data);
      }
      throw error;
    }
  },
  deleteContact: async (id: string) => {
    try {
      console.log(`Deleting contact ${id}...`);
      const response = await apiClient.delete(`/contacts/${id}/`);
      console.log('Contact deleted successfully');
      return response;
    } catch (error) {
      console.error(`Error deleting contact ${id}:`, error);
      throw error;
    }
  },
};

export const leadsAPI = {
  getLeads: () => apiClient.get('/leads/'),
  getLead: (id: string) => apiClient.get(`/leads/${id}/`),
  createLead: (data: any) => apiClient.post('/leads/', data),
  updateLead: (id: string, data: any) => apiClient.put(`/leads/${id}/`, data),
  deleteLead: (id: string) => apiClient.delete(`/leads/${id}/`),
  getLeadSources: () => apiClient.get('/lead-sources/'),
  getLeadStatuses: () => apiClient.get('/lead-statuses/'),
};

export const opportunitiesAPI = {
  getOpportunities: () => apiClient.get('/opportunities/'),
  getOpportunity: (id: string) => apiClient.get(`/opportunities/${id}/`),
  createOpportunity: (data: any) => apiClient.post('/opportunities/', data),
  updateOpportunity: (id: string, data: any) => apiClient.put(`/opportunities/${id}/`, data),
  deleteOpportunity: (id: string) => apiClient.delete(`/opportunities/${id}/`),
  getSalesStages: () => apiClient.get('/sales-stages/'),
};

export const campaignsAPI = {
  getCampaigns: () => apiClient.get('/campaigns/'),
  getCampaign: (id: string) => apiClient.get(`/campaigns/${id}/`),
  createCampaign: (data: any) => apiClient.post('/campaigns/', data),
  updateCampaign: (id: string, data: any) => apiClient.put(`/campaigns/${id}/`, data),
  deleteCampaign: (id: string) => apiClient.delete(`/campaigns/${id}/`),
  getCampaignTypes: () => apiClient.get('/campaign-types/'),
};

export const supportAPI = {
  getTickets: () => apiClient.get('/support-tickets/'),
  getTicket: (id: string) => apiClient.get(`/support-tickets/${id}/`),
  createTicket: (data: any) => apiClient.post('/support-tickets/', data),
  updateTicket: (id: string, data: any) => apiClient.put(`/support-tickets/${id}/`, data),
  deleteTicket: (id: string) => apiClient.delete(`/support-tickets/${id}/`),
  getTicketPriorities: () => apiClient.get('/ticket-priorities/'),
  getTicketStatuses: () => apiClient.get('/ticket-statuses/'),
  getTicketCategories: () => apiClient.get('/ticket-categories/'),
};

export const financeAPI = {
  getInvoices: () => apiClient.get('/invoices/'),
  getInvoice: (id: string) => apiClient.get(`/invoices/${id}/`),
  createInvoice: (data: any) => apiClient.post('/invoices/', data),
  updateInvoice: (id: string, data: any) => apiClient.put(`/invoices/${id}/`, data),
  deleteInvoice: (id: string) => apiClient.delete(`/invoices/${id}/`),
};

export default apiClient;
