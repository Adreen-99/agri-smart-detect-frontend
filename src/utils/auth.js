const API_BASE_URL = 'https://agri-smart-detect-backend.onrender.com'; // Updated to match backend without /api

export const auth = {
  async login(email, password) {
    try {
      // Check if user exists in localStorage (simulated backend)
      const storedUser = localStorage.getItem('agri_smart_detect_user');
      if (!storedUser) {
        throw new Error('No account found. Please register first.');
      }

      const user = JSON.parse(storedUser);

      // For now, simulate login validation - in real app, this would be server-side
      // Check if email matches stored user data
      if (user.email !== email) {
        throw new Error('Invalid email or password');
      }

      // In a real app, password would be hashed and verified on server
      // For demo purposes, we'll assume password is correct if email matches
      const simulatedToken = 'simulated-jwt-token-' + Date.now();

      // Update stored user data with token
      localStorage.setItem('agri_smart_detect_token', simulatedToken);

      return user;
    } catch (error) {
      throw new Error(error.message || 'Failed to connect to server');
    }
  },

  async register(userData) {
    try {
      // Use the backend /users POST route
      const response = await fetch(`${API_BASE_URL}/users`, {
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