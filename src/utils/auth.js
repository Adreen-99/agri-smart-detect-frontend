const API_BASE_URL = 'https://elegant-bonbon-c7e371.netlify.app/'; // Updated to match backend without /api

export const auth = {
  async login(username, password) {
    try {
      // For now, simulate login since backend doesn't have auth routes
      // In a real app, you'd implement proper auth
      const simulatedUser = { id: 1, username: username };
      const simulatedToken = 'simulated-jwt-token';

      // Store user data and token
      localStorage.setItem('agri_smart_detect_user', JSON.stringify(simulatedUser));
      localStorage.setItem('agri_smart_detect_token', simulatedToken);

      return simulatedUser;
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