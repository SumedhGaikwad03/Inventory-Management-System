const TOKEN_KEY = 'inventory_auth_token';

/**
 * Safe local storage accessor for authentication tokens
 */
// this gives the acces to read save and deltee token form local storage 
export const storage = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Ignore or log in dev
    }
  },

  clearToken: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Ignore
    }
  },
};
