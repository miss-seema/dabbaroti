// Centralized API client with JWT token attachment and consistent error handling
// In local dev, talk directly to backend on 5001 to bypass any node proxy restrictions; otherwise use /api
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && (window.location.port === '3000' || window.location.port === '3001')) {
    return 'http://localhost:5001/api';
  }
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('dabbaroti_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong. Please try again.');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
};

export const api = {
  // Auth
  login: (credentials) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getProfile: () => apiFetch('/auth/profile'),
  updateProfile: (data) => apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  addAddress: (address) => apiFetch('/auth/address', { method: 'POST', body: JSON.stringify(address) }),

  // Plans
  getPlans: (type) => apiFetch(`/plans${type ? `?type=${type}` : ''}`),
  getPlanById: (id) => apiFetch(`/plans/${id}`),
  createPlan: (data) => apiFetch('/plans', { method: 'POST', body: JSON.stringify(data) }),
  updatePlan: (id, data) => apiFetch(`/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePlan: (id) => apiFetch(`/plans/${id}`, { method: 'DELETE' }),

  // Custom Plans
  calculateCustomPlan: (payload) => apiFetch('/custom-plans/calculate', { method: 'POST', body: JSON.stringify(payload) }),
  submitCustomPlanRequest: (data) => apiFetch('/custom-plans/request', { method: 'POST', body: JSON.stringify(data) }),
  getMyCustomRequests: () => apiFetch('/custom-plans/my-requests'),
  getAllCustomRequests: () => apiFetch('/custom-plans/all'),
  updateCustomPlanStatus: (id, data) => apiFetch(`/custom-plans/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),

  // Menu
  getMenu: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/menu${query ? `?${query}` : ''}`);
  },
  createMenuItem: (data) => apiFetch('/menu', { method: 'POST', body: JSON.stringify(data) }),
  updateMenuItem: (id, data) => apiFetch(`/menu/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMenuItem: (id) => apiFetch(`/menu/${id}`, { method: 'DELETE' }),

  // Orders
  createOrder: (orderData) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getMyOrders: () => apiFetch('/orders/my-orders'),
  getOrderById: (id) => apiFetch(`/orders/${id}`),
  getAllOrders: () => apiFetch('/orders'),
  updateOrderStatus: (id, data) => apiFetch(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),

  // Subscriptions
  getMySubscriptions: () => apiFetch('/subscriptions/my-subscriptions'),
  getAllSubscriptions: () => apiFetch('/subscriptions'),
  pauseSubscription: (id, data) => apiFetch(`/subscriptions/${id}/pause`, { method: 'PUT', body: JSON.stringify(data) }),
  resumeSubscription: (id) => apiFetch(`/subscriptions/${id}/resume`, { method: 'PUT' }),
  cancelSubscription: (id) => apiFetch(`/subscriptions/${id}/cancel`, { method: 'PUT' }),

  // Payments
  createRazorpayOrder: (payload) => apiFetch('/payments/razorpay/create-order', { method: 'POST', body: JSON.stringify(payload) }),
  verifyRazorpayPayment: (payload) => apiFetch('/payments/razorpay/verify', { method: 'POST', body: JSON.stringify(payload) }),

  // Coupons
  applyCoupon: (code, cartAmount) => apiFetch('/coupons/apply', { method: 'POST', body: JSON.stringify({ code, cartAmount }) }),
  getCoupons: () => apiFetch('/coupons'),
  createCoupon: (data) => apiFetch('/coupons', { method: 'POST', body: JSON.stringify(data) }),
  deleteCoupon: (id) => apiFetch(`/coupons/${id}`, { method: 'DELETE' }),

  // Reviews
  getReviews: () => apiFetch('/reviews'),
  submitReview: (data) => apiFetch('/reviews', { method: 'POST', body: JSON.stringify(data) }),

  // Admin
  getAdminStats: () => apiFetch('/admin/stats'),
  getAdminUsers: () => apiFetch('/admin/users'),
};
