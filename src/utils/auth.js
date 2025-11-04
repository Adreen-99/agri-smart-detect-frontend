const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://agri-smart-detect-backend-3-m0y3.onrender.com';

export const auth = {
  async login(email, password) {
    // Try live backend first
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
      console.error('Live backend login error:', error);

      // Fallback to local backend
      try {
        console.log('Trying local backend for login...');
        const localResponse = await fetch('http://localhost:5000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!localResponse.ok) {
          const localErrorData = await localResponse.json();
          throw new Error(localErrorData.message || 'Local login failed');
        }

        const localData = await localResponse.json();

        // Store user data and token
        localStorage.setItem('agri_smart_detect_user', JSON.stringify(localData.user));
        localStorage.setItem('agri_smart_detect_token', localData.token);

        return localData.user;
      } catch (localError) {
        console.error('Local backend login error:', localError);
        throw new Error('Failed to connect to server. Please try again later.');
      }
    }
  },

  async register(userData) {
    // Try live backend first
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

      // Store user data and simulate token (since backend doesn't return token)
      localStorage.setItem('agri_smart_detect_user', JSON.stringify(data));
      localStorage.setItem('agri_smart_detect_token', 'simulated-jwt-token'); // Simulate token

      return data;
    } catch (error) {
      console.error('Live backend registration error:', error);

      // Fallback to local backend
      try {
        console.log('Trying local backend for registration...');
        const localResponse = await fetch('http://localhost:5000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!localResponse.ok) {
          const localErrorData = await localResponse.json();
          throw new Error(localErrorData.errors?.join(', ') || 'Local registration failed');
        }

        const localData = await localResponse.json();

        // Store user data and simulate token
        localStorage.setItem('agri_smart_detect_user', JSON.stringify(localData));
        localStorage.setItem('agri_smart_detect_token', 'simulated-jwt-token');

        return localData;
      } catch (localError) {
        console.error('Local backend registration error:', localError);
        throw new Error('Failed to connect to server. Please try again later.');
      }
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
