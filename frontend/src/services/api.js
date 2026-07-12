import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

// Request interceptor - tambah token jika ada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle error global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Redirect ke login sesuai jalur route
      const path = window.location.pathname
      if (path.startsWith('/admin') || path.startsWith('/superadmin')) {
        if (!path.includes('/login')) {
          window.location.href = '/superadmin/login'
        }
      } else if (!path.startsWith('/login') && !path.startsWith('/register')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ── Auth Services ──────────────────────────────────────────────────────────
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  registerOrganizer: (data) => api.post('/auth/register/organizer', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  sendOtp: (data) => api.post('/auth/otp/send', data),
  verifyOtp: (data) => api.post('/auth/otp/verify', data),
  googleRedirect: () => api.get('/auth/google/redirect'),
}

// ── Public Event Services ──────────────────────────────────────────────────
export const eventService = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  // Backward compatibility untuk pemanggilan lama
  create: (data) => api.post('/admin/events', data),
  update: (id, data) => api.put(`/admin/events/${id}`, data),
  delete: (id) => api.delete(`/admin/events/${id}`),
}

// ── Organizer (Admin Event) Services ───────────────────────────────────────
export const organizerService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getEvents: (params) => api.get('/admin/events', { params }),
  createEvent: (data) => api.post('/admin/events', data),
  getEventById: (id) => api.get(`/admin/events/${id}`),
  updateEvent: (id, data) => api.put(`/admin/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),
  toggleEventStatus: (id) => api.post(`/admin/events/${id}/toggle-status`),
  
  // Tiers
  createTier: (eventId, data) => api.post(`/admin/events/${eventId}/tiers`, data),
  updateTier: (eventId, tierId, data) => api.put(`/admin/events/${eventId}/tiers/${tierId}`, data),
  deleteTier: (eventId, tierId) => api.delete(`/admin/events/${eventId}/tiers/${tierId}`),
  
  // Tenants
  createTenant: (eventId, data) => api.post(`/admin/events/${eventId}/tenants`, data),
  updateTenant: (eventId, tenantId, data) => api.put(`/admin/events/${eventId}/tenants/${tenantId}`, data),
  deleteTenant: (eventId, tenantId) => api.delete(`/admin/events/${eventId}/tenants/${tenantId}`),
  
  // Attendees & Tickets
  approveAttendee: (eventId, attendeeId) => api.post(`/admin/events/${eventId}/attendees/${attendeeId}/approve`),
  rejectAttendee: (eventId, attendeeId) => api.post(`/admin/events/${eventId}/attendees/${attendeeId}/reject`),
  toggleCheckin: (eventId, transactionId) => api.post(`/admin/events/${eventId}/tickets/${transactionId}/toggle-checkin`),
  refundTicket: (eventId, transactionId) => api.post(`/admin/events/${eventId}/tickets/${transactionId}/refund`),
  
  // Withdrawals
  withdrawEvent: (eventId, data) => api.post(`/admin/events/${eventId}/withdraw`, data),
  approveWithdrawal: (eventId, id) => api.post(`/admin/events/${eventId}/withdraw/${id}/approve`),
  
  // Scanner
  verifyScanner: (orderId) => api.post('/admin/scanner/verify', { order_id: orderId }),
  approveScanner: (orderId) => api.post('/admin/scanner/approve', { order_id: orderId }),
  
  // Finance
  getFinance: () => api.get('/admin/finance'),
  withdrawFinance: (data) => api.post('/admin/finance/withdraw', data),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateProfile: (data) => api.post('/admin/settings/profile', data),
  updateSecurity: (data) => api.post('/admin/settings/security', data),
  uploadPhoto: (formData) => api.post('/admin/settings/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getSessions: () => api.get('/admin/settings/sessions'),
  deleteSession: (id) => api.delete(`/admin/settings/sessions/${id}`),
  deleteAllSessions: () => api.delete('/admin/settings/sessions/all'),
}

// ── Ticket / Buyer Services ────────────────────────────────────────────────
export const ticketService = {
  getMyTickets: () => api.get('/my-tickets'),
  getById: (id) => api.get(`/tickets/${id}`),
  purchase: (data) => api.post('/checkout', data),
  checkout: (data) => api.post('/checkout', data),
  updateVibe: (id, data) => api.post(`/tickets/${id}/vibe`, data),
  findAiMatch: (id) => api.get(`/tickets/${id}/ai-match`),
  getMatches: (id) => api.get(`/tickets/${id}/matches`),
  faceCapture: (data) => api.post('/account/face-capture', data),
}

// ── Wallet Services ────────────────────────────────────────────────────────
export const walletService = {
  index: () => api.get('/wallet'),
  topup: (data) => api.post('/wallet/topup', data),
  getTenantInfo: (id) => api.get(`/wallet/tenant/${id}`),
  processPayment: (id, data) => api.post(`/wallet/pay/${id}`, data),
}

// ── Chat & AI Matchmaking Services ─────────────────────────────────────────
export const chatService = {
  getInbox: () => api.get('/chat'),
  getMessages: (partnerId) => api.get(`/chat/${partnerId}`),
  sendMessage: (partnerId, data) => api.post(`/chat/${partnerId}`, data),
}

// ── Notification Services ──────────────────────────────────────────────────
export const notificationService = {
  getAll: () => api.get('/notifications'),
  markAsRead: () => api.post('/notifications/read'),
}

// ── Tenant Kasir Services ──────────────────────────────────────────────────
export const tenantService = {
  getDashboard: () => api.get('/tenant/dashboard'),
  storeMenu: (data) => api.post('/tenant/menus', data),
  withdraw: (data) => api.post('/tenant/withdraw', data),
}

// ── Superadmin Services ────────────────────────────────────────────────────
export const superadminService = {
  getDashboard: () => api.get('/superadmin/dashboard'),
  getPendingWithdrawals: () => api.get('/superadmin/withdrawals'),
  executeWithdrawal: (id) => api.post(`/superadmin/withdrawals/${id}/execute`),
  getOrganizers: () => api.get('/superadmin/organizers'),
  approveOrganizer: (id) => api.post(`/superadmin/organizers/${id}/approve`),
  rejectOrganizer: (id, reason) => api.post(`/superadmin/organizers/${id}/reject`, { reason }),
}

// Backward compatibility untuk userService lama
export const userService = {
  getAll: () => api.get('/admin/users'),
  getById: (id) => api.get(`/admin/users/${id}`),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
  delete: (id) => api.delete(`/admin/users/${id}`),
}

export default api
