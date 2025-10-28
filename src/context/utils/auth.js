const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const TOKEN_KEY = 'authToken';
const CURRENT_USER_KEY = 'currentUser';

export const auth = {
  async login(email, password) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      const { token, user } = data;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to log in. Please try again.');
    }
  },

  async register(userData) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      const { token, user } = data;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Register error:', error);
      throw new Error(error.message || 'Failed to create account. Please try again.');
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser() {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }
};