import axios from 'axios';

// Setup base URL untuk API
const API = axios.create({
  baseURL: '/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk auto-include CSRF token
API.interceptors.request.use((config) => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (token) {
    config.headers['X-CSRF-TOKEN'] = token;
  }
  return config;
});

// Interceptor untuk handle error
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect ke login jika unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Event Services
 */
export const eventService = {
  /**
   * Get all events
   * @param {Object} params - Query parameters { page, limit, category, search }
   * @returns {Promise}
   */
  getAllEvents: (params = {}) => 
    API.get('/events', { params }),

  /**
   * Get trending events
   * @param {number} limit - Jumlah events
   * @returns {Promise}
   */
  getTrendingEvents: (limit = 10) => 
    API.get('/events/trending', { params: { limit } }),

  /**
   * Get event by ID
   * @param {number} id - Event ID
   * @returns {Promise}
   */
  getEvent: (id) => 
    API.get(`/events/${id}`),

  /**
   * Get events by category
   * @param {string} category - Kategori event
   * @returns {Promise}
   */
  getEventsByCategory: (category) => 
    API.get(`/events/category/${category}`),

  /**
   * Search events
   * @param {string} query - Search query
   * @returns {Promise}
   */
  searchEvents: (query) => 
    API.get('/events/search', { params: { q: query } }),

  /**
   * Create event (organizer)
   * @param {Object} data - Event data
   * @returns {Promise}
   */
  createEvent: (data) => 
    API.post('/events', data),

  /**
   * Update event
   * @param {number} id - Event ID
   * @param {Object} data - Update data
   * @returns {Promise}
   */
  updateEvent: (id, data) => 
    API.put(`/events/${id}`, data),

  /**
   * Delete event
   * @param {number} id - Event ID
   * @returns {Promise}
   */
  deleteEvent: (id) => 
    API.delete(`/events/${id}`),
};

/**
 * Category Services
 */
export const categoryService = {
  /**
   * Get all categories
   * @returns {Promise}
   */
  getAll: () => 
    API.get('/categories'),

  /**
   * Get category with events
   * @param {string} slug - Category slug
   * @returns {Promise}
   */
  getWithEvents: (slug) => 
    API.get(`/categories/${slug}`),
};

/**
 * Ticket Services
 */
export const ticketService = {
  /**
   * Purchase tickets
   * @param {number} eventId - Event ID
   * @param {Object} data - Ticket purchase data
   * @returns {Promise}
   */
  purchase: (eventId, data) => 
    API.post(`/events/${eventId}/tickets/purchase`, data),

  /**
   * Get user tickets
   * @returns {Promise}
   */
  getUserTickets: () => 
    API.get('/tickets/my-tickets'),

  /**
   * Verify ticket
   * @param {string} qrCode - QR Code
   * @returns {Promise}
   */
  verify: (qrCode) => 
    API.post('/tickets/verify', { qr_code: qrCode }),
};

/**
 * Auth Services
 */
export const authService = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise}
   */
  login: (email, password) => 
    API.post('/auth/login', { email, password }),

  /**
   * Register user
   * @param {Object} data - Registration data
   * @returns {Promise}
   */
  register: (data) => 
    API.post('/auth/register', data),

  /**
   * Logout user
   * @returns {Promise}
   */
  logout: () => 
    API.post('/auth/logout'),

  /**
   * Get current user
   * @returns {Promise}
   */
  getCurrentUser: () => 
    API.get('/auth/me'),
};

/**
 * User Services
 */
export const userService = {
  /**
   * Get user profile
   * @returns {Promise}
   */
  getProfile: () => 
    API.get('/users/profile'),

  /**
   * Update user profile
   * @param {Object} data - Profile data
   * @returns {Promise}
   */
  updateProfile: (data) => 
    API.put('/users/profile', data),

  /**
   * Get user wallet
   * @returns {Promise}
   */
  getWallet: () => 
    API.get('/users/wallet'),

  /**
   * Top up wallet
   * @param {number} amount - Amount to top up
   * @returns {Promise}
   */
  topupWallet: (amount) => 
    API.post('/users/wallet/topup', { amount }),
};

export default API;
