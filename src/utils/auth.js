const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://agri-smart-detect-backend-3-m0y3.onrender.com';

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
      throw new Error(error.message || 'Failed to connect to server');
    }
  },

  async register(userData) {
    try {
<<<<<<< HEAD
      // Use the backend /api/auth/register POST route
=======
      // Use the backend /api/auth/register route
>>>>>>> dbf90866bd47f1eb23fc10fb9284404699c942a6
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

      // Store user data and simulate token (since backend doesn't return token)
      localStorage.setItem('agri_smart_detect_user', JSON.stringify(data));
      localStorage.setItem('agri_smart_detect_token', 'simulated-jwt-token'); // Simulate token

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to connect to server');
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
