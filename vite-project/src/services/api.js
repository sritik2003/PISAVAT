const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:50001/api';
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

const getHeaders = (isAuthRequired = false) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (isAuthRequired) {
    const token = localStorage.getItem('pisawat_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// Generic request wrapper
async function request(endpoint, options = {}, isAuthRequired = false) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(isAuthRequired),
      ...(options.headers || {})
    }
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error.message);
    throw error;
  }
}

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async (name, email, password, phone = '') => {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone })
    });
  },

  getMe: async () => {
    return await request('/auth/me', { method: 'GET' }, true);
  },

  updateProfile: async (userData) => {
    return await request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    }, true);
  },

  forgotPassword: async (email) => {
    return await request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }
};

// Products API
export const productAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return await request(endpoint, { method: 'GET' });
  },

  getByIdOrSlug: async (identifier) => {
    return await request(`/products/${identifier}`, { method: 'GET' });
  }
};

// Enquiries API
export const enquiryAPI = {
  create: async (enquiryData) => {
    return await request('/enquiries', {
      method: 'POST',
      body: JSON.stringify(enquiryData)
    });
  },

  getAll: async () => {
    return await request('/enquiries', { method: 'GET' }, true);
  }
};

// Orders API
export const orderAPI = {
  create: async (orderData) => {
    const token = localStorage.getItem('pisawat_token');
    return await request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }, !!token);
  },

  getMyOrders: async () => {
    return await request('/orders/my-orders', { method: 'GET' }, true);
  },

  getById: async (id) => {
    return await request(`/orders/${id}`, { method: 'GET' });
  }
};

// Health Check API
export const healthAPI = {
  check: async () => {
    return await request('/health', { method: 'GET' });
  }
};
