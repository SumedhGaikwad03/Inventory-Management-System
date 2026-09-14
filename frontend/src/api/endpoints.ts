/**
 * Centralized API endpoint constants matching backend route templates.
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
  },
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id: number) => `/categories/${id}`,
  },
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: number) => `/products/${id}`,
  },
  TRANSACTIONS: {
    BASE: '/inventorytransactions',
    BY_ID: (id: number) => `/inventorytransactions/${id}`,
    BY_PRODUCT_ID: (productId: number) => `/inventorytransactions/product/${productId}`,
  },
} as const;
