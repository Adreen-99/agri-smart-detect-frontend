const API_BASE_URL = 'https://clean-backend-6rgv.onrender.com';

export const auth = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
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

      // Store user data and token
      localStorage.setItem('agri_smart_detect_user', JSON.stringify(data.user));
      localStorage.setItem('agri_smart_detect_token', data.token);

      return data.user;
    } catch (error) {
      console.error('Backend login error:', error);
      throw new Error(error.message || 'Failed to connect to server. Please try again later.');
    }
  },

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.join(', ') || 'Registration failed');
      }

      const data = await response.json();

      // Store user data and token
      localStorage.setItem('agri_smart_detect_user', JSON.stringify(data));
      localStorage.setItem('agri_smart_detect_token', 'jwt-token');

      return data;
    } catch (error) {
      console.error('Backend registration error:', error);
      throw new Error(error.message || 'Failed to connect to server. Please try again later.');
    }
  },

  logout() {
    localStorage.removeItem('agri_smart_detect_user');
    localStorage.removeItem('agri_smart_detect_token');
  },

  getCurrentUser() {
    const user = localStorage.getItem('agri_smart_detect_user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('agri_smart_detect_token');
  }
};
