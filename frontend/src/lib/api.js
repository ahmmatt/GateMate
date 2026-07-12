/**
 * Stub API client - returns empty responses so organizer pages
 * can render without a real backend.
 * Replace this with a real axios instance when the backend is ready.
 */
const api = {
  get: async (url, config) => {
    console.warn(`[api stub] GET ${url} - no backend connected`);
    return { data: { data: null, events: [], total: 0 } };
  },
  post: async (url, data, config) => {
    console.warn(`[api stub] POST ${url} - no backend connected`);
    return { data: { data: null, message: 'ok' } };
  },
  put: async (url, data, config) => {
    console.warn(`[api stub] PUT ${url} - no backend connected`);
    return { data: { data: null, message: 'ok' } };
  },
  patch: async (url, data, config) => {
    console.warn(`[api stub] PATCH ${url} - no backend connected`);
    return { data: { data: null, message: 'ok' } };
  },
  delete: async (url, config) => {
    console.warn(`[api stub] DELETE ${url} - no backend connected`);
    return { data: { data: null, message: 'ok' } };
  },
};

export default api;
