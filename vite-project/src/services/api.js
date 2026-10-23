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

  register: async (name, email, password, phone = '', role = 'buyer', storeName = '') => {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone, role, storeName })
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
  },

  getWishlist: async () => {
    return await request('/auth/wishlist', { method: 'GET' }, true);
  },

  toggleWishlist: async (productId) => {
    return await request(`/auth/wishlist/${productId}`, { method: 'POST' }, true);
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
  },

  getAll: async () => {
    return await request('/orders', { method: 'GET' }, true);
  },

  updateStatus: async (id, orderStatus) => {
    return await request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ orderStatus })
    }, true);
  }
};

// Coupons API
export const couponAPI = {
  apply: async (code, cartTotal) => {
    return await request('/coupons/apply', {
      method: 'POST',
      body: JSON.stringify({ code, cartTotal })
    });
  },

  getAll: async () => {
    const token = localStorage.getItem('pisawat_token');
    return await request('/coupons', { method: 'GET' }, !!token);
  },

  create: async (couponData) => {
    return await request('/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData)
    }, true);
  },

  toggleStatus: async (id) => {
    return await request(`/coupons/${id}/toggle`, {
      method: 'PATCH'
    }, true);
  },

  delete: async (id) => {
    return await request(`/coupons/${id}`, {
      method: 'DELETE'
    }, true);
  }
};

// Seller API
export const sellerAPI = {
  getProducts: async () => {
    return await request('/seller/products', { method: 'GET' }, true);
  },

  createProduct: async (productData) => {
    return await request('/seller/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    }, true);
  },

  updateProduct: async (id, productData) => {
    return await request(`/seller/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    }, true);
  },

  deleteProduct: async (id) => {
    return await request(`/seller/products/${id}`, {
      method: 'DELETE'
    }, true);
  },

  getOrders: async () => {
    return await request('/seller/orders', { method: 'GET' }, true);
  },

  updateOrderStatus: async (id, orderStatus) => {
    return await request(`/seller/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ orderStatus })
    }, true);
  },

  getStats: async () => {
    return await request('/seller/stats', { method: 'GET' }, true);
  }
};

// Admin API
export const adminAPI = {
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';
    return await request(endpoint, { method: 'GET' }, true);
  },

  updateUserStatus: async (id, status, reason = '') => {
    return await request(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason })
    }, true);
  },

  updateUserRole: async (id, role) => {
    return await request(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    }, true);
  },

  deleteUser: async (id) => {
    return await request(`/admin/users/${id}`, {
      method: 'DELETE'
    }, true);
  },

  getStats: async () => {
    return await request('/admin/stats', { method: 'GET' }, true);
  }
};

// Health Check API
export const healthAPI = {
  check: async () => {
    return await request('/health', { method: 'GET' });
  }
};
