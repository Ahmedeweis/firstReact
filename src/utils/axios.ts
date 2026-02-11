import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.site.serverUrl,
});

// Request interceptor to add headers dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt_access_token');
    const lang = localStorage.getItem('i18nextLng') || 'en';

    config.headers['Accept-Language'] = lang;

    // Only set Content-Type if not already set (allows multipart/form-data to be preserved)
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

export const createResource = async <T>(
  url: string,
  data: FormData,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axiosInstance.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    console.error('Failed to create resource:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const deleteResource = async (url: string, config?: AxiosRequestConfig): Promise<void> => {
  try {
    await axiosInstance.delete(url, config);
  } catch (error) {
    console.error('Failed to delete resource:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/auth/user/profile',
    signIn: '/auth/user/login',
    signUp: '/auth/user/register',
    resetPasswordRequest: '/auth/resend-otp',
    updatePassword: '/auth/reset-password',
    verifyEmail: '/auth/verifyToken',
    resendVerificationEmail: '/auth/resend-verification',
    uploadAvatar: '/auth/user/upload-avatar',
    logOut: '/auth/user/logout',
    addresses: '/auth/user/addresses',
    paymentMethods: '/auth/user/payment-methods',
  },
  investor: {
    overview: '/investor/dashboard',
    transactions: '/investor/transactions',
    contactUs: '/investor/contact-us',
    profitRequest: '/investor/profit-requests',
    paymentMethods: '/investor/payment-methods',
    withdraw: '/investor/wallet/withdraw',
    charge: '/investor/wallet/charge',
  },
  core: {
    countries: '/countries',
    states: '/states',
    cities: '/cities',
    manufacturers: '/manufacturers',
  },
  order: {
    list: '/orders',
    details: (id: string) => `/orders/${id}`,
    create: '/orders',
    ship: (id: string) => `/orders/${id}/ship`,
    pay: (id: string) => `/orders/${id}/pay`,
  },
  product: {
    list: '/products',
    details: (id: string) => `/products/${id}`,
  },
  category: {
    list: '/categories',
    details: (id: string) => `/categories/${id}`,
  },
  vendor: {
    product: {
      list: '/vendor/products',
      details: (id: string) => `/vendor/products/${id}`,
      create: '/vendor/products',
      update: (id: string) => `/vendor/products/${id}`,
      delete: (id: string) => `/vendor/products/${id}`,
    },
    order: {
      list: '/vendor/orders',
      details: (id: string) => `/vendor/orders/${id}`,
      ship: (id: string) => `/vendor/orders/${id}/shipments`, // Adjust based on actual API
      pay: (id: string) => `/vendor/orders/${id}/payments`, // Adjust based on actual API
    },
    successor: {
      list: '/vendor/successors',
      details: (id: string) => `/vendor/successors/${id}`,
      create: '/vendor/successors',
      update: (id: string) => `/vendor/successors/${id}`,
      delete: (id: string) => `/vendor/successors/${id}`,
    },
    referral: {
      list: '/vendor/referrals',
      tree: '/vendor/referrals/tree',
    },
  },
};
